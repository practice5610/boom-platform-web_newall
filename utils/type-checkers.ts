import { BoomUser, Store } from '@boom-platform/globals';
import firebase from 'firebase/app';

import * as authActions from '../redux/actions/auth';
import { AuthActionTypes } from '../redux/actionTypes';
import { SocialAuthProvider } from '../types/auth-verification';

export const isStore = (item: Partial<Store> | BoomUser): item is Store => {
  return !!(item as Store).companyName;
};

export const isSocialAuthProvider = (
  provider: SocialAuthProvider | firebase.auth.EmailAuthProvider
): provider is SocialAuthProvider => {
  return (
    !!provider.providerId.includes('facebook') ||
    !!provider.providerId.includes('google') ||
    !!provider.providerId.includes('twitter')
  );
};

export const isSocialSignInRequest = (
  req: authActions.RequestSocialSignIn | authActions.RequestSocialSignUp
): req is authActions.RequestSocialSignIn => {
  return req.type === AuthActionTypes.AUTH_SOCIAL_SIGN_IN_REQUEST;
};

export const isSocialSignUpRequest = (
  req: authActions.RequestSocialSignIn | authActions.RequestSocialSignUp
): req is authActions.RequestSocialSignUp => {
  return req.type === AuthActionTypes.AUTH_SOCIAL_SIGN_UP_REQUEST;
};
