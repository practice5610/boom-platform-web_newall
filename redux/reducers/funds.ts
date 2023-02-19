import { Reducer } from 'redux';

import { FundsAction } from '../actions/funds';
import { FundsActionTypes } from '../actionTypes';

export interface FundsState {
  addFundsState: number;
  errorCode: string;
}

const initState = {
  addFundsState: 0,
  errorCode: '',
};

export const funds: Reducer<FundsState, FundsAction> = (state = initState, action) => {
  switch (action.type) {
    case FundsActionTypes.ADD_FUNDS_REQUEST: {
      return { ...state, addFundsState: 1 };
    }
    case FundsActionTypes.ADD_FUNDS_SUCCESS: {
      return { ...state, addFundsState: 2 };
    }
    case FundsActionTypes.ADD_FUNDS_FAILURE: {
      return { ...state, addFundsState: -1, errorCode: action.payload.errorCode };
    }
  }
  return state;
};
