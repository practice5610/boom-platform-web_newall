import {
  AllOptionalExceptFor,
  BoomUser,
  InventoryItemType,
  InventoryOrder,
  Store,
} from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import HeaderAccount from '../../../components/HeaderAccount';
import { getLayout } from '../../../components/LayoutAccount';
import { FilterableOrderList } from '../../../components/merchant/inventoryOrdersHistory/FilterableOrderTable';
import { PageData } from '../../../components/merchant/Pagination';
import MerchantInventory from '../../../components/MerchantInventory';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import {
  requestFilteredInventoryOrders,
  requestStore,
} from '../../../redux/actions/account-merchant';
import { setLoadingOverlay } from '../../../redux/actions/app';
import { getInventoryItemTypes } from '../../../redux/actions/inventory';
import { getInventoryOrders } from '../../../redux/actions/order';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  isInitialized?: boolean;
  isUserSignedIn: boolean;
  error?: string | undefined;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  store?: Store;
  requestStore?: typeof requestStore;
  inventoryItemTypes: InventoryItemType[];
  getInventoryItemTypes: typeof getInventoryItemTypes;
  inventoryOrders: InventoryOrder[];
  getInventoryOrders: typeof getInventoryOrders;
  setLoadingOverlay: typeof setLoadingOverlay;
  requestFilteredInventoryOrders?: typeof requestFilteredInventoryOrders;
  inventoryOrder?: InventoryOrder[];
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  isInitialized,
  isUserSignedIn,
  error,
  user,
  store,
  requestStore,
  inventoryItemTypes,
  getInventoryItemTypes,
  getInventoryOrders,
  setLoadingOverlay,
  requestFilteredInventoryOrders,
  inventoryOrder,
}) => {
  useEffect(() => {
    if (isInitialized && isUserSignedIn) {
      setLoadingOverlay(true);
      if (!store) {
        requestStore?.();
      }
      if (inventoryItemTypes !== null) {
        getInventoryItemTypes();
      }
      getInventoryOrders();
    }
  }, [isInitialized, isUserSignedIn]);

  useEffect(() => {
    if (inventoryItemTypes !== null && store) {
      setLoadingOverlay(false);
    }
    if (error) {
      setLoadingOverlay(false);
    }
  }, [inventoryItemTypes, store, error, setLoadingOverlay]);

  const [filterState, setFilterState] = useState<string>('');

  const onPageChanged = (data: PageData) => {
    const { currentPage } = data;
    requestFilteredInventoryOrders?.(filterState, 10, currentPage * 10 - 10);
  };

  const onFilterChanged = (filter: string) => {
    setFilterState(filter);
    requestFilteredInventoryOrders?.(filter, 10, 0);
  };

  return (
    <div className='MerchantInventory pb-5'>
      <FilterableOrderList
        title='Your orders list'
        inventoryOrder={inventoryOrder}
        onPageChanged={onPageChanged}
        onFilterChanged={onFilterChanged}
      />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isInitialized: state.app.isInitialized,
  isUserSignedIn: state.auth.isUserSignedIn,
  error: state.errors.apiError,
  user: state.auth.user,
  store: state.accountMerchant.store,
  inventoryItemTypes: state.inventory.inventoryItemTypes,
  inventoryOrder: state.order.inventoryOrders,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_MERCHANT_INVENTORY,
    },
    globalProps: {
      headTitle: 'Merchant Inventory',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
