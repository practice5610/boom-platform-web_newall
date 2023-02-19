import { NextPageContext } from 'next';
import React from 'react';

import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => (
  <div className='container'>
    <div className='docs-container'>
      <h1>ABOUT</h1>
      <p>
        Moob Marketplace is owned and operated in the USA by Moob LLC, a company that is dedicated
        to creating a wide array of innovative loyalty products for corporations, small businesses
        and consumers.
      </p>
      <br />
      <p>
        Moob Marketplace is a system that is easy to use. It is an affordable solution for
        businesses that want to develop customers that are loyal to their brand. With Moob
        Marketplace, their customers receive deals and discounts and then they keep returning to
        obtain the cash back rewards. The Moob Marketplace merchant sees a quick rise in customer
        loyalty and experiences more new customers from referrals.
      </p>
      <br />
      <p>
        At Moob Marketplace, we are not done innovating. Going forward, we will continue developing
        even more innovative and cost savings techniques for businesses in the Moob Marketplace
        program. So far, business customers love the programs and the deals, discounts and cash back
        rewards. Businesses love the program for the increase in business and cash flow. So, we will
        continue to develop and expand this successful program.
      </p>
      <br />
      <p>
        We invite you to learn more about us by simply doing business with us. Contact us today.
      </p>
    </div>
  </div>
);

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'About Moob Rewards Brand Loyalty and Cash Back Program',
    },
  };
};

export default Page;
