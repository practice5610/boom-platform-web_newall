import 'firebase/auth';
import 'firebase/firestore';

import { AllOptionalExceptFor, BoomUser, ContactInfo, RoleKey } from '@boom-platform/globals';
import firebase from 'firebase/app';
import _ from 'lodash';
import moment from 'moment';
import Router from 'next/router';
import { reset } from 'redux-form';
import { eventChannel } from 'redux-saga';
import { call, fork, put, select, take, takeEvery } from 'redux-saga/effects';

import { AuthVerificationStatus, FormNames, LocalStorageKeys, ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { AuthVerificationState } from '../../types/auth-verification';
import { onAPIError } from '../../utils/api';
import { isServer } from '../../utils/environment';
import {
  base64ToImageSrc,
  dataURLtoFile,
  existImage,
  parseUUID,
  urlToBase64,
} from '../../utils/image-utils';
import { replaceDomain } from '../../utils/images';
import {
  parseDisplayNameFromFirebaseUserCredential,
  prepareEmailPasswordProfileDataForInitialCreation,
} from '../../utils/profile';
import {
  isSocialAuthProvider,
  isSocialSignInRequest,
  isSocialSignUpRequest,
} from '../../utils/type-checkers';
import { validatePhoneSignupRequest } from '../../utils/validators';
import * as appActions from '../actions/app';
import * as authActions from '../actions/auth';
import * as errorActions from '../actions/errors';
import { AuthActionTypes } from '../actionTypes';
import { AuthState } from '../reducers/app';
import { getAuthState } from '../selectors';
import { imageRemove, imageSave } from './image';

function apiErrorListener() {
  return eventChannel((emit) => {
    //@ts-ignore
    const unsubscribe = onAPIError((error) => emit({ error }));
    return unsubscribe;
  });
}

function profileListener() {
  return eventChannel((emit) => {
    const db: firebase.firestore.Firestore = firebase.firestore();
    const user: firebase.User | null = firebase.auth().currentUser;
    const unsubscribe = db
      .doc(`users/${user!.uid}`)
      .onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {
        emit({ snapshot });
      });
    return unsubscribe;
  });
}

function authListener() {
  return eventChannel((emit) => {
    const auth: firebase.auth.Auth = firebase.auth();
    //@ts-ignore
    const unsubscribe = auth.onAuthStateChanged((user: firebase.User) => emit({ user }));
    return unsubscribe;
  });
}

export function* updateLocalAuthState(
  boomUser: AllOptionalExceptFor<BoomUser, 'uid'> | null,
  token: string | null,
  replace = true
) {
  if (boomUser) {
    if (boomUser.profileImg && existImage(boomUser.profileImg.imgUrl)) {
      try {
        const base64 = yield call(urlToBase64, replaceDomain(boomUser.profileImg.imgUrl));
        const file = yield call(
          dataURLtoFile,
          base64ToImageSrc(base64),
          parseUUID(boomUser.profileImg.imgUrl)
        );
        boomUser = Object.assign({}, boomUser, {
          profileImg: { imgFile: file, base64Data: base64 },
        });
      } catch {
        boomUser = Object.assign({}, boomUser, {
          profileImg: { imgFile: null, base64Data: null },
        });
      }
    } else {
      boomUser = Object.assign({}, boomUser, {
        profileImg: { imgFile: null, base64Data: null },
      });
    }

    if (boomUser.profileImg && existImage(boomUser.profileImg.previewImgUrl)) {
      try {
        const base64 = yield call(urlToBase64, replaceDomain(boomUser.profileImg.previewImgUrl));
        boomUser = Object.assign({}, boomUser, { profileImg: { previewBase64Data: base64 } });
      } catch {
        boomUser = Object.assign({}, boomUser, { profileImg: { previewBase64Data: null } });
      }
    } else boomUser = Object.assign({}, boomUser, { profileImg: { previewBase64Data: null } });
  }

  yield put(
    appActions.setToLocalStorage(LocalStorageKeys.LOCAL_STORAGE_KEY_AUTH, {
      user: boomUser,
      jwt: token,
    })
  );
  yield put(authActions.setAuthStateChange(boomUser, token, replace));
}

