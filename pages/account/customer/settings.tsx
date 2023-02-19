import { NextPageContext } from 'next';
import React from 'react';

import FormCustomerEditProfile from '../../../components/customer/forms/EditProfile';
import FormMemberBoomCardInfo from '../../../components/FormMemberBoomCardInfo';
import FormMemberLinkBankAccount from '../../../components/FormMemberLinkBankAccount';
import HeaderAccount from '../../../components/HeaderAccount';
import { getLayout } from '../../../components/LayoutAccount';
import { LayoutTabs } from '../../../constants';
import { NextLayoutPage } from '../../../types';

const Page: NextLayoutPage = () => {
  return (
    <>
      <HeaderAccount title='Account Edit Profile' />
      <FormCustomerEditProfile />
      <HeaderAccount title='Link Bank Account' />
      <FormMemberLinkBankAccount merchantUser={false} />
      <HeaderAccount title='Moob Card Information' />
      <FormMemberBoomCardInfo />
    </>
  );
};

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_SETTINGS,
    },
    globalProps: {
      headTitle: 'Settings',
    },
  };
};

Page.getLayout = getLayout;

export default Page;
