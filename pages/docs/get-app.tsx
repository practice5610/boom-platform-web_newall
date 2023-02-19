import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React from 'react';
import { Button, Col, Form, Input, Row } from 'reactstrap';

import { NextLayoutPage } from '../../types';

/**
 * TODO: Program page to have members input their phone number to receive text link to download app
 */

const Page: NextLayoutPage = () => {
  return (
    <div className='GetApp container'>
      <div className='get-the-app'>
        <h1>GET THE APP</h1>
        <Row>
          <Col lg={4}>
            <p className='text-section'>
              Start earning cash back! <br /> Download the MOOB App
            </p>
            <Form>
              <Row form>
                <p className='addPadding'>
                  Enter your phone number in the space below to receive a link to download our app.
                </p>
              </Row>
              <Row form>
                <Col md={6}>
                  <Input
                    type='tel'
                    id='phone'
                    className='inputPhone'
                    placeholder='_ _ _ - _ _ _ - _ _ _ _'
                  />
                </Col>
                <Col md={6}>
                  <Button type='submit' className='textBtn'>
                    Text Me The App
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col lg={8}>
            <img className='appImage' src='/images/get-app.jpg' alt='appLogo'></img>
          </Col>
        </Row>
        <p className='invite-section'>
          We invite you to learn more about us by simply doing business with us.{' '}
          <a href='tel:18442780072' className='contact'>
            Contact Us
          </a>{' '}
          today.
        </p>
      </div>
    </div>
  );
};

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (context: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Get The App',
    },
  };
};

export default Page;
