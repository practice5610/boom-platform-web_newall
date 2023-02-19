import { NextPageContext } from 'next';
import React from 'react';

import NavToc from '../../components/NavToc';
import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => (
  <div className='container'>
    <div className='row'>
      <div className='docs-container col-md-8'>
        <h1>MEMBER SUPPORT</h1>
        <h2 id='section1'>How much does Moob Cost?</h2>
        <div className='text-section'>
          Your Moob Card and Moob App are 100% free. Download the app and pick up a Moob Card at a
          participating retailer. You will start earning rewards and receive cashback ( payable in
          tokens) with your first purchase.
        </div>

        <h2 id='section2'>How do I get my cash rewards?</h2>
        <div className='text-section'>
          Your rewards will appear in your Moob Card account. You can spend your rewards when you
          use your Moob App or Moob Card at participating shops. Just swipe your card at checkout.
        </div>

        <h2 id='section3'>Can you add my favorite store?</h2>
        <div className='text-section'>
          Yes, we can add deals for your favorite shop or restaurant! Use the Moob app to vote for
          the business and we'll take care of the rest.
        </div>

        <h2 id='section4'>How big are the discounts I'll get?</h2>
        <div className='text-section'>
          We don't offer discounts, instead we offer Cashback rewards that can range from a small
          percentage to over 80%, depending on what the shop wants to offer. Shops usually want to
          offer very large cash back rewards so that customers will come in right away.
        </div>

        <h2 id='section5'>Is the Moob App Free?</h2>
        <div className='text-section'>
          Yes, the Moob App is 100% free and you can download it using GooglePlay, AppStore or have
          a text code for download sent to you from this website.
        </div>

        <h2 id='section6'>Can you join Moob if you don't have a smartphone?</h2>
        <div className='text-section'>
          Yes, you can use the physical Moob Card to get deals and cash rewards instead of using the
          smartphone app. Just swipe your Moob Card at the store when you shop. Log In at this
          website to manage your account.
        </div>

        <h2 id='section7'>
          What if I don't have enough money on my Moob card to make a full purchase?
        </h2>
        <div className='text-section'>
          That is not a problem; you can actually Buy Moob Credit from Moob marketplace using your
          Smartphone or the Moob in-store tablet located at all Moob participating Merchants. You
          will need a credit or debit card. Swipe it at the in-store Moob Tablet or enter the credit
          / debit card information on the Moob website or Moob App and that's it, credit will be
          added to your Moob card account in seconds. You can also link your credit card to your
          Moob Card, this will:
          <div className='indent'>
            <strong>1.</strong> Help to protect your Credit or Debit Card information.
            <br />
            <strong>2.</strong> Allow you to set your credit / Debit card to automatically add funds
            to your Moob Card if your cash back rewards balance falls below whatever dollar amount
            you set.
            <br />
            <strong>3.</strong> Makes it easier to use your Moob card, since you are confident that
            funds are always on your Moob Card.
          </div>
        </div>

        <h2 id='section8'>
          Can I just use the Moob App without having a physical Moob Card? Can I still get the Cash
          Back Rewards?
        </h2>
        <div className='text-section'>
          Yes, you can!
          <div className='indent'>
            <strong>1.</strong> When you download the App and verify your email address, you will be
            able to scan your QR code in the app at check-out.
            <br />
            <strong>2.</strong> You can also register on the Moob website and use your account on
            the website instead of the app. After the initial email verification, you can use your
            smartphone to pull up your account on the Moob website. The merchant will scan the QR
            code that displays in your account. Both the Moob App and your account on Moob’s
            mobile-friendly website have your QR code that the merchant can scan. Once it is
            scanned, you'll immediately see your Cash Back Rewards tokens in your account. The Moob
            Card, Moob App and your account on our website are all linked to your unique account
            number and QR code.
          </div>
        </div>
      </div>
      <div className='col-md-4'>
        <NavToc
          sections={[
            'section1',
            'section2',
            'section3',
            'section4',
            'section5',
            'section6',
            'section7',
            'section8',
          ]}
        />
      </div>
    </div>
  </div>
);

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Member Support',
    },
  };
};

export default Page;
