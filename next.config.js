require('dotenv').config();

let firebaseConfig;

switch (process.env.FB_ENV) {
  case 'qa':
    console.log('Will use qa Firebase config');
    firebaseConfig = {
      apiKey: 'AIzaSyBWvChas2MELLM3MRcsMgvXXg-WZjTiz84',
      authDomain: 'boom-platform--qa.firebaseapp.com',
      databaseURL: 'https://boom-platform--qa.firebaseio.com',
      projectId: 'boom-platform--qa',
      storageBucket: 'boom-platform--qa.appspot.com',
      messagingSenderId: '405333705247',
      appId: '1:405333705247:web:c39f2c56bf7e5dd9fe4b2a',
      measurementId: 'G-2E7RW3CLJF',
    };
    break;
  case 'production':
    console.log('Will use production Firebase config');
    firebaseConfig = {
      apiKey: 'AIzaSyDoKpvW-GjeLuzNGY5HDwCXwTlOY49fsaY',
      authDomain: 'boom-platform-prod.firebaseapp.com',
      databaseURL: 'https://boom-platform-prod.firebaseio.com',
      projectId: 'boom-platform-prod',
      storageBucket: 'boom-platform-prod.appspot.com',
      messagingSenderId: '946135355209',
      appId: '1:946135355209:web:e374eab5f5b6d2f6',
    };
    break;
  case 'development':
  case undefined:
    console.log('Will use development Firebase config');
    firebaseConfig = {
      apiKey: 'AIzaSyAe6ubxUIePJluT8o008sVqFoxgtQ8RlJY',
      authDomain: 'boom-platform-385f1.firebaseapp.com',
      databaseURL: 'https://boom-platform-385f1.firebaseio.com',
      projectId: 'boom-platform-385f1',
      storageBucket: 'boom-platform-385f1.appspot.com',
      messagingSenderId: '1052865357755',
      appId: '1:1052865357755:web:f9660967c30dd8d3',
    };
    break;
  default:
    throw new Error('Could not set a Firebase config for FB_ENV:' + process.env.FB_ENV);
}

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig: {
    FIREBASE_CLIENT_CONFIG: firebaseConfig,
  },
  images: {
    domains: [
      'm.media-amazon.com',
      'www.img.url.com',
      'www.silverfran_test.com',
      'd1k0ppjronk6up.cloudfront.net',
      'api.moobmarketplace.com',
      'devapi.moobmarketplace.com',
      'via.placeholder.com',
      'localhost',
    ],
  },
  webpack(config) {
    config.node = { fs: 'empty' };
    return config;
  },
};
