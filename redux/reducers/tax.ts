import { Reducer } from 'redux';

import { Tax } from '../../models/tax.model';
import { TaxAction } from '../actions/tax';
import { TaxActionTypes } from '../actionTypes';

export interface TaxState {
  tax: Tax[] | [];
}

const initState = {
  tax: [],
};

/**
 * Generic tax reducer. When the TaxAction gets called it will append a tax object to the state.
 */
export const tax: Reducer<TaxState, TaxAction> = (state = initState, action) => {
  switch (action.type) {
    case TaxActionTypes.ACCOUNT_MEMBER_TAX_SET: {
      return { ...state, tax: action.payload };
    }
  }
  return state;
};