/**
 * Listens as long as there is a current user
 */
export function* listenForProfileChange(action: authActions.StartProfileStateListener) {
  try {
    const profileChannel = yield call(profileListener);
    yield takeEvery(
      profileChannel,
      function* ({ snapshot }: { snapshot: firebase.firestore.DocumentSnapshot }) {
        if (snapshot.exists) {
          const boomUser: AllOptionalExceptFor<BoomUser, 'uid'> =
            snapshot.data() as AllOptionalExceptFor<BoomUser, 'uid'>;
          const user: firebase.User | null = firebase.auth().currentUser;

          if (user) {
            const tokenResult: firebase.auth.IdTokenResult = yield call(
              [user, user.getIdTokenResult],
              true
            );
            if (tokenResult.claims.roles) {
              boomUser.roles = tokenResult.claims.roles;
              const token = yield call([user, user.getIdToken], true);
              yield call(updateLocalAuthState, boomUser, token);
            } else {
              // If we don't get a roles info probably this only happens when a new user is created and this would need to fail silently only
              console.error('tokenResult.claims.roles is null');
            }
          } else {
            console.error('firebase User is null');
            // If for some reason we get null from firebase user, probably some error must be thrown
          }
        }
      }
    );
    yield take(AuthActionTypes.AUTH_PROFILE_CHANGE_LISTEN_CANCEL);
    profileChannel.close();
  } catch (error) {
    console.error('listenForProfileChange error:', error);
  }
}

/**
 * Listens as long as app is in memory in foreground/background
 */
export function* listenForAuthChange(action: authActions.StartAuthStateListener) {
  try {
    const authChannel = yield call(authListener);
    yield takeEvery(authChannel, function* ({ user }: { user: firebase.User | null | undefined }) {
      yield put(authActions.cancelProfileStateListener());
      if (user) {
        yield put(authActions.startProfileStateListener());
      } else {
        yield call(updateLocalAuthState, null, null);
      }
    });
    yield take(AuthActionTypes.AUTH_STATE_CHANGE_LISTEN_CANCEL);
    authChannel.close();
  } catch (error) {
    console.error('listenForAuthChange error:', error);
  }
}

export function* listenForAPIErrorChange(action: authActions.StartAuthStateListener) {
  try {
    const authChannel = yield call(apiErrorListener);
    yield takeEvery(authChannel, function* ({ error }: { error: any }) {
      if (error.response && error.response.status === 403) {
        yield call(updateLocalAuthState, null, null);

        if (!isServer) {
          yield call(Router.replace, '/account/login');
        }
        const heading = 'Not Logged In';
        const body = 'To complete the action you need to sign in.';
        const type: ToastTypes = ToastTypes.RETRY;
        yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      } else if (error.response && error.response.status === 404) {
        console.error('404 error:', error.response);
        const heading = 'Not found';
        const body: string = error.response.data.error.message;
        const type: ToastTypes = ToastTypes.RETRY;
        yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      }
    });
    yield take(AuthActionTypes.AUTH_API_ERROR_LISTEN_CANCEL);
    authChannel.close();
  } catch (error) {
    console.error('error while listening to API error change:', error);
  }
}

export function* parseDisplayName(userCredential: firebase.auth.UserCredential, data: BoomUser) {}

//export function* updateUserData(user: firebase.User, data: BoomUserForUpdates) {
export function* updateUserData(user: firebase.User, data: BoomUser) {
  try {
    const firestore: firebase.firestore.Firestore = firebase.firestore();
    const doc = yield call([firestore, firestore.doc], `users/${user.uid}`); // This needs to be removed, we need to do it server side

    yield call(
      [doc, doc.set],
      {
        ...data,
        updatedAt: moment().utc().unix(),
      },
      doc ? { merge: true } : {}
    );
  } catch (error: any) {
    console.error(error);
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Profile Update Error'));
  }
}
/*
 * Only merchant email/password registration requests use this
 */
