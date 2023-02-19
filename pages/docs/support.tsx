import { NextPageContext } from 'next';
import React from 'react';

import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => <>support page</>;

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Support',
    },
  };
};
export default Page;
