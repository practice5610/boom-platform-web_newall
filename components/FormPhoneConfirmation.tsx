import 'firebase/auth';

import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import firebase from 'firebase/app';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { bindActionCreators } from 'redux';

import { AuthVerificationStatus } from '../constants';
import actionCreators from '../redux/actions';
import {
  requestConfirmPhone,
  requestPhoneAndAdditionalSignUp,
  requestPhoneSignInOrSignUp,
  setAuthVerificationState,
} from '../redux/actions/auth';
import { AppState } from '../redux/reducers';
import { AuthVerificationState } from '../types/auth-verification';
import RenderIf from './utils/RenderIf';

interface Props {
  requestConfirmPhone?: typeof requestConfirmPhone;
  authError?: string;
  authVerificationState?: AuthVerificationState;
  requestPhoneSignInOrSignUp?: typeof requestPhoneSignInOrSignUp;
  requestPhoneAndAdditionalSignUp?: typeof requestPhoneAndAdditionalSignUp;
  setAuthVerificationState?: typeof setAuthVerificationState;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
}

/**
 * Works as the global phone verification modal
 */
const FormPhoneConfirmation: FunctionComponent<Props> = ({
  requestConfirmPhone,
  requestPhoneSignInOrSignUp,
  requestPhoneAndAdditionalSignUp,
  authError,
  authVerificationState,
  user,
  setAuthVerificationState,
}) => {
  const [phoneConfirmationCode, setPhoneConfirmationCode] = useState('');
  const [authVerifier, setAuthVerifier] = useState<firebase.auth.RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (authVerificationState!.status === AuthVerificationStatus.INACTIVE && authVerifier) {
      if (authVerifier) authVerifier.clear();
      setAuthVerifier(null);
    } else if (
      authVerificationState!.status === AuthVerificationStatus.NEEDS_PHONE_SIGN_UP_OR_SIGN_IN ||
      authVerificationState!.status === AuthVerificationStatus.NEEDS_PHONE_AND_ADDITIONAL_SIGN_UP
    ) {
      const verifier =
        authVerifier ||
        new firebase.auth.RecaptchaVerifier('captcha-element', {
          size: 'invisible',
        });

      setAuthVerifier(verifier);

      if (authVerificationState!.status === AuthVerificationStatus.NEEDS_PHONE_SIGN_UP_OR_SIGN_IN) {
        requestPhoneSignInOrSignUp!(
          authVerificationState!.phone!,
          authVerificationState!.roles!,
          verifier
        );
      } else {
        requestPhoneAndAdditionalSignUp!({
          provider: authVerificationState!.provider!,
          phone: authVerificationState!.phone!,
          email: authVerificationState!.email!,
          password: authVerificationState!.password!,
          roles: authVerificationState!.roles!,
          verifier,
        });
      }
    }
  }, [authVerificationState]);

  const _confirmPhoneNumber = () => {
    setAuthVerificationState!({ status: AuthVerificationStatus.PENDING_VERIFICATION_RESULT });
    requestConfirmPhone!(phoneConfirmationCode);
    setPhoneConfirmationCode('');
  };
  /**
   * Handles only already logged in user, if they need to create a phone account
   */
  const _handleConfirmStart = () => {
    setAuthVerificationState!({
      status: AuthVerificationStatus.NEEDS_PHONE_SIGN_UP_OR_SIGN_IN,
      phone: `${user!.contact!.phoneNumber}`,
    });
  };

  const _handleDismiss = () => {
    setAuthVerificationState!({ status: AuthVerificationStatus.INACTIVE });
  };

  return (
    <div>
      {authVerificationState!.status !== AuthVerificationStatus.INACTIVE && (
        <div id='captcha-element' />
      )}
      <Modal
        isOpen={authVerificationState!.status === AuthVerificationStatus.NEEDS_INVOCATION_FROM_USER}
      >
        <ModalHeader>Confirm Phone Number</ModalHeader>
        <ModalBody>Click OK to verify your phone number.</ModalBody>
        <ModalFooter>
          <Button
            id='phone-confirm'
            color='primary'
            onClick={_handleConfirmStart}
            disabled={!user || !user.contact || !user.contact.phoneNumber}
          >
            OK
          </Button>{' '}
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={authVerificationState!.status === AuthVerificationStatus.NEEDS_PHONE_VERIFICATION}
      >
        <ModalHeader>Confirm Phone Number</ModalHeader>
        <ModalBody>
          Please enter the verification code sent to your phone.
          <Input
            type='number'
            className='my-4'
            value={phoneConfirmationCode}
            onChange={(e) => setPhoneConfirmationCode(e.target.value)}
          />
          <RenderIf condition={!!authError}>
            <span>{authError}</span>
          </RenderIf>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={!authError ? _confirmPhoneNumber : _handleDismiss}>
            OK
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  authError: state.errors.authError,
  authVerificationState: state.auth.authVerificationState,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormPhoneConfirmation);