export function* createUserWithEmailAndPassword(
  action: authActions.RequestUserCreateWithEmailAndPassword
) {
  try {
    yield call(updateLocalAuthState, null, null);
    yield put(errorActions.clearError('authError'));

    const auth: firebase.auth.Auth = firebase.auth();
    const credentials: firebase.auth.UserCredential = yield call(
      [auth, auth.createUserWithEmailAndPassword],
      action.payload.email,
      action.payload.password
    );

    const profile: AllOptionalExceptFor<BoomUser, 'uid' | 'firstName' | 'lastName' | 'contact'> =
      yield call(
        prepareEmailPasswordProfileDataForInitialCreation,
        credentials,
        action.payload.email,
        action.payload.password,
        action.payload.roles,
        action.payload.userData
      );

    if (credentials.user) {
      yield call(updateUserData, credentials.user, profile);
    } else {
      throw new Error('No user');
    }
    yield firebase.auth().currentUser?.sendEmailVerification();

    yield put(reset(FormNames.FORM_NAME_EMAIL_PASSWORD_PHONE));
  } catch (error: any) {
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Sign Up Error'));
  }
}

export function* linkUserWithEmailAndPassword(email, password) {
  try {
    const auth: firebase.auth.Auth = firebase.auth();
    const user: firebase.User | null = auth.currentUser;

    if (!user)
      throw new Error('You must have a user logged in before you can link a social media account');

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    const result: firebase.auth.UserCredential = yield call(
      [user, user.linkWithCredential],
      credential
    );

    yield user.sendEmailVerification();

    const partialProfile: AllOptionalExceptFor<BoomUser, 'firstName' | 'lastName'> = yield call(
      parseDisplayNameFromFirebaseUserCredential,
      result
    );

    yield call(updateUserData, user, { ...partialProfile, contact: { emails: [email] } });
  } catch (error: any) {
    console.error(error);
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Email Registration Error'));
  }
}

/**
 * Used for registration of social auth for customers only. The user will first be required to register or login with phone auth.
 * Then their account will be linked to their social media auth account here.
 */
export function* linkWithPopup(
  provider:
    | firebase.auth.FacebookAuthProvider
    | firebase.auth.GoogleAuthProvider
    | firebase.auth.TwitterAuthProvider
) {
  try {
    const auth: firebase.auth.Auth = firebase.auth();
    const user: firebase.User | null = auth.currentUser;

    if (!user)
      throw new Error('You must have a user logged in before you can link a social media account');

    const result: firebase.auth.UserCredential = yield call([user, user.linkWithPopup], provider);

    const partialProfile: AllOptionalExceptFor<BoomUser, 'firstName' | 'lastName'> = yield call(
      parseDisplayNameFromFirebaseUserCredential,
      result
    );

    yield call(updateUserData, user, partialProfile);
  } catch (error: any) {
    console.error(error);
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Social Registration Error'));
  }
}

/**
 * All social sign in call this, both customer and merchant.
 */
export function* signInWithPopup(
  action: authActions.RequestSocialSignIn | authActions.RequestSocialSignUp
) {
  try {
    yield call(updateLocalAuthState, null, null);
    yield put(errorActions.clearError('authError'));

    const auth: firebase.auth.Auth = firebase.auth();
    const provider = action.payload.provider;
    const userCredential: firebase.auth.UserCredential = yield call(
      [auth, auth.signInWithPopup],
      provider
    );

    // Safeguard in case a user tries to sign in first without having signed up. They must go through the proper sign up flow
    if (isSocialSignInRequest(action) && userCredential!.additionalUserInfo!.isNewUser) {
      userCredential!.user!.delete();
      throw new Error('User does not exist. You must sign up first.');
    } else if (isSocialSignUpRequest(action)) {
      const profile: Partial<BoomUser> = {
        uid: userCredential.user!.uid,
        roles: action.payload.roles,
        contact: { emails: [userCredential.user!.email!] },
        firstName: userCredential.user!.displayName!.split(' ')[0],
        lastName: userCredential.user!.displayName!.split(' ')[1] || '',
        ...action.payload.userData,
      };
      yield call(updateUserData, userCredential.user!, profile);
    }
  } catch (error: any) {
    console.error(error);
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Social Login Error'));
  }
}
/**
 * First step in phone auth. This will send a verification code via SMS which user must type in the signup page.
 * All customers (not merchants) are required to sign up with a phone first, even if they choose to sign up with another auth option
 */
