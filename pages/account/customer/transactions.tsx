import { Money, Transaction, TransactionType } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import TableMemberTransactionHistory from '../../../components/TableMemberTransactionHistory';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { requestTransactionHistory } from '../../../redux/actions/account-member';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  isUserSignedIn: boolean;
  transactions: Transaction[];
  requestTransactionHistory: typeof requestTransactionHistory;
  funds: Money;
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  funds,
  isUserSignedIn,
  transactions,
  requestTransactionHistory,
}) => {
  useEffect(() => {
    if (isUserSignedIn && requestTransactionHistory) {
      requestTransactionHistory(TransactionType.PURCHASE, null, 10);
    }
  }, [isUserSignedIn, requestTransactionHistory]);

  const _onSearchRequested = (type: TransactionType, filters?: any, limitTo?: number) => {
    requestTransactionHistory(type, filters, limitTo);
  };

  return (
    <TableMemberTransactionHistory
      transactions={transactions}
      balance={funds}
      requestSearch={_onSearchRequested}
    />
  );
};

const mapStateToProps = (state: AppState) => ({
  transactions: state.accountMember.transactions,
  isUserSignedIn: state.auth.isUserSignedIn,
  funds: state.accountMember.funds,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_TRANSACTIONS,
    },
    globalProps: {
      headTitle: 'Transactions',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
