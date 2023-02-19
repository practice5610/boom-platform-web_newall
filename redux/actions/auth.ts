import { AllOptionalExceptFor, BoomUser, RoleKey } from '@boom-platform/globals';
import firebase from 'firebase/app';
import { Action } from 'redux';

import {
  AuthVerificationState,
  PhoneAndAdditionalSignUpRequestPayload,
  SocialAuthProvider,
} from '../../types/auth-verification';
import { AuthActionTypes } from '../actionTypes';

export type AuthAction =
  | RequestConfirmPhone
  | StartAuthStateListener
  | CancelAuthStateListener
  | RequestUserCreateWithEmailAndPassword
  | RequestProfileAndImageUpdate
  | SetAdditionalUserInfo
  | SetAuthStateChange
  | RequestLogin
  | RequestLogout
  | RequestSocialSignIn
  | CancelApiErrorListener
  | StartApiErrorListener
  | SetAuthVerificationState
  | RequestPhoneAuth
  | RequestPhoneAndAdditionalSignUp;

export interface ProfileAndImageUpdate {
  user: AllOptionalExceptFor<BoomUser, 'uid'>;
  previewBase64: string | null;
  uuid: string;
  newPassword?: string;
  currentPassword?: string;
}
export interface RequestLogout extends Action {
  type: AuthActionTypes.AUTH_LOGOUT_REQUEST;
}

export interface RequestLogin extends Action {
  type: AuthActionTypes.AUTH_EMAIL_SIGN_IN_REQUEST;
  payload: { email: string; password: string };
}

export interface RequestSocialSignIn extends Action {
  type: AuthActionTypes.AUTH_SOCIAL_SIGN_IN_REQUEST;
  payload: {
    provider: SocialAuthProvider;
  };
}

export interface RequestSocialSignUp extends Action {
  type: AuthActionTypes.AUTH_SOCIAL_SIGN_UP_REQUEST;
  payload: {
    provider: SocialAuthProvider;
    roles: RoleKey[];
    userData?: AllOptionalExceptFor<BoomUser, 'uid'>;
  };
}

export interface RequestPhoneAndAdditionalSignUp extends Action {
  type: AuthActionTypes.AUTH_PHONE_AND_ADDITIONAL_SIGN_UP_REQUEST;
  payload: PhoneAndAdditionalSignUpRequestPayload;
}

export interface RequestPhoneAuth extends Action {
  type: AuthActionTypes.AUTH_PHONE_SIGN_IN_OR_SIGN_UP_REQUEST;
  payload: {
    phone: string;
    roles?: RoleKey[];
    userData?: AllOptionalExceptFor<BoomUser, 'uid'>;
    verifier: firebase.auth.RecaptchaVerifier;
  };
}

export interface SetAuthStateChange extends Action {
  type: AuthActionTypes.AUTH_STATE_CHANGE_SET;
  payload: {
    user: AllOptionalExceptFor<BoomUser, 'uid'> | null;
    jwt: string | null;
    replace: boolean;
    keepJwt: boolean;
  };
}

export interface SetAdditionalUserInfo extends Action {
  type: AuthActionTypes.AUTH_ADDITIONAL_USER_INFO_SET;
  //@ts-ignore
  payload: AdditionalUserInfo;
}

export interface RequestUserCreateWithEmailAndPassword extends Action {
  type: AuthActionTypes.AUTH_CREATE_EMAIL_SIGN_UP_REQUEST;
  payload: {
    email: string;
    password: string;
    roles: RoleKey[];
    userData?: AllOptionalExceptFor<BoomUser, 'contact'>;
  };
}

export interface CancelAuthStateListener extends Action {
  type: AuthActionTypes.AUTH_STATE_CHANGE_LISTEN_CANCEL;
}

export interface CancelProfileStateListener extends Action {
  type: AuthActionTypes.AUTH_PROFILE_CHANGE_LISTEN_CANCEL;
}

export interface StartAuthStateListener extends Action {
  type: AuthActionTypes.AUTH_STATE_CHANGE_LISTEN_START;
}

export interface StartProfileStateListener extends Action {
  type: AuthActionTypes.AUTH_PROFILE_CHANGE_LISTEN_START;
}

export interface RequestProfileUpdate extends Action {
  type: AuthActionTypes.AUTH_PROFILE_UPDATE_REQUEST;
  //payload: BoomUserForUpdates;
  payload: AllOptionalExceptFor<BoomUser, 'uid'>;
}

export interface RequestProfileAndImageUpdate extends Action {
  type: AuthActionTypes.AUTH_PROFILE_AND_IMAGE_UPDATE_REQUEST;
  payload: ProfileAndImageUpdate;
}

export interface CancelApiErrorListener extends Action {
  type: AuthActionTypes.AUTH_API_ERROR_LISTEN_CANCEL;
}

export interface StartApiErrorListener extends Action {
  type: AuthActionTypes.AUTH_API_ERROR_LISTEN_START;
}

export interface RequestConfirmPhone extends Action {
  type: AuthActionTypes.AUTH_PHONE_CONFIRM_REQUEST;
  payload: string;
}

