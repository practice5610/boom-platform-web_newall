import { Money } from '@boom-platform/globals';
import { Action } from 'redux';

import { FundsActionTypes } from '../actionTypes';

export type FundsAction = AddFunds | AddFundsSuccess | AddFundsFailure;

export interface AddFunds extends Action {
  type: FundsActionTypes.ADD_FUNDS_REQUEST;
  payload: {
    amount: Money;
    plaidItemId: string;
    plaidAccountId: string;
  };
}
export interface AddFundsSuccess extends Action {
  type: FundsActionTypes.ADD_FUNDS_SUCCESS;
}
export interface AddFundsFailure extends Action {
  type: FundsActionTypes.ADD_FUNDS_FAILURE;
  payload: {
    errorCode: string;
  };
}

export const addFunds = (amount: Money, plaidItemId: string, plaidAccountId: string): AddFunds => {
  return {
    type: FundsActionTypes.ADD_FUNDS_REQUEST,
    payload: {
      amount,
      plaidItemId,
      plaidAccountId,
    },
  };
};
export const addFundsSuccess = (): AddFundsSuccess => {
  return {
    type: FundsActionTypes.ADD_FUNDS_SUCCESS,
  };
};
export const addFundsFailure = (errorCode): AddFundsFailure => {
  return {
    type: FundsActionTypes.ADD_FUNDS_FAILURE,
    payload: {
      errorCode,
    },
  };
};
