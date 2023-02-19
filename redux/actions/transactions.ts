import { AllOptionalExceptFor, Money, Transaction } from '@boom-platform/globals';
import { Action } from 'redux';

import { TransactionsActionTypes } from '../actionTypes';

export type TransactionAction =
  | RequestTransferConfirmation
  | RequestTransferCancel
  | RequestTransfer
  | RequestTransactionDetails
  | SetTransactionDetails
  | RequestWithdrawal
  | RequestWithdrawalCancel
  | RequestWithdrawalDetails;

export interface RequestTransferConfirmation extends Action {
  type: TransactionsActionTypes.TRANSFER_CONFIRM_REQUEST;
  payload: { id: string };
}

export interface RequestTransferCancel extends Action {
  type: TransactionsActionTypes.TRANSFER_CANCEL_REQUEST;
  payload: { id: string };
}

export interface RequestTransfer extends Action {
  type: TransactionsActionTypes.TRANSFER_REQUEST;
  payload: {
    transfer: { amount: Money; notes: string; receiverName: string; receiverPhoneNumber: string };
  };
}

export interface RequestTransactionDetails extends Action {
  type: TransactionsActionTypes.TRANSACTION_DETAILS_REQUEST;
  payload: { filter: Record<string, unknown> };
}

export interface SetTransactionDetails extends Action {
  type: TransactionsActionTypes.TRANSACTION_DETAILS_SET;
  payload: { transactions: Transaction[] };
}

export interface RequestWithdrawal extends Action {
  type: TransactionsActionTypes.TRANSACTION_WITHDRAWAL_REQUEST;
  payload: {
    transaction: AllOptionalExceptFor<Transaction, 'amount'>;
  };
}
export interface RequestWithdrawalCancel extends Action {
  type: TransactionsActionTypes.TRANSACTION_WITHDRAWAL_CANCEL_REQUEST;
  payload: { id: string };
}
export interface RequestWithdrawalDetails extends Action {
  type: TransactionsActionTypes.TRANSACTION_WITHDRAWAL_DETAILS_REQUEST;
  payload: { id: string };
}

export const requestWithdrawalDetails = (id: string): RequestWithdrawalDetails => {
  return {
    type: TransactionsActionTypes.TRANSACTION_WITHDRAWAL_DETAILS_REQUEST,
    payload: { id },
  };
};

export const requestWithdrawalCancel = (id: string): RequestWithdrawalCancel => {
  return {
    type: TransactionsActionTypes.TRANSACTION_WITHDRAWAL_CANCEL_REQUEST,
    payload: { id },
  };
};

export const requestWithdrawal = (
  transaction: AllOptionalExceptFor<Transaction, 'amount'>
): RequestWithdrawal => {
  return {
    type: TransactionsActionTypes.TRANSACTION_WITHDRAWAL_REQUEST,
    payload: { transaction },
  };
};

export const requestTransferConfirmation = (id: string): RequestTransferConfirmation => {
  return {
    type: TransactionsActionTypes.TRANSFER_CONFIRM_REQUEST,
    payload: { id },
  };
};

export const requestTransferCancel = (id: string): RequestTransferCancel => {
  return {
    type: TransactionsActionTypes.TRANSFER_CANCEL_REQUEST,
    payload: { id },
  };
};

export const requestTransfer = (transfer: {
  amount: Money;
  notes: string;
  receiverName: string;
  receiverPhoneNumber: string;
}): RequestTransfer => {
  return {
    type: TransactionsActionTypes.TRANSFER_REQUEST,
    payload: { transfer },
  };
};
/**
 * Generic transaction details request. You can pass a loopback filter here to query the transaction.
 * @param filter
 */
export const requestTransactionDetails = (
  filter: Record<string, unknown>
): RequestTransactionDetails => {
  return {
    type: TransactionsActionTypes.TRANSACTION_DETAILS_REQUEST,
    payload: { filter },
  };
};

export const setTransactionDetails = (transactions: Transaction[]): SetTransactionDetails => {
  return {
    type: TransactionsActionTypes.TRANSACTION_DETAILS_SET,
    payload: { transactions },
  };
};
