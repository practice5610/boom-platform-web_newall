import 'firebase/firestore';

import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import firebase from 'firebase/app';
import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { LocalStorageKeys, ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { get, post } from '../../utils/api';
import * as appActions from '../actions/app';
import * as settingsAction from '../actions/settings';
import { SettingsActionTypes } from '../actionTypes';

export function* getPlaidEnvInfo(action: settingsAction.GetPlaidEnvInfo) {
  try {
    const res = yield call(get, `/bank-info/auth/getPlaidEnvInfo`);
    yield put(settingsAction.getPlaidEnvInfoSuccess(res.data.plaidEnv));
  } catch (error) {
    yield put(settingsAction.getPlaidEnvInfoFailure());
  }
}

export function* getPlaidAccessToken(action: settingsAction.GetPlaidAccessToken) {
  try {
    const authState: string | null = window.localStorage.getItem(
      LocalStorageKeys.LOCAL_STORAGE_KEY_AUTH
    );
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } = JSON.parse(
      authState || ''
    );
    const { isMerchant, publicToken, plaidLoginData } = action.payload;
    const res = yield call(post, `/bank-info/auth/exchangeToken`, { publicToken });

    const param = { ...plaidLoginData, item: res.data.item };
    const accountResponse = yield call(
      post,
      `/bank-info/saveAccounts`,
      {
        plaidInfo: param,
        user: user,
      },
      undefined,
      jwt
    );
    console.log(accountResponse);
    if (isMerchant) {
      yield call(addMerchantPlaidBankAccount, user, {
        ...plaidLoginData,
        item: res.data.item,
      });
    } else {
      yield call(addCustomerPlaidBankAccount, user, {
        ...plaidLoginData,
        item: res.data.item,
      });
    }
    yield put(settingsAction.getPlaidAccessTokenSuccess());
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    yield put(settingsAction.getPlaidAccessTokenFailure());
  }
}

export function* getPlaidPublicToken(action: settingsAction.GetPlaidPublicToken) {
  try {
    const res = yield call(post, `/bank-info/auth/getPublicToken`, {
      itemId: action.payload.itemId,
      uid: action.payload.uid,
    });

    yield put(settingsAction.getPlaidPublicTokenSuccess(res.data.publicToken));
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    yield put(settingsAction.getPlaidPublicTokenFailure());
  }
}

export function* removeBankAccount(action: settingsAction.RemoveBankAccount) {
  try {
    const authState: string | null = window.localStorage.getItem(
      LocalStorageKeys.LOCAL_STORAGE_KEY_AUTH
    );
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } = JSON.parse(
      authState || ''
    );
    const accToDelete = action.payload.user.plaidInfo[action.payload.accountIndex];
    const accounts: { plaidID: string; userID: string }[] = [];
    for (const acc of accToDelete.accounts) {
      accounts.push({ plaidID: acc.id, userID: user.uid ? user.uid : '' });
    }
    const res = yield call(post, `/bank-info/deleteAccount`, [...accounts], undefined, jwt);
    if (res.data.success) {
      yield call(removePlaidBankAccount, user, action.payload.accountIndex);
      yield put(settingsAction.removeBankAccountSuccess());
    } else {
      yield put(settingsAction.removeBankAccountFailure());
    }
  } catch (error) {
    yield put(settingsAction.removeBankAccountFailure());
  }
}

function* addCustomerPlaidBankAccount(
  user: AllOptionalExceptFor<BoomUser, 'uid'>,
  accountInfo: any
) {
  try {
    const firestore: firebase.firestore.Firestore = firebase.firestore();
    const doc = yield call([firestore, firestore.doc], `users/${user.uid}`);
    let plaidInfo = user.plaidInfo || [];
    const existIndex = plaidInfo.findIndex(
      (item) => item.institution.name === accountInfo.institution.name
    );
    if (existIndex >= 0) {
      plaidInfo.splice(existIndex, 1, accountInfo);
    } else {
      plaidInfo = [...plaidInfo, accountInfo];
    }
    const userData = {
      plaidInfo,
    };
    yield call([doc, doc.update], userData);
  } catch (error) {
    console.log('Error', error);
  }
}

function* addMerchantPlaidBankAccount(
  user: AllOptionalExceptFor<BoomUser, 'uid'>,
  accountInfo: any
) {
  try {
    const firestore: firebase.firestore.Firestore = firebase.firestore();
    const doc = yield call([firestore, firestore.doc], `users/${user.uid}`);

    const userData = {
      plaidInfo: [accountInfo],
    };
    yield call([doc, doc.update], userData);
  } catch (error) {
    console.log('Error', error);
  }
}

function* removePlaidBankAccount(
  user: AllOptionalExceptFor<BoomUser, 'uid'>,
  accountIndex: number
) {
  const firestore: firebase.firestore.Firestore = firebase.firestore();
  const doc = yield call([firestore, firestore.doc], `users/${user.uid}`);
  let plaidInfo = user.plaidInfo || [];
  plaidInfo = plaidInfo.filter((item, index) => index !== accountIndex);
  const userData = {
    plaidInfo,
  };
  yield call([doc, doc.update], userData);
}

export function* watchRequests() {
  yield takeLatest(SettingsActionTypes.GET_PLAID_ENV_INFO, getPlaidEnvInfo);
  yield takeLatest(SettingsActionTypes.GET_PLAID_ACCESS_TOKEN, getPlaidAccessToken);
  yield takeLatest(SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN, getPlaidPublicToken);
  yield takeLatest(SettingsActionTypes.REMOVE_BANK_ACCOUNT, removeBankAccount);
}

export default function* root() {
  yield fork(watchRequests);
}
