import { NextPageContext } from 'next';
import React from 'react';

import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => (
  <div className='container'>
    <div className='docs-container'>
      <h1>Resources</h1>
      <p>Resources content here.</p>
      <br />
      <p>
        We invite you to learn more about us by simply doing business with us.
        <a href='tel:18442780072'>Contact us</a> today.
      </p>
    </div>
  </div>
);

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'About Moob Marketplace Brand Loyalty and Cash Back Program',
    },
  };
};

export default Page;
