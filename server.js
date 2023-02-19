/* eslint-disable camelcase */
require('dotenv').config();

const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { parse } = require('url');
const path = require('path');

var isDevelopment = false;
if (process.env && process.env.NODE_ENV) {
  isDevelopment = String(process.env.NODE_ENV).trim() === 'development';
}
const app = next({ dev: isDevelopment });

const handle = app.getRequestHandler();
const port = process.env.PORT || 4300;

const server = express();
// Proxy calls to elastic search, can use caching here or in react-query via ssr
// Moved creating server before next because next body parser was interfering

app
  .prepare()
  .then(() => {
    enableSearch(server);

    if (isDevelopment) {
      server.use(
        '/api/v1',
        createProxyMiddleware({
          target: 'http://localhost:3000',
          changeOrigin: true,
          logLevel: 'debug',
        })
      );
    }

    server.get('/robots.txt', (req, res) => {
      const options = {
        root: path.join(__dirname, '/public/'),
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      };
      return res.status(200).sendFile('robots.txt', options);
    });

    server.get('/merchant-details/:id', (req, res) => {
      const queryParams = { id: req.params.id };
      app.render(req, res, '/merchant-details', queryParams);
    });

    server.get('/offer/:id', (req, res) => {
      const queryParams = { id: req.params.id, itemType: 'offer' };
      app.render(req, res, '/offer', queryParams);
    });

    server.get('/product/:id', (req, res) => {
      const queryParams = { id: req.params.id, itemType: 'product' };
      app.render(req, res, '/offer', queryParams);
    });

    server.get('/confirm-transfer/:id', (req, res) => {
      const queryParams = { id: req.params.id };
      app.render(req, res, '/confirm-transfer', queryParams);
    });

    server.get('/cancel-transfer/:id', (req, res) => {
      const queryParams = { id: req.params.id };
      app.render(req, res, '/cancel-transfer', queryParams);
    });

    // elastic beanstalk health-check routing
    server.get('/health-check', (req, res) => {
      const options = {
        root: path.join(__dirname, '/public/'),
        headers: {
          'Content-Length': 0,
        },
      };
      return res.status(200).sendFile('health-check.html', options);
    });

    // verification file for boomcard.net email
    server.get('/google4622ba2eb1e64913.html', (req, res) => {
      const options = {
        root: path.join(__dirname, '/public/'),
      };
      return res.status(200).sendFile('google4622ba2eb1e64913.html', options);
    });

    server.get('*', (req, res) => {
      // const parsedUrl = parse(req.url, true)
      // const { pathname } = parsedUrl
      // console.log('Requested:', pathname)
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`, `NODE_ENV is: '${process.env.NODE_ENV}'`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });

function getParams(path, indexName) {
  const obj = {
    pathRewrite: {
      [path]: indexName,
    },
    target: process.env.SEARCH_URL,
    changeOrigin: true,
    logLevel: 'debug',
    xfwd: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `ApiKey ${process.env.SEARCH_API_KEY}`,
    },
    onProxyRes: function (proxyRes, req, res) {
      //console.log('proxyRes', proxyRes.headers);
      //proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    prependPath: true,
  };
  if (path === '^/_search$') {
    obj.queryParams = { scroll: '5m' };
  }
  return obj;
}

/**
 * This enables to call elasticsearch using our webserver as proxy to make the calls - Could be not optimal
 *
 * @param {Express} app
 */
function enableSearch(app) {
  // TODO: Review with Travis to know if this is needed
  const searchData = getParams('^/_search$', `/${process.env.SEARCH_INDEX_DEV}/_search?scroll=5m`);

  app.post(
    ['/_search', '/_search/scroll'],
    createProxyMiddleware(['/_search', '/_search/scroll'], searchData)
  );
}
