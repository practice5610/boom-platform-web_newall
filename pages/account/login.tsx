import 'firebase/auth';

import firebase from 'firebase/app';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { bindActionCreators } from 'redux';

import FormEmailPasswordPhone from '../../components/FormEmailPasswordPhone';
import FormPhoneNumber from '../../components/FormPhoneNumber';
import { getLayout } from '../../components/LayoutAccount';
import {
  AuthVerificationStatus,
  DEFAULT_INIT_URL_FOR_CUSTOMERS,
  DEFAULT_INIT_URL_FOR_MERCHANTS,
} from '../../constants';
import actionCreators from '../../redux/actions';
import {
  requestLogin,
  requestSocialSignIn,
  setAuthVerificationState,
} from '../../redux/actions/auth';
import { getIsMerchant, getIsRegistered } from '../../redux/selectors';
import { GlobalProps, NextLayoutPage } from '../../types';
import { formatPhoneForFirebaseAuth } from '../../utils/phone';

interface Props {
  isMerchant: boolean;
  isRegistered: boolean;
  isUserSignedIn: boolean;
  authError: string;
  requestSocialSignIn: typeof requestSocialSignIn;
  requestLogin: typeof requestLogin;
  setAuthVerificationState: typeof setAuthVerificationState;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  setAuthVerificationState,
  authError,
  requestLogin,
  requestSocialSignIn,
  isUserSignedIn,
  isMerchant,
  isRegistered,
}) => {
  useEffect(() => {
    if (isUserSignedIn && !isMerchant) {
      Router.replace(DEFAULT_INIT_URL_FOR_CUSTOMERS);
    } else if (isUserSignedIn && isMerchant) {
      // debugger; // eslint-disable-line no-debugger
      if (isRegistered) {
        Router.replace(DEFAULT_INIT_URL_FOR_MERCHANTS);
      } else {
        Router.replace('/account/merchant/register');
      }
    }
  }, [isUserSignedIn, isMerchant, isRegistered]);

  const submitForm = (values) => {
    requestLogin(values.email, values.password);
  };

  const signUpPhone = (values) => {
    setAuthVerificationState({
      status: AuthVerificationStatus.NEEDS_PHONE_SIGN_UP_OR_SIGN_IN,
      phone: formatPhoneForFirebaseAuth(values.phone),
    });
  };

  return (
    <div className='app-login bg-red'>
      <div className='container center'>
        <div className='row'>
          <div className='login-container'>
            <h1 className='login-title'>Sign In</h1>
            <div className='login-subtitle'>Welcome back. Sign in to access your account.</div>
            <br />
            <div className='login-form'>
              <FormEmailPasswordPhone
                onSubmit={submitForm}
                apiError={authError}
                title='Sign In'
                showPhoneField={false}
              />
              <hr />
              <div className='login-subtitle' style={{ textAlign: 'center' }}>
                You can also choose to sign in with your phone number:
              </div>
              <br />
              <FormPhoneNumber onSubmit={signUpPhone} error={authError} label='Sign In' />

              <hr />
              <div className='login-subtitle' style={{ textAlign: 'center' }}>
                You can also choose to sign in with Social Media:
              </div>
              <br />
              <Button
                className='button button--social-login button--linkedin'
                onClick={() => requestSocialSignIn(new firebase.auth.GoogleAuthProvider())}
              >
                <i className='icon fa fa-google' />
                Login With Google
              </Button>
              <Button
                className='button button--social-login button--facebook'
                onClick={() => requestSocialSignIn(new firebase.auth.FacebookAuthProvider())}
              >
                <i className='icon fa fa-facebook' />
                Login With Facebook
              </Button>
              <Button
                className='button button--social-login button--twitter'
                onClick={() => requestSocialSignIn(new firebase.auth.TwitterAuthProvider())}
              >
                <i className='icon fa fa-twitter' />
                Login With Twitter
              </Button>
            </div>
            <div className='help-text'>
              Any Questions? Call
              <a href='tel:18442780072'>(844) 278-0072</a> to speak to a member of our team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isMerchant: getIsMerchant(state),
  isRegistered: getIsRegistered(state),
  authError: state.errors.authError,
  isUserSignedIn: state.auth.isUserSignedIn,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Login',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