export function* signInOrSignUpWithPhone(
  action: authActions.RequestPhoneAuth | authActions.RequestPhoneAndAdditionalSignUp
) {
  try {
    yield put(errorActions.clearError('authError'));

    yield call(validatePhoneSignupRequest, action);

    const auth: firebase.auth.Auth = firebase.auth();
    const result: firebase.auth.ConfirmationResult = yield call(
      [auth, auth.signInWithPhoneNumber],
      action.payload.phone,
      action.payload.verifier!
    );

    //Will cause confirmation modal to open. Must type verification code
    yield put(
      authActions.setAuthVerificationState({
        status: AuthVerificationStatus.NEEDS_PHONE_VERIFICATION,
        confirmationResult: result,
      })
    );

    yield put(reset(FormNames.FORM_PHONE));
    yield put(reset(FormNames.FORM_SIGNUP_SOCIAL_MEDIA));
    yield put(reset(FormNames.FORM_NAME_EMAIL_PASSWORD_PHONE));
  } catch (error: any) {
    console.error('signInOrSignUpWithPhone ERROR:', error, action.payload);
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Phone SignIn Error'));
  }
}

/**
 * Final step in phone auth. Once customer enters confirmation code from SMS in signup page,
 * this is called to confirm the code and create the user.
 *
 * If there is an active social provider set in the auth state then it will link the provider with the user account.
 */
export function* confirmPhone(action: authActions.RequestConfirmPhone) {
  try {
    const auth: firebase.auth.Auth = firebase.auth();
    const authState: AuthState = yield select(getAuthState);
    const authVerificationState: AuthVerificationState = authState.authVerificationState;
    const phoneConfirmationResult = authState.authVerificationState.confirmationResult;
    const phoneAuthCredential: firebase.auth.AuthCredential = yield call(
      [firebase.auth, firebase.auth.PhoneAuthProvider.credential],
      phoneConfirmationResult!.verificationId,
      action.payload
    );

    const userCredential = yield call([auth, auth.signInWithCredential], phoneAuthCredential);

    if (userCredential?.additionalUserInfo?.isNewUser && userCredential.user) {
      yield call(updateUserData, userCredential.user, {
        createdAt: moment().utc().unix(),
        uid: userCredential.user.uid,
        roles: [RoleKey.Member],
        contact: { phoneNumber: userCredential?.user?.phoneNumber ?? '' } as ContactInfo,
      });
    }

    // If we have a provider (the user requested to sign in using some other option) then we need to link
    // their phone account with that option
    if (authVerificationState.provider && isSocialAuthProvider(authVerificationState.provider)) {
      yield call(linkWithPopup, authVerificationState.provider);
    } else if (
      authVerificationState.provider &&
      !isSocialAuthProvider(authVerificationState.provider)
    ) {
      yield call(
        linkUserWithEmailAndPassword,
        authVerificationState.email,
        authVerificationState.password
      );
    }

    yield put(
      authActions.setAuthVerificationState({
        confirmationResult: null,
        phone: null,
        status: AuthVerificationStatus.INACTIVE,
        provider: null,
        email: null,
        password: null,
      })
    );
  } catch (error: any) {
    console.error(error.code, `Confirm Phone Error: ${error.toString()}`);
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Phone Confirm Error'));
    yield put(authActions.setAuthVerificationState({ status: AuthVerificationStatus.INACTIVE }));
  }
}

export function* signInWithEmailAndPassword(action: authActions.RequestLogin) {
  try {
    yield put(errorActions.clearError('authError'));
    const auth: firebase.auth.Auth = firebase.auth();
    yield call(
      [auth, auth.signInWithEmailAndPassword],
      action.payload.email,
      action.payload.password
    );
  } catch (error: any) {
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Login Error'));
  }
}

