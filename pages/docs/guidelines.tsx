import { NextPageContext } from 'next';
import React from 'react';
import { Button, Table } from 'reactstrap';

import { NextLayoutPage } from '../../types';

/**
 * TODO: Update with correct info from Gerard. Font is Open Sans and primary red color is of different hex
 */

const Page: NextLayoutPage = () => (
  <div className='Guidelines container'>
    <div className='guidelines'>
      <h1>Branding Assests and Guidelines</h1>
      <p className='text-section'>
        Thank you for your interest in Moob! We have a few guidelines for using Moob's brand
        resources. Please take a moment to familiarize yourself with them. You can download
        individual assets in each section. If you want the whole package, download the .zip file
        below.
        <br />
        <Button className='download' href='/moob-assets-guide.pdf' target='_blank'>
          Download Assests
        </Button>
      </p>
      <p className='text-section'>
        <h3>Logo Guidelines</h3>
        The Moob Logo can only be used for material relating to Moob. Modifying or editing the logo
        in any way is strictly prohibited. Only the assets available for download on this page
        should be used. Do not use unofficial assets from image searches, other websites, or even
        sealed manila envelopes marked as "Classified Logo Stuff".
      </p>
      <p className='text-section'>
        <h3>Brand Colors</h3>
        These are Moob's brand colors. Brilliant Scarlet is our primary color for all marketing
        material. All other colors listed should be used as highlights and cues to the Moob logo and
        brand.
        <br />
        <Table>
          <tbody>
            <tr>
              <td>
                Brilliant Scarlet <br /> Hex D62C28 <br /> RGB R214 G44 B40 <br /> CMYK C9 M97 Y100
                K1
                <br />
                PMS 485 c
              </td>
            </tr>
            <tr>
              <td>
                Sajo Red <br />
                Hex B52025
                <br />
                RGB R181 G32 B37
                <br />
                CMYK C22 M97 Y88 K13
                <br />
                PMS 1805 c
              </td>
            </tr>
          </tbody>
        </Table>
      </p>
      <p className='text-section'>
        <h3>Typography</h3>
        Our typeface is Roboto. Please stick to the following sizes.
        <br />
        <h1 style={{ color: 'black', marginBottom: '0' }}>Headline 1 is Roboto Bold at 33px</h1>
        <br />
        <h2 style={{ color: 'black', marginBottom: '0' }}>Headline 2 is Roboto Bold at 25px</h2>
        <br />
        <h3 style={{ color: 'black', marginBottom: '0' }}>Headline 3 is Roboto Bold at 16px</h3>
        <br />
        <p style={{ color: 'black' }}>Paragraphs are Roboto Regular at 16px</p>
      </p>
      <hr />
      <p className='text-section'>
        <h2>Legal</h2>
        Here's our friendly legal reminder that these graphics are proprietary and protected under
        intellectual property laws, so please use them correctly.
        <br />
        <strong>Do not</strong> display these graphics in a way that implies a relationship,
        affiliation, or endorsement by Boom of your product, service, or business.
        <br />
        <strong>Do not</strong> use these graphics as part of your own product, business, or
        services' name.
        <br />
        <strong>Do not</strong> alter these graphics in any way, or combine them with any other
        graphics without written consent from Moob.
      </p>
      <p className='text-section'>
        We invite you to learn more about us by simply doing business with us.{' '}
        <a href='tel:18442780072' className='contact'>
          Contact Us
        </a>{' '}
        today.
      </p>
    </div>
  </div>
);

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Branding Assets & Guidelines',
    },
  };
};

export default Page;
