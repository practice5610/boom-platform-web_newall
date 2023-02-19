import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import firebase from 'firebase/app';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { FIREBASE_CLIENT_CONFIG, LocalStorageKeys, ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { apiInitialize } from '../../utils/api';
import { post } from '../../utils/api';
import { isServer } from '../../utils/environment';
import actionCreators from '../actions';
import * as appActions from '../actions/app';
import * as authActions from '../actions/auth';
import * as errorActions from '../actions/errors';
import { AppActionTypes } from '../actionTypes';
import { AppState } from '../reducers/app';
import { getAppState, getAuthState } from '../selectors';

export function* initializeApp(action: appActions.RequestAppInitialize) {
  try {
    const appState: AppState = yield select(getAppState);

    if (!appState.isInitialized) {
      apiInitialize();

      if (!isServer) {
        firebase.initializeApp(FIREBASE_CLIENT_CONFIG);
        yield put(appActions.setFirebaseAsInitialized());
        yield put(authActions.startApiErrorListener());
      }

      if (!isServer) yield put(actionCreators.setAppAsInitialized());
    }
    if (!isServer) {
      yield put(authActions.cancelAuthStateListener());
      yield put(authActions.startAuthStateListener());
    }
  } catch (error) {
    yield put(actionCreators.setAppInitializeError(error));
  }
}

export function* rehydrateLocalStorage() {
  try {
    const authState: string | null = window.localStorage.getItem(
      LocalStorageKeys.LOCAL_STORAGE_KEY_AUTH
    );

    if (authState) {
      const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
        JSON.parse(authState);
      yield put(authActions.setAuthStateChange(user, jwt));
    }
  } catch (error: any) {
    yield put(errorActions.setAppError(error.toString()));
  }
}

export function* setToLocalStorage(action: appActions.SetToLocalStorage) {
  try {
    window.localStorage.setItem(action.payload.key, JSON.stringify(action.payload.value));
  } catch (error: any) {
    yield put(errorActions.setAppError(error.toString()));
  }
}

export function* smsAppLinks(action: appActions.RequestSMSAppLinks) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(post, `/sms/app`, action.payload, {}, jwt);
    const success = result.data.success;
    const heading: string = success ? 'SMS Success' : 'SMS Failed';
    const body: string = success ? 'SMS Message was sent!' : result.message || 'Could not send SMS';
    const type: ToastTypes = success ? ToastTypes.SUCCESS : ToastTypes.RETRY;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error: any) {
    const heading = 'SMS Failed';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.RETRY;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* watchInitializationRequest() {
  yield takeLatest(AppActionTypes.APP_INITIALIZE_REQUEST, initializeApp);
  yield takeLatest(AppActionTypes.APP_LOCAL_STORAGE_REHYDRATE, rehydrateLocalStorage);
  yield takeLatest(AppActionTypes.APP_LOCAL_STORAGE_SET, setToLocalStorage);
  yield takeLatest(AppActionTypes.APP_SMS_APP_LINKS_REQUEST, smsAppLinks);
}

export default function* root() {
  yield fork(watchInitializationRequest);
}
