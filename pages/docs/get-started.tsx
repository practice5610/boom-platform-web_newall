/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { NextPageContext } from 'next';
import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { NextLayoutPage } from '../../types';
import MerchantTerms from './merchant-legal';

const Page: NextLayoutPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleModal = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div className='GetStarted container'>
      <div className='get-started'>
        <h1>GET STARTED</h1>
        <p className='text-section'>
          Please review our{' '}
          <a className='contact' onClick={toggleModal}>
            Terms and Conditions
          </a>{' '}
          before getting started.
        </p>
        <Modal scrollable isOpen={isOpen} toggle={toggleModal} className='terms-modal'>
          <ModalHeader toggle={toggleModal} className='terms-header'>
            Terms and Conditions
          </ModalHeader>
          <ModalBody>
            <MerchantTerms />
          </ModalBody>
          <ModalFooter>
            <Button className='accept' onClick={toggleModal}>
              Accept
            </Button>
            <Button className='decline' onClick={toggleModal}>
              Decline
            </Button>
          </ModalFooter>
        </Modal>

        <p className='text-section'>
          We invite you to learn more about us by simply doing business with us.{' '}
          <a href='/docs/contact-us' className='contact'>
            Contact Us
          </a>{' '}
          today.
        </p>
      </div>
    </div>
  );
};

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Getting Started',
    },
  };
};

export default Page;
