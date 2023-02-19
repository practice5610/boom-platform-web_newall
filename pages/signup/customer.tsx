import { RoleKey } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FormEmailPasswordPhone from '../../components/FormEmailPasswordPhone';
import FormPhoneNumber from '../../components/FormPhoneNumber';
import FormSignUpCustomerWithSocialMedia from '../../components/FormSignUpCustomerWithSocialMedia';
import { getLayout } from '../../components/LayoutAccount';
import RenderIf from '../../components/utils/RenderIf';
import { AuthVerificationStatus, DEFAULT_INIT_URL_FOR_CUSTOMERS } from '../../constants';
import actionCreators from '../../redux/actions';
import { setLoadingOverlay } from '../../redux/actions/app';
import {
  requestSocialSignUp,
  requestUserCreateWithEmailAndPassword,
  setAuthVerificationState,
} from '../../redux/actions/auth';
import { AppState } from '../../redux/reducers';
import { GlobalProps, NextLayoutPage } from '../../types';
import { formatPhoneForFirebaseAuth } from '../../utils/phone';

interface Props {
  isUserSignedIn: boolean;
  authError: string;
  requestUserCreateWithEmailAndPassword: typeof requestUserCreateWithEmailAndPassword;
  requestSocialSignUp: typeof requestSocialSignUp;
  setAuthVerificationState: typeof setAuthVerificationState;
  toastIsOpen: boolean;
  setLoadingOverlay: typeof setLoadingOverlay;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  isUserSignedIn,
  authError,
  requestUserCreateWithEmailAndPassword,
  requestSocialSignUp,
  setAuthVerificationState,
  toastIsOpen,
  setLoadingOverlay,
}) => {
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);

  useEffect(() => {
    if ((isUserSignedIn || authError) && setLoadingOverlay) {
      setLoadingOverlay(false);
    }
    if (isUserSignedIn) {
      Router.replace(DEFAULT_INIT_URL_FOR_CUSTOMERS);
    }
  }, [isUserSignedIn, authError, setLoadingOverlay]);

  useEffect(() => {
    if (toastIsOpen && setLoadingOverlay) {
      setLoadingOverlay(false);
    }
  }, [toastIsOpen, setLoadingOverlay]);

  const submitForm = (values) => {
    setLoadingOverlay(true);
    setAuthVerificationState?.({
      status: AuthVerificationStatus.NEEDS_PHONE_AND_ADDITIONAL_SIGN_UP,
      phone: formatPhoneForFirebaseAuth(values.phone),
      email: values.email,
      roles: [RoleKey.Member],
      password: values.password,
      provider: values.provider,
    });
  };

  const signUpPhone = (values) => {
    setLoadingOverlay(true);
    setAuthVerificationState?.({
      status: AuthVerificationStatus.NEEDS_PHONE_SIGN_UP_OR_SIGN_IN,
      phone: formatPhoneForFirebaseAuth(values.phone),
      roles: [RoleKey.Member],
    });
  };

  const _handleSocialLogin = (values) => {
    setLoadingOverlay(true);
    setAuthVerificationState?.({
      status: AuthVerificationStatus.NEEDS_PHONE_AND_ADDITIONAL_SIGN_UP,
      phone: formatPhoneForFirebaseAuth(values.phone),
      roles: [RoleKey.Member],
      provider: values.provider,
    });
  };
  return (
    <div className='app-login bg-red'>
      <div className='container center'>
        <div className='row'>
          <div className='login-container'>
            <h1 className='login-title'>Sign Up</h1>
            <RenderIf condition={!showVerifyEmail && !showVerifyPhone}>
              <div className='login-subtitle'>
                Sign up for an account to access the amazing features of Moob.
              </div>
              <br />
              <div className='login-form'>
                <FormEmailPasswordPhone
                  onSubmit={submitForm}
                  apiError={authError}
                  title='Sign Up'
                  showPhoneField={true}
                />
                <hr />
                <br />
                <div className='login-subtitle'>Or, sign up using only your phone number:</div>
                <br />
                <FormPhoneNumber onSubmit={signUpPhone} error={authError} label='Sign Up' />
                <div style={{ fontSize: '12px' }}>
                  Clicking "Sign Up" will send a text to your phone for verification. Standard data
                  rates may apply.
                </div>
                <hr />
                <br />
                <div className='login-subtitle'>
                  You can also choose to sign in with Social Media:
                </div>
                <br />
                <FormSignUpCustomerWithSocialMedia
                  onSubmit={_handleSocialLogin}
                  error={authError}
                />
              </div>
            </RenderIf>

            <RenderIf condition={showVerifyEmail}>
              <div className='login-subtitle'>
                You will receive a confirmation email within a few minutes. Please click the link to
                finish signing up with Moob.
              </div>
            </RenderIf>

            <RenderIf condition={showVerifyPhone}>
              <div className='login-subtitle'>
                You will receive a confirmation text within a few minutes. Please enter the code
                below to finish signing up with Moob.
              </div>
              <br />
              <input name='sms-code' type='text' placeholder='Enter text code' />
              <br />
              <button className='btn login-button'>Submit</button>
            </RenderIf>

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

const mapStateToProps = (state: AppState) => ({
  authError: state.errors.authError,
  isUserSignedIn: state.auth.isUserSignedIn,
  toastIsOpen: !!state.app.toast,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    globalProps: {
      headTitle: 'CustomerPage',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
