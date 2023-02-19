import { Order } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TableCustomerRetunsAndOrders from '../../../components/customer/TableCustomerRetunsAndOrders';
import { getLayout } from '../../../components/LayoutAccount';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { requestOrderHistory } from '../../../redux/actions/account-member';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  isUserSignedIn: boolean;
  orders: Order[];
  requestOrderHistory: typeof requestOrderHistory;
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({ isUserSignedIn, requestOrderHistory, orders }) => {
  useEffect(() => {
    if (isUserSignedIn && requestOrderHistory) {
      requestOrderHistory(null, 10);
    }
  }, [isUserSignedIn, requestOrderHistory]);

  return (
    <>
      <TableCustomerRetunsAndOrders orders={orders} />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  orders: state.accountMember.orders,
  isUserSignedIn: state.auth.isUserSignedIn,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_RETURNS_AND_ORDERS,
    },
    globalProps: {
      headTitle: 'Returns & Orders',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
