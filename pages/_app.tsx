import 'react-datepicker/dist/react-datepicker.css';
import '../styles/bootstrap.scss';
import '../styles/_register.scss';

import App from 'next/app';
import Head from 'next/head';
import withReduxSaga from 'next-redux-saga';
import withRedux from 'next-redux-wrapper';
import React, { createContext, useEffect } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { Provider, useDispatch } from 'react-redux';

import FormPhoneConfirmation from '../components/FormPhoneConfirmation';
import LayoutMain from '../components/LayoutMain';
import {
  initSearch,
  ProductSearchControlsCtx,
  ProductSearchQuery,
  SearchQuery,
  useProductSearch,
} from '../components/search';
import ToastGlobal from '../components/ToastGlobal';
import {
  rehydrateLocalStorage,
  requestAppInitialize,
  setGeolocation,
  setGlobalToast,
  setIp,
} from '../redux/actions/app';
import { requestCategories } from '../redux/actions/search';
import { initializeStore } from '../redux/store';
interface Props {
  Component: any;
  pageProps: any;
  store: any;
}

class MyApp extends App<Props> {
  // static async getInitialProps({ Component, ctx }) {
  //   // console.log( Component )
  //   const reduxStore = ctx.store;

  //   if (ctx.isServer) {
  //     const ip = require('public-ip'); // TODO: Replace by other library
  //     const ipV4 = await ip.v4();
  //     reduxStore.dispatch(setIp(ipV4));
  //   }
  //   // Will run on each page load, but only will cancel and re-add the auth state listener since the rest is already initialized
  //   reduxStore.dispatch(requestAppInitialize());

  //   const pageProps =
  //     Component && Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  //   return { pageProps };
  // }

  componentDidMount() {
    this.props.store.dispatch(requestAppInitialize?.());
    this.props.store.dispatch(rehydrateLocalStorage?.());
    this.props.store.dispatch(requestCategories?.());
    navigator.geolocation.watchPosition(
      (position) => {
        this.props.store.dispatch(
          setGeolocation(position.coords.latitude, position.coords.longitude)
        );
      },
      (error) => {
        this.props.store.dispatch(setGeolocation(2, 2));
      }
    );
  }

  render() {
    const {
      Component,
      pageProps: { ...pageProps },
      store,
    } = { ...this.props, pageProps: { dehydratedState: undefined, ...this.props.pageProps } };

    // Used to render a "wrapper" layout around a group of pages, that should persist while navigating
    const getLayout = Component.getLayout || ((page: any) => page);
    return (
      <Provider store={store}>
        <Head>
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1' />
          {pageProps.globalProps?.headTitle && <title>{pageProps.globalProps.headTitle}</title>}
        </Head>
        <FormPhoneConfirmation />
        <ToastGlobal setGlobalToast={setGlobalToast} />
        <LayoutMain>{getLayout(<Component {...pageProps} />, pageProps)}</LayoutMain>
      </Provider>
    );
  }
}

//const queryCache = new QueryCache();
//export const AppElasticQueryCache = createContext(queryCache); // Used on web\___search_reference_remove___\components\search\ProductSearch.tsx

/*
TODO: Enabling this is causing memory issues
export function AppQueryCache(props) {
  return (
    <AppElasticQueryCache.Provider value={queryCache}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <MyApp {...props} />
      </ReactQueryCacheProvider>
    </AppElasticQueryCache.Provider>
  );
}
*/
export default withRedux(initializeStore)(withReduxSaga(MyApp));
