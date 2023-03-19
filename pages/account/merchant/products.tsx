import { Product, Store } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import { PageData } from '../../../components/merchant/Pagination';
import { FilterableProductsTable } from '../../../components/merchant/products/FilterableProductsTable';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { requestFilteredProducts, requestStore } from '../../../redux/actions/account-merchant';
import { setLoadingOverlay } from '../../../redux/actions/app';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  requestFilteredProducts?: typeof requestFilteredProducts;
  setLoadingOverlay: typeof setLoadingOverlay;
  requestStore?: typeof requestStore;
  products?: { products: Product[]; count: number };
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
  store?: Store;
  error?: string | undefined;
}

const Page: NextLayoutPage<Props> = ({
  requestFilteredProducts,
  products,
  setLoadingOverlay,
  requestStore,
  store,
  error,
}) => {
  const [filterState, setFilterState] = useState<string>('');
  const productsList = products ?? { products: [], count: 0 };

  useEffect(() => {
    setLoadingOverlay(true);
    if (!store) {
      requestStore?.();
    }
  }, []);

  useEffect(() => {
    if (products !== null && store) {
      setLoadingOverlay(false);
    }
    if (error) {
      setLoadingOverlay(false);
    }
  }, [products, store, error, setLoadingOverlay]);

  /**
   * This function dispatch the action to fetch products depends on page selected on Pagination.
   * @param data
   */
  const onPageChanged = (data: PageData) => {
    const { currentPage } = data;
    requestFilteredProducts?.(filterState, 10, currentPage * 10 - 10);
  };

  /**
   * This function set the filter state and dispatch an action to fetch product by that filter.
   * @param filter
   */
  const onFilterChanged = (filter: string) => {
    setFilterState(filter);
    requestFilteredProducts?.(filter, 10, 0);
  };

  return (
    <FilterableProductsTable
      title='Your product list'
      products={productsList}
      onPageChanged={onPageChanged}
      onFilterChanged={onFilterChanged}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  products: state.accountMerchant.products,
  store: state.accountMerchant.store,
  error: state.errors.apiError,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_MERCHANT_PRODUCTS,
    },
    globalProps: {
      headTitle: 'Merchant Products',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
