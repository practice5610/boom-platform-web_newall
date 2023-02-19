import { NextPageContext } from 'next';
import React from 'react';
import { Table } from 'reactstrap';

import { NextLayoutPage } from '../../types';

/**
 * TODO: Program to allow the creation of blog posts and the population of blog posts with pagination
 */

const Page: NextLayoutPage = () => (
  <div className='Blog container'>
    <img className='banner-image' src='/images/banner-8.png' alt='banner'></img>
    <div className='blog'>
      <h1>Blog</h1>
      <Table responsive>
        <tbody>
          <tr>
            <td>
              <img className='post-image' src='/images/banner-8.png' alt='post'></img>
            </td>
            <td>
              <h5>This is the awesome title of this posting</h5>
              <span style={{ fontSize: '12px' }}>Written on this Feb 24, 2015 by Billy Bob</span>
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi possimus, eius fuga hic
              velit recusandae placeat non labore id eum ducimus dolores veniam. Error dolore atque
              commodi. Enim, quasi asperiores...<a className='contact'>Read More</a>
            </td>
          </tr>
          <tr>
            <td>
              <img className='post-image' src='/images/banner-8.png' alt='post'></img>
            </td>
            <td>
              <h5>This is the awesome title of this posting</h5>
              <span style={{ fontSize: '12px' }}>Written on this Feb 24, 2015 by Billy Bob</span>
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi possimus, eius fuga hic
              velit recusandae placeat non labore id eum ducimus dolores veniam. Error dolore atque
              commodi. Enim, quasi asperiores...<a className='contact'>Read More</a>
            </td>
          </tr>
          <tr>
            <td>
              <img className='post-image' src='/images/banner-8.png' alt='post'></img>
            </td>
            <td>
              <h5>This is the awesome title of this posting</h5>
              <span style={{ fontSize: '12px' }}>Written on this Feb 24, 2015 by Billy Bob</span>
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi possimus, eius fuga hic
              velit recusandae placeat non labore id eum ducimus dolores veniam. Error dolore atque
              commodi. Enim, quasi asperiores...<a className='contact'>Read More</a>
            </td>
          </tr>
        </tbody>
      </Table>
      <hr />
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
      headTitle: 'About Moob Rewards Brand Loyalty and Cash Back Program',
    },
  };
};

export default Page;
