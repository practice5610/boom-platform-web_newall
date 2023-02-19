import { Transaction } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';

import { getLayout } from '../../../components/LayoutAccount';
import MerchantTransactions from '../../../components/MerchantTransactions';
import { LayoutTabs } from '../../../constants';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';
interface Props {
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = () => {
  return <MerchantTransactions />;
};

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_MERCHANT_TRANSACTIONS,
    },
    globalProps: {
      headTitle: 'Merchant Transactions',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default Page;
