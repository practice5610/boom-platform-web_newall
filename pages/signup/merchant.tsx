import 'firebase/auth';

import {
  AllOptionalExceptFor,
  BoomUser,
  EmailRegex,
  PhoneRegex2,
  RoleKey,
} from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import firebase from 'firebase/app';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { connect } from 'react-redux';
import { Button, Col, Label, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../components/LayoutAccount';
import actionCreators from '../../redux/actions';
import { setLoadingOverlay } from '../../redux/actions/app';
import {
  requestSocialSignUp,
  requestUserCreateWithEmailAndPassword,
} from '../../redux/actions/auth';
import { AppState } from '../../redux/reducers';
import { GlobalProps, NextLayoutPage } from '../../types';
import { formatPhoneForFirebaseAuth } from '../../utils/phone';

interface Props {
  isUserSignedIn: boolean;
  authError: string;
  requestUserCreateWithEmailAndPassword: typeof requestUserCreateWithEmailAndPassword;
  requestSocialSignUp: typeof requestSocialSignUp;
  toastIsOpen: boolean;
  setLoadingOverlay: typeof setLoadingOverlay;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  authError,
  requestUserCreateWithEmailAndPassword,
  requestSocialSignUp,
  isUserSignedIn,
  toastIsOpen,
  setLoadingOverlay,
}) => {
  useEffect(() => {
    if (authError || isUserSignedIn) {
      setLoadingOverlay(false);
    }

    if (isUserSignedIn) {
      Router.replace('/account/merchant/register');
    }
  }, [isUserSignedIn, authError, setLoadingOverlay]);

  useEffect(() => {
    if (toastIsOpen) {
      setLoadingOverlay(false);
    }
  }, [toastIsOpen, setLoadingOverlay]);

  const onSubmit = (values: IFormInputs) => {
    console.log('values goes here ', values);
    setLoadingOverlay(true);
    requestUserCreateWithEmailAndPassword(values.email, values.password, [RoleKey.Merchant], {
      contact: { phoneNumber: formatPhoneForFirebaseAuth(values.phone) },
    } as AllOptionalExceptFor<BoomUser, 'contact'>);
  };

  const _onBoomLogoClick = () => {
    Router.replace('/');
  };

  const _onSignInClick = () => {
    Router.replace('/account/login');
  };

  const _renderErrorMessage = (name: keyof IFormInputs) => (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ messages }) => {
        return messages
          ? Object.entries(messages).map(([type, message]) => (
              <p className={'small text-danger'} key={type}>
                {message}
              </p>
            ))
          : null;
      }}
    />
  );
  interface IFormInputs {
    email: string;
    password: string;
    phone: string;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IFormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
      phone: '',
    },
  });

  return (
    <div className='signup-container'>
      <Row className='signup-row'>
        <Col xs={12} md={6} className='signup-col'>
          <div className='signup-leftside  bg-red'>
            <div role='button' tabIndex={0} className='logo signup-logo' onClick={_onBoomLogoClick}>
              <img alt='Moob Marketplace' src='/images/moob-marketplace-logo-white.svg' />
            </div>
            <div className='signup-leftside-middle-content'>
              <div className='title'>Welcome!</div>
              <div className='subtitle'>Become a Moob merchant and enjoy the rewards!</div>
              {!isUserSignedIn && (
                <>
                  <hr />
                  <div className='signin-link'>
                    Already have an account?{' '}
                    <span role='button' tabIndex={0} className='link' onClick={_onSignInClick}>
                      {' '}
                      Sign In{' '}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className='footer'>
              <div className='footer-text'>© 2014-2020, Moob Marketplace or its affiliates</div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6} className='signup-col'>
          <div className='signup-rightside'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='screen-title'>Sign Up</div>

              <div className='form-group phone-field'>
                <Label>Sign up with your phone number*</Label>

                <Controller
                  name='phone'
                  control={control}
                  rules={{
                    required: '⚠ This input is required.',
                    // pattern: {
                    //   value: PhoneRegex,
                    //   message: "⚠ regex error"
                    // }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <InputMask mask='(999) 999-9999' value={value} onChange={onChange}>
                      {(inputProps) => (
                        <input {...inputProps} name='phone' type='tel' className='form-control' />
                      )}
                    </InputMask>
                  )}
                />
                {_renderErrorMessage('phone')}
                <span>A verification will be sent via SMS</span>
              </div>

              <div className='new-signup'>
                Sign up with Email Address* <span></span>
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Email address</label>
                <input
                  {...register('email', {
                    required: '⚠ This input is required.',
                    pattern: { value: EmailRegex, message: '⚠ Regex error.' },
                  })}
                  name='email'
                  type='email'
                  className='form-control'
                  placeholder=''
                />
                {_renderErrorMessage('email')}
              </div>

              <div className='form-group'>
                <label htmlFor='password'>Create password</label>
                <input
                  {...register('password', {
                    required: '⚠ This input is required.',
                  })}
                  name='password'
                  type='password'
                  className='form-control'
                  placeholder=''
                  autoComplete='current-password'
                />
                <span>min 6 characters</span>
                {_renderErrorMessage('password')}
              </div>

              <div className='new-signup'>
                Sign up with Social media <span>(optional)</span>
              </div>

              <Button
                className='button button--social-login'
                onClick={() =>
                  requestSocialSignUp(new firebase.auth.GoogleAuthProvider(), [RoleKey.Merchant])
                }
              >
                <i className='icon fa fa-google' />
              </Button>
              <Button
                className='button button--social-login'
                onClick={() =>
                  requestSocialSignUp(new firebase.auth.FacebookAuthProvider(), [RoleKey.Merchant])
                }
              >
                <i className='icon fa fa-facebook' />
              </Button>
              <Button
                className='button button--social-login'
                onClick={() =>
                  requestSocialSignUp(new firebase.auth.TwitterAuthProvider(), [RoleKey.Merchant])
                }
              >
                <i className='icon fa fa-twitter' />
              </Button>

              <button type='submit' className='btn singup-button'>
                Sign Up
              </button>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  authError: state.errors.authError,
  isUserSignedIn: state.auth.isUserSignedIn,
  toastIsOpen: !!state.app.toast,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Merchant Sign Up',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
