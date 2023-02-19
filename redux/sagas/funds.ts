import {
  AddressInfo,
  AllOptionalExceptFor,
  BoomUser,
  ContactInfo,
  toMoney,
} from '@boom-platform/globals';
import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';

import { LocalStorageKeys, ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { post } from '../../utils/api';
import * as appActions from '../actions/app';
import * as fundsAction from '../actions/funds';
import * as settingsAction from '../actions/settings';
import { FundsActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';

export function* addFunds(action: fundsAction.AddFunds) {
  try {
    const authState: string | null = window.localStorage.getItem(
      LocalStorageKeys.LOCAL_STORAGE_KEY_AUTH
    );
    const {
      user,
    }: {
      user: AllOptionalExceptFor<
        BoomUser,
        'uid' | 'firstName' | 'lastName' | 'contact' | 'addresses' | 'addresses'
      >;
    } = JSON.parse(authState || '');
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const { firstName, lastName, contact, addresses } = user;
    const { phoneNumber } = contact as ContactInfo;

    if (!Array.isArray(addresses) || !addresses.length) {
      throw 'There are no addresses for this user';
    }
    // this is related to api\src\controllers\payments.controller.ts(line 111)
    const { street1, city, state, zip } = addresses[0] as AddressInfo; // TODO: Review if we need to add street2 and if it is ok to pick the first address on the array

    if (!firstName || !lastName || !street1 || !city || !phoneNumber || !state || !zip) {
      throw 'You should fill out this information in your profile: first name, last name, address, city, phone number, state, zip code';
    }

    console.log({
      ...action.payload,
      uid: user.uid,
      nonce: true,
    });

    const res = yield call(
      post,
      `/payments`,
      {
        ...action.payload,
        uid: user.uid,
        nonce: true,
      },
      undefined,
      jwt
    );

    if (res.data.success) {
      const heading = 'Success';
      const body = 'Funds added successfully';
      const type: ToastTypes = ToastTypes.SUCCESS;

      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(fundsAction.addFundsSuccess());
    } else if (!res.data.success && !res.data.balanceInfo) {
      const heading = `Error Adding Funds: ${res.data.errorCode}`;
      const body: string =
        res.data.errorCode === 'ITEM_LOGIN_REQUIRED'
          ? "Your linked bank account info is out of date. You must update your login data to add funds. Please click on 'Update Bank Account' below to update your bank account."
          : res.data.message;
      const type: ToastTypes = ToastTypes.ERROR;

      if (res.data.errorCode === 'ITEM_LOGIN_REQUIRED') {
        yield put(
          settingsAction.getPlaidPublicToken(action.payload.plaidItemId, user.uid as string)
        );
      }

      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(fundsAction.addFundsFailure(''));
    } else {
      console.log('successful error');
      console.error(res.data);

      const heading = 'Error Adding Funds';
      const body = `Not available to add funds! Available: ${res.data.balanceInfo.available}`;
      const type: ToastTypes = ToastTypes.ERROR;

      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(fundsAction.addFundsFailure(res.data.errorCode));
    }
  } catch (error: any) {
    const heading: string = 'Error Adding Funds';
    const body: string = error.response?.data?.error?.message ?? error?.message ?? error;
    const type: ToastTypes = ToastTypes.ERROR;

    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    yield put(fundsAction.addFundsFailure(''));
  }
}

export function* postFunds(action) {
  const data = action.payload.values;

  try {
    const { jwt, user }: { jwt: string; user } = yield select(getAuthState);
    const fundsData = {
      sender: { uid: user.uid },
      receiver: { contact: { emails: [data.receiverEmail] } },
      amount: toMoney(data.amount),
    };
    yield call(post, `/transfers`, fundsData, {}, jwt);
    const heading = 'Success';
    const body = 'Transfer was created and pending confirmation by recipient.';
    const type: ToastTypes = ToastTypes.SUCCESS;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.response.data.error.message;
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* watchRequests() {
  yield takeLatest(FundsActionTypes.ADD_FUNDS_REQUEST, addFunds);
  yield takeLatest(FundsActionTypes.TRANSFER_FUNDS_REQUEST, postFunds);
}

export default function* root() {
  yield fork(watchRequests);
}