export function* logout(action: authActions.RequestLogout) {
  try {
    yield put(errorActions.clearError('authError'));
    const auth: firebase.auth.Auth = firebase.auth();
    yield call(updateLocalAuthState, null, null);
    yield call([auth, auth.signOut]);
    yield call(Router.replace, '/');
  } catch (error: any) {
    yield put(appActions.setErrorGlobalToast(error.toString(), 'Log Out Error'));
  }
}

export function* updateProfile(action: authActions.RequestProfileUpdate) {
  console.log(action.payload);
  try {
    yield put(appActions.setLoadingOverlay(true));

    const auth: firebase.auth.Auth = firebase.auth();
    const user: firebase.User | null = auth.currentUser;
    const profile: AllOptionalExceptFor<BoomUser, 'uid'> = {
      ...action.payload,
    };

    if (!user) throw new Error('You must sign in to do this!');

    yield call(updateUserData, user, profile);

    const token = yield call([user, user.getIdToken]);

    yield call(updateLocalAuthState, profile, token, false);

    const heading = 'Success';
    const body = 'Profile updated successfully';
    const type: ToastTypes = ToastTypes.SUCCESS;

    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error: any) {
    yield put(errorActions.setAuthError(error.toString()));
  } finally {
    yield put(appActions.setLoadingOverlay(false));
  }
}

export function* updateProfileAndImage(action: authActions.RequestProfileAndImageUpdate) {
  try {
    yield put(appActions.setLoadingOverlay(true));

    const auth: firebase.auth.Auth = firebase.auth();
    const currentUser: firebase.User | null = auth.currentUser;

    if (!currentUser) throw new Error('You must sign in to do this!');

    const { firstName = '', lastName = '', profileImg, contact, gender = '' } = action.payload.user;
    const { user }: { user: AllOptionalExceptFor<BoomUser, 'uid'> } = yield select(getAuthState);
    const { previewBase64 } = action.payload;

    const newEmail: string | undefined = contact?.emails?.[0];
    const newPhone: string | undefined = contact?.phoneNumber;

    //------Moved the if statement checks into variables here. Makes it easier to read -----------------
    const hasNewImage = previewBase64 !== base64ToImageSrc(user.profileImg?.previewBase64Data);
    const hasNewEmail =
      user.contact?.emails &&
      newEmail &&
      user.contact.emails[0] !== newEmail &&
      action.payload.currentPassword;

    const hasNewPhone =
      user.contact?.phoneNumber && newPhone && user.contact.phoneNumber !== newPhone;

    const hasNewPassword =
      action.payload.newPassword && user.contact?.emails?.[0] && action.payload.currentPassword;

    let updatedData: AllOptionalExceptFor<BoomUser, 'uid'> = {
      uid: user.uid,
      firstName,
      lastName,
      gender,
    };

    //------Added var to reference credential here. So it can be reused--------------
    let recentCredential: firebase.auth.AuthCredential;

    if (!user.uid) throw new Error('User with no uid');

    const uuid = action.payload.uuid;
    const profileImgName = `profile_${uuid}`,
      previewImgName = `preview_${uuid}`;

    if (hasNewImage) {
      const replaceProfile = existImage(user?.profileImg?.imgUrl);
      const replacePreview = existImage(user?.profileImg?.previewImgUrl);

      if (previewBase64) {
        //TODO: Review function updateLocalAuthState(line86) why it does operations on images too, maybe it is no needed there

        const profileFormData = new FormData();
        const previewFormData = new FormData();

        profileFormData.append('file', profileImg?.imgFile as any);
        previewFormData.append('file', profileImg?.imgFile as any);

        //------changed these to fork calls. We did not seem to need to wait for the result here, so a fork call will continue without awaiting -----
        yield fork(imageSave, profileFormData, profileImgName, replaceProfile);
        yield fork(imageSave, previewFormData, previewImgName, replacePreview);

        updatedData = {
          ...updatedData,
          profileImg: {
            imgUrl: `${process.env.NEXT_PUBLIC_API_URL}/images/${profileImgName}`,
            previewImgUrl: `${process.env.NEXT_PUBLIC_API_URL}/images/${previewImgName}`,
          },
        };
      } else {
        //------Same here, changed to fork calls
        replaceProfile && (yield fork(imageRemove, profileImgName));
        replacePreview && (yield fork(imageRemove, previewImgName));
        updatedData = {
          ...updatedData,
          profileImg: {
            imgUrl: '',
            previewImgUrl: null,
          },
        };
      }
    }

    if (hasNewEmail || hasNewPassword) {
      recentCredential = firebase.auth.EmailAuthProvider.credential(
        user.contact?.emails?.[0] ?? '',
        action.payload.currentPassword ?? ''
      );

      yield call([currentUser, currentUser.reauthenticateWithCredential], recentCredential);
    }

    //------ Makes update request. This is the first firebase call. If we fail here then no harm. Nothing has changed (except the possible image profile change, which is fine) ------------------
    if (hasNewEmail && newEmail) {
      yield call([currentUser, currentUser.updateEmail], newEmail);
      updatedData = { ...updatedData, contact: { ...user.contact, emails: [newEmail] } };
    }
    //------ Here we update the in-memory object, but no actual API call -----
    if (hasNewPhone) {
      updatedData = { ...updatedData, contact: { ...user.contact, phoneNumber: newPhone } };
    }

    // If this operation fails and the email was changed, then our records(firebase collection) would show the old email, user would be informed that the operation failed by the message popup
    if (hasNewPassword) {
      yield call([currentUser, currentUser.updatePassword], action.payload.newPassword || '');
    }

    yield put(appActions.setLoadingOverlay(false));

    //------ If everything was successful then update the profile
    //------ So no need to worry about syncing that. We do however want the email address to be synced. Assuming it could fail due to a network error, firebase does retry the write, so
    //------ I don't think that's a big problem. Even if it failed for some other reason it just places the email out of sync with the one being used to log in, which is not
    //------ a huge deal I don't think. The user I think will catch on and retry the update, especially since a failure here would show the error toast message asking them to try again.
    yield put(authActions.requestProfileUpdate(updatedData));
  } catch (error) {
    yield put(appActions.setLoadingOverlay(false));
    console.error(error);
    yield put(
      appActions.setErrorGlobalToast('Profile Update Error. Reload the page and try again.')
    );
  }
}

