import { Action } from 'redux';

import { Tax } from '../../models/tax.model';
import { TaxActionTypes } from '../actionTypes';

export type TaxAction = SetTotalTax;

export interface SetTotalTax extends Action {
  type: TaxActionTypes.ACCOUNT_MEMBER_TAX_SET;
  payload: Tax[];
}

export const setTotalTax = (tax: Tax[]): SetTotalTax => {
  return {
    type: TaxActionTypes.ACCOUNT_MEMBER_TAX_SET,
    payload: tax,
  };
};
