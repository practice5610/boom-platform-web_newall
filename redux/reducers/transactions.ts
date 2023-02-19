import { Transaction } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { TransactionAction } from '../actions/transactions';
import { TransactionsActionTypes } from '../actionTypes';

export interface TransactionsState {
  transactions: Transaction[] | null;
}

const initState = {
  transactions: null,
};

export const transactions: Reducer<TransactionsState, TransactionAction> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case TransactionsActionTypes.TRANSACTION_DETAILS_SET: {
      return { ...state, transactions: action.payload.transactions };
    }
  }
  return state;
};
