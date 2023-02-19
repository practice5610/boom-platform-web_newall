import { NextPageContext } from 'next';
import React from 'react';
import { Button, Input } from 'reactstrap';

import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => (
  <div>
    {/* <img src="/images/contact_us_back.jpg" width="100%" height="100%"/> */}
    <div className='form-container'>
      <div className='empty-div' />
      <div className='d-flex contact-container'>
        <div className='col-md-8'>
          <div className='p-5'>
            <div className='row d-block'>
              <h4 className='header-red-Txt'>
                <b>Contact Us</b>
              </h4>
              <p>To contact us with questions, please fill out the form below.</p>
              <form>
                <Input placeholder='First Name' className='mb-2' />
                <Input placeholder='Last Name' className='mb-2' />
                <Input placeholder='Company Name' className='mb-2' />
                <Input placeholder='Email' className='mb-2' />
                <Input type='textarea' placeholder='How might we help you?' className='mb-2' />
                <Button className='float-right'> Submit </Button>
              </form>
            </div>
          </div>
        </div>
        <div className='col-md-4 info-section'>
          <div className='p-5'>
            <div className='row'>
              <h5>
                <b>MOOB LLC</b>
              </h5>
            </div>
            <div className='row mt-4 d-block'>
              <h6>
                <b>Phone</b>
              </h6>
              <p>1-844-278-0072</p>
            </div>
            <div className='row mt-4 d-block'>
              <h6>
                <b>Business Hours</b>
              </h6>
              <p className='mb-0'>Monday - Friday: 9:00am - 5:00pm</p>
            </div>
            <div className='row mt-4 d-block'>
              <p className='mb-0'>
                *If you wish to contact us after 5pm, please fill out the form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Contact Us',
    },
  };
};

export default Page;
