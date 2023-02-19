import {
  AllOptionalExceptFor,
  BoomUser,
  Transaction,
  TransactionStatus,
} from '@boom-platform/globals';
import Router from 'next/router';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { get, patch, post } from '../../utils/api';
import * as appActions from '../actions/app';
import * as errorActions from '../actions/errors';
import * as transactionActions from '../actions/transactions';
import { TransactionsActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';

export function* requestTransfer(action: transactionActions.RequestTransfer) {
  try {
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } =
      yield select(getAuthState);

    const transaction: AllOptionalExceptFor<
      Transaction,
      'sender' | 'receiver' | 'title' | 'amount'
    > = {
      sender: { uid: user.uid },
      receiver: {
        uid: '',
        contact: { phoneNumber: action.payload.transfer.receiverPhoneNumber },
      }, // TODO: Is it safe to use empty string as null is not allowed ?
      title: action.payload.transfer.notes, // TODO: Is this value correct?
      amount: action.payload.transfer.amount,
    };
    console.log(transaction);
    yield call(post, `/transfers`, transaction, {}, jwt);
    const heading = 'Success';
    const body = 'Transfer was created and pending confirmation by recipient.';
    const type: ToastTypes = ToastTypes.SUCCESS;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* cancelTransfer(action: transactionActions.RequestTransferCancel) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const transaction: Partial<Transaction> = { status: TransactionStatus.CANCELLED };
    const result = yield call(
      patch,
      `/transfers/${action.payload.id}`,
      { ...transaction },
      {},
      jwt
    );
    yield call(Router.replace, '/');
    const heading: string = result.data.success ? 'Cancel Success' : 'Cancel Failure';
    const body: string = result.data.success
      ? 'The transfer was successfully cancelled'
      : `${result.data.message}`;
    const type: ToastTypes = result.data.success ? ToastTypes.SUCCESS : ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error: any) {
    yield call(Router.replace, '/');
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* confirmTransfer(action: transactionActions.RequestTransferConfirmation) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const transaction: Partial<Transaction> = { status: TransactionStatus.COMPLETED };
    const result = yield call(
      patch,
      `/transfers/${action.payload.id}`,
      { ...transaction },
      {},
      jwt
    );
    yield call(Router.replace, '/');
    const heading: string = result.data.success ? 'Confirmation Success' : 'Confirmation Failure';
    const body: string = result.data.success
      ? 'The transfer was confirmed!'
      : `${result.data.message}`;
    const type: ToastTypes = result.data.success ? ToastTypes.SUCCESS : ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error: any) {
    yield call(Router.replace, '/');
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestTransactionDetails(action: transactionActions.RequestTransactionDetails) {
  console.log('requestTransactionDetails');
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(get, `/transactions`, { params: action.payload.filter }, jwt);
    if (!result?.data?.length) {
      yield call(Router.replace, '/');
      yield put(errorActions.setAPIError('This transfer was not found'));
    }
    yield put(transactionActions.setTransactionDetails(result.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

// This saga is only for Merchants.
export function* createWithdrawal(action: transactionActions.RequestWithdrawal) {
  try {
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } =
      yield select(getAuthState);
    const withdrawal: AllOptionalExceptFor<Transaction, 'amount'> = {
      ...action.payload.transaction,
      receiver: user,
    };
    console.log(withdrawal);
    const response = yield call(post, `/merchant-withdrawal`, withdrawal, {}, jwt);
    console.log(response);
    if (response.status == 200) {
      const heading = 'Success';
      const body = 'Withdrawal Transaction was created and pending confirmation by Moob Admin.';
      const type: ToastTypes = ToastTypes.SUCCESS;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
    throw new Error('Something goes wrong.');
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* cancelWithdrawal(action: transactionActions.RequestTransferCancel) {
  // try {
  //   const { jwt }: { jwt: string } = yield select(getAuthState);
  //   const transaction: Partial<Transaction> = { status: TransactionStatus.CANCELLED };
  //   const result = yield call(
  //     patch,
  //     `/transfers/${action.payload.id}`,
  //     { ...transaction },
  //     {},
  //     jwt
  //   );
  //   yield call(Router.replace, '/');
  //   const heading: string = result.data.success ? 'Cancel Success' : 'Cancel Failure';
  //   const body: string = result.data.success
  //     ? 'The transfer was successfully cancelled'
  //     : `${result.data.message}`;
  //   const type: ToastTypes = result.data.success ? ToastTypes.SUCCESS : ToastTypes.ERROR;
  //   yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  // } catch (error) {
  //   yield call(Router.replace, '/');
  //   yield put(errorActions.setAPIError(error.toString()));
  // }
}

export function* requestWithdrawalDetails(action: transactionActions.RequestTransactionDetails) {
  // console.log('requestTransactionDetails');
  // try {
  //   const { jwt }: { jwt: string } = yield select(getAuthState);
  //   const result = yield call(get, `/transactions`, { params: action.payload.filter }, jwt);
  //   if (!result?.data?.length) {
  //     yield call(Router.replace, '/');
  //     yield put(errorActions.setAPIError('This transfer was not found'));
  //   }
  //   yield put(transactionActions.setTransactionDetails(result.data));
  // } catch (error) {
  //   yield put(errorActions.setAPIError(error.toString()));
  // }
}

export function* watchRequests() {
  yield takeLatest(TransactionsActionTypes.TRANSFER_REQUEST, requestTransfer);
  yield takeLatest(TransactionsActionTypes.TRANSFER_CANCEL_REQUEST, cancelTransfer);
  yield takeLatest(TransactionsActionTypes.TRANSFER_CONFIRM_REQUEST, confirmTransfer);
  yield takeLatest(TransactionsActionTypes.TRANSACTION_DETAILS_REQUEST, requestTransactionDetails);
  yield takeLatest(TransactionsActionTypes.TRANSACTION_WITHDRAWAL_REQUEST, createWithdrawal);
  yield takeLatest(TransactionsActionTypes.TRANSACTION_WITHDRAWAL_CANCEL_REQUEST, cancelWithdrawal);
  yield takeLatest(
    TransactionsActionTypes.TRANSACTION_WITHDRAWAL_DETAILS_REQUEST,
    requestWithdrawalDetails
  );
}

export default function* root() {
  yield fork(watchRequests);
}
