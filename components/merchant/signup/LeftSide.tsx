import Router from 'next/router';
import React from 'react';

import { NextLayoutPage } from '../../../types';

interface Props {
  title: string;
  subtitle: string;
  isSignInLink: boolean;
}

const SignUpLeftSide: NextLayoutPage<Props> = ({ title, subtitle, isSignInLink }) => {
  const _onBoomLogoClick = () => {
    Router.push('/');
  };

  const _onSignInClick = () => {
    Router.push('/account/login');
  };

  return (
    <div className='signup-leftside  bg-red'>
      {/* Logo */}
      <div role='button' tabIndex={0} className='logo signup-logo' onClick={_onBoomLogoClick}>
        <img alt='Moob Marketplace' src='/images/moob-marketplace-logo-white.svg' />
      </div>

      {/* Middle Content */}
      <div className='signup-leftside-middle-content'>
        {/* Title */}
        <div className='title'>{title}</div>
        {/* Subtitle */}
        <div className='subtitle'>{subtitle}</div>
      </div>

      {/* Footer link */}
      <div className='footer'>
        <div className='footer-text'>© 2014-2022, Moob, LLC. or its affiliates</div>
      </div>
    </div>
  );
};

export default SignUpLeftSide;
