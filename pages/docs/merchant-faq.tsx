import { NextPageContext } from 'next';
import React from 'react';

import NavToc from '../../components/NavToc';
import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => (
  <div className='container'>
    <div className='row'>
      <div className='docs-container col-md-8'>
        <h1>MERCHANT SUPPORT</h1>
        <h2 id='section1'>What If a Moob Member doesn't have enough credit on their Moob Card?</h2>
        <div className='text-section'>
          That is no problem at all; just let the member know that they can buy credit from Moob
          which will be added to their card/ account in seconds, they can use the Moob tablet right
          inside your store. Members can also do this on their smart phone if they have downloaded
          the Moob Mobile App. Members can also link their debit or credit card to their Moob Card
          so; in the future they can access funds without having to use multiple cards. They can
          even set an automatic credit reload minimum, so they get alerted anytime their credit
          falls below a certain minimum.
        </div>

        <h2 id='section2'>I already have a tablet. Can I use that?</h2>
        <div className='text-section'>
          It is always best to start out with fresh up to date equipment, but if you want to use
          your own tablet then you can. You can add our software to your tablet. You will still need
          the Moob Cardreader to have full capabilities.
        </div>

        <h2 id='section3'>Do I have to type in the customer's Moob Card number?</h2>
        <div className='text-section'>
          No, the member swipes their Moob Card or scans their Moob App with the Moob Tablet at your
          checkout stand.
        </div>

        <h2 id='section4'>My store is outside the USA. Will Moob work for me in my country?</h2>
        <div className='text-section'>
          Yes! Moob is available in many countries. Contact us for more information on how to get
          started in your country.
        </div>

        <h2 id='section5'>
          Why should I give out a Moob Card when the customer might shop at my competitor?
        </h2>
        <div className='text-section'>
          What tastier way to earn money than to earn that money from your competitor? Every time
          you give a Moob Card to a customer and that customer shops at another business, you will
          receive a portion of the fee we charge that business. You can earn thousands of dollars
          per year by encouraging your customers to sign up and use their Moob App or Moob Card.
        </div>

        <h2 id='section6'>How does the loyalty program work?</h2>
        <div className='text-section'>
          Moob members want the great deals that Moob businesses offer, but they also want the cash
          rewards. They will keep coming back to Moob businesses to get the cash rewards and the
          current deals.
        </div>

        <h2 id='section7'>How big of a discount do I need to offer?</h2>
        <div className='text-section'>
          The amount of cashback you offer is up to you. It can be as small at 5%, but many
          businesses find that 50% rewards for a very limited time is very effective.
        </div>

        <h2 id='section8'>Coupons didn't work for me, so how is Moob different?</h2>
        <div className='text-section'>
          Moob is so successful because the members do not have to clip coupons and remember to use
          them. Members stay connected with your business. You can send them email blasts directly,
          interact with them on social media platforms and let them know when you have great deals
          waiting for them. We also give you the stats to show how well your marketing campaigns are
          working.
        </div>

        <h2 id='section9'>Do you offer Moob ads / logos that I can use?</h2>
        <div className='text-section'>
          Yes, we offer our logo in two different styles and in many sizes for you to use in email
          blasts, on your website and in any other advertising. See our Assest Guidelines where you
          can download the graphics and get other branding information.
        </div>

        <h2 id='section10'>
          Can my customer use the Moob App without having a physical Moob Card? Will they get the
          Cash Back Rewards?
        </h2>
        <div className='text-section'>
          Yes, they can!
          <div className='indent'>
            <strong>1.</strong> When they download the Moob App and verify their email address, they
            will be able to scan their QR code in the app at check-out.
            <br />
            <strong>2.</strong> They can also register on the Moob website and use their account on
            the website instead of the app. After the initial email verification, they can use their
            smartphone to pull up their account on the Moob website. The merchant scans the QR code
            that displays in the customer's account. Both the Moob App and the customer's account on
            Moob 's mobile-friendly website have their QR code that the merchant can scan. Once it
            is scanned, they'll immediately see their Cash Back Rewards tokens. The Moob Card, Moob
            App and the customer's account on the Moob website are all linked to the customer's
            unique account number and QR code.
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
      headTitle: 'Merchant Support',
    },
  };
};

export default Page;