export function* watchInitializationRequest() {
  yield takeEvery(
    AuthActionTypes.AUTH_PHONE_AND_ADDITIONAL_SIGN_UP_REQUEST,
    signInOrSignUpWithPhone
  );
  yield takeEvery(AuthActionTypes.AUTH_PHONE_SIGN_IN_OR_SIGN_UP_REQUEST, signInOrSignUpWithPhone);
  yield takeEvery(AuthActionTypes.AUTH_PHONE_CONFIRM_REQUEST, confirmPhone);
  yield takeEvery(AuthActionTypes.AUTH_SOCIAL_SIGN_IN_REQUEST, signInWithPopup);
  yield takeEvery(AuthActionTypes.AUTH_SOCIAL_SIGN_UP_REQUEST, signInWithPopup);
  yield takeEvery(AuthActionTypes.AUTH_EMAIL_SIGN_IN_REQUEST, signInWithEmailAndPassword);
  yield takeEvery(
    AuthActionTypes.AUTH_CREATE_EMAIL_SIGN_UP_REQUEST,
    createUserWithEmailAndPassword
  );
  yield takeEvery(AuthActionTypes.AUTH_STATE_CHANGE_LISTEN_START, listenForAuthChange);
  yield takeEvery(AuthActionTypes.AUTH_PROFILE_CHANGE_LISTEN_START, listenForProfileChange);
  yield takeEvery(AuthActionTypes.AUTH_PROFILE_UPDATE_REQUEST, updateProfile);
  yield takeEvery(AuthActionTypes.AUTH_API_ERROR_LISTEN_START, listenForAPIErrorChange);
  yield takeEvery(AuthActionTypes.AUTH_PROFILE_AND_IMAGE_UPDATE_REQUEST, updateProfileAndImage);
  yield takeEvery(AuthActionTypes.AUTH_LOGOUT_REQUEST, logout);
}

export default function* root() {
  yield fork(watchInitializationRequest);
}