export interface SetAuthVerificationState extends Action {
  type: AuthActionTypes.AUTH_VERIFICATION_STATE_SET;
  payload: AuthVerificationState;
}

export const setAuthVerificationState = (
  state: AuthVerificationState
): SetAuthVerificationState => {
  return {
    type: AuthActionTypes.AUTH_VERIFICATION_STATE_SET,
    payload: { ...state },
  };
};

export const requestConfirmPhone = (code: string): RequestConfirmPhone => {
  return {
    type: AuthActionTypes.AUTH_PHONE_CONFIRM_REQUEST,
    payload: code,
  };
};

export const cancelApiErrorListener = (): CancelApiErrorListener => {
  return {
    type: AuthActionTypes.AUTH_API_ERROR_LISTEN_CANCEL,
  };
};

export const startApiErrorListener = (): StartApiErrorListener => {
  return {
    type: AuthActionTypes.AUTH_API_ERROR_LISTEN_START,
  };
};

export const startAuthStateListener = (): StartAuthStateListener => {
  return {
    type: AuthActionTypes.AUTH_STATE_CHANGE_LISTEN_START,
  };
};

export const cancelAuthStateListener = (): CancelAuthStateListener => {
  return {
    type: AuthActionTypes.AUTH_STATE_CHANGE_LISTEN_CANCEL,
  };
};

export const startProfileStateListener = (): StartProfileStateListener => {
  return {
    type: AuthActionTypes.AUTH_PROFILE_CHANGE_LISTEN_START,
  };
};

export const cancelProfileStateListener = (): CancelProfileStateListener => {
  return {
    type: AuthActionTypes.AUTH_PROFILE_CHANGE_LISTEN_CANCEL,
  };
};

export const requestUserCreateWithEmailAndPassword = (
  email: string,
  password: string,
  roles: RoleKey[],
  userData?: AllOptionalExceptFor<BoomUser, 'contact'>
): RequestUserCreateWithEmailAndPassword => {
  return {
    type: AuthActionTypes.AUTH_CREATE_EMAIL_SIGN_UP_REQUEST,
    payload: { email, password, roles, userData },
  };
};

export const setAdditionalUserInfo = (data: any): SetAdditionalUserInfo => {
  return {
    type: AuthActionTypes.AUTH_ADDITIONAL_USER_INFO_SET,
    payload: data,
  };
};

export const setAuthStateChange = (
  user: AllOptionalExceptFor<BoomUser, 'uid'> | null,
  jwt: string | null,
  replace = true,
  keepJwt = false
): SetAuthStateChange => {
  return {
    type: AuthActionTypes.AUTH_STATE_CHANGE_SET,
    payload: { user, jwt, replace, keepJwt },
  };
};

export const requestLogin = (email: string, password: string): RequestLogin => {
  return {
    type: AuthActionTypes.AUTH_EMAIL_SIGN_IN_REQUEST,
    payload: { email, password },
  };
};

export const requestPhoneSignInOrSignUp = (
  phone: string,
  roles: RoleKey[],
  verifier: firebase.auth.RecaptchaVerifier
): RequestPhoneAuth => {
  return {
    type: AuthActionTypes.AUTH_PHONE_SIGN_IN_OR_SIGN_UP_REQUEST,
    payload: { phone, roles, verifier },
  };
};

export const requestSocialSignIn = (
  provider:
    | firebase.auth.FacebookAuthProvider
    | firebase.auth.GoogleAuthProvider
    | firebase.auth.TwitterAuthProvider
): RequestSocialSignIn => {
  return {
    type: AuthActionTypes.AUTH_SOCIAL_SIGN_IN_REQUEST,
    payload: { provider },
  };
};

export const requestSocialSignUp = (
  provider:
    | firebase.auth.FacebookAuthProvider
    | firebase.auth.GoogleAuthProvider
    | firebase.auth.TwitterAuthProvider,
  roles: RoleKey[],
  userData?: any
): RequestSocialSignUp => {
  return {
    type: AuthActionTypes.AUTH_SOCIAL_SIGN_UP_REQUEST,
    payload: { provider, roles, userData },
  };
};

export const requestPhoneAndAdditionalSignUp = (data): RequestPhoneAndAdditionalSignUp => {
  return {
    type: AuthActionTypes.AUTH_PHONE_AND_ADDITIONAL_SIGN_UP_REQUEST,
    payload: data,
  };
};

export const requestLogout = (): RequestLogout => {
  return {
    type: AuthActionTypes.AUTH_LOGOUT_REQUEST,
  };
};

export const requestProfileUpdate = (
  user: AllOptionalExceptFor<BoomUser, 'uid'>
): RequestProfileUpdate => {
  return {
    type: AuthActionTypes.AUTH_PROFILE_UPDATE_REQUEST,
    payload: user,
  };
};

export const requestProfileAndImageUpdate = ({
  user,
  previewBase64,
  uuid,
  newPassword,
  currentPassword,
}: ProfileAndImageUpdate): RequestProfileAndImageUpdate => {
  return {
    type: AuthActionTypes.AUTH_PROFILE_AND_IMAGE_UPDATE_REQUEST,
    payload: { user, previewBase64, uuid, newPassword, currentPassword },
  };
};
