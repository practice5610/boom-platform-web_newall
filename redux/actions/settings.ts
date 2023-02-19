import { Action } from 'redux';

import { SettingsActionTypes } from '../actionTypes';
import * as appActions from './app';

export type SettingsAction =
  | GetPlaidEnvInfo
  | GetPlaidEnvInfoSuccess
  | GetPlaidEnvInfoFailure
  | GetPlaidAccessToken
  | GetPlaidAccessTokenSuccess
  | GetPlaidAccessTokenFailure
  | GetPlaidPublicToken
  | GetPlaidPublicTokenSuccess
  | GetPlaidPublicTokenFailure
  | RemovePublicToken
  | RemoveBankAccount
  | RemoveBankAccountSuccess
  | RemoveBankAccountFailure;

export interface GetPlaidEnvInfo extends Action {
  type: SettingsActionTypes.GET_PLAID_ENV_INFO;
}
export interface GetPlaidEnvInfoSuccess extends Action {
  type: SettingsActionTypes.GET_PLAID_ENV_INFO_SUCCESS;
  payload: { plaidEnvInfo: string };
}
export interface GetPlaidEnvInfoFailure extends Action {
  type: SettingsActionTypes.GET_PLAID_ENV_INFO_FAILURE;
}
export interface GetPlaidAccessToken extends Action {
  type: SettingsActionTypes.GET_PLAID_ACCESS_TOKEN;
  payload: { publicToken: string; user: any; plaidLoginData: any; isMerchant?: boolean };
}
export interface GetPlaidAccessTokenSuccess extends Action {
  type: SettingsActionTypes.GET_PLAID_ACCESS_TOKEN_SUCCESS;
}
export interface GetPlaidAccessTokenFailure extends Action {
  type: SettingsActionTypes.GET_PLAID_ACCESS_TOKEN_FAILURE;
}
export interface GetPlaidPublicToken extends Action {
  type: SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN;
  payload: { itemId: string; uid: string };
}
export interface GetPlaidPublicTokenSuccess extends Action {
  type: SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN_SUCCESS;
  payload: { publicToken: string };
}
export interface GetPlaidPublicTokenFailure extends Action {
  type: SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN_FAILURE;
}
export interface RemovePublicToken extends Action {
  type: SettingsActionTypes.REMOVE_PUBLIC_TOKEN;
}
export interface RemoveBankAccount extends Action {
  type: SettingsActionTypes.REMOVE_BANK_ACCOUNT;
  payload: { accountIndex: number; user: any };
}
export interface RemoveBankAccountSuccess extends Action {
  type: SettingsActionTypes.REMOVE_BANK_ACCOUNT_SUCCESS;
}
export interface RemoveBankAccountFailure extends Action {
  type: SettingsActionTypes.REMOVE_BANK_ACCOUNT_FAILURE;
}

export const getPlaidEnvInfo = (): GetPlaidEnvInfo => {
  return {
    type: SettingsActionTypes.GET_PLAID_ENV_INFO,
  };
};
export const getPlaidEnvInfoSuccess = (plaidEnvInfo: any): GetPlaidEnvInfoSuccess => {
  return {
    type: SettingsActionTypes.GET_PLAID_ENV_INFO_SUCCESS,
    payload: { plaidEnvInfo },
  };
};
export const getPlaidEnvInfoFailure = (): GetPlaidEnvInfoFailure => {
  return {
    type: SettingsActionTypes.GET_PLAID_ENV_INFO_FAILURE,
  };
};

export const getPlaidAccessToken = (
  publicToken: string,
  user: any,
  plaidLoginData: any,
  isMerchant?: boolean
): GetPlaidAccessToken => {
  return {
    type: SettingsActionTypes.GET_PLAID_ACCESS_TOKEN,
    payload: { publicToken, user, plaidLoginData, isMerchant },
  };
};
export const getPlaidAccessTokenSuccess = (): GetPlaidAccessTokenSuccess => {
  return {
    type: SettingsActionTypes.GET_PLAID_ACCESS_TOKEN_SUCCESS,
  };
};
export const getPlaidAccessTokenFailure = (): GetPlaidAccessTokenFailure => {
  return {
    type: SettingsActionTypes.GET_PLAID_ACCESS_TOKEN_FAILURE,
  };
};

export const getPlaidPublicToken = (itemId: string, uid: string): GetPlaidPublicToken => {
  return {
    type: SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN,
    payload: { itemId, uid },
  };
};
export const getPlaidPublicTokenSuccess = (publicToken: string): GetPlaidPublicTokenSuccess => {
  return {
    type: SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN_SUCCESS,
    payload: { publicToken },
  };
};
export const getPlaidPublicTokenFailure = (): GetPlaidPublicTokenFailure => {
  return {
    type: SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN_FAILURE,
  };
};

export const removePublicToken = (): RemovePublicToken => {
  return {
    type: SettingsActionTypes.REMOVE_PUBLIC_TOKEN,
  };
};

export const removeBankAccount = (accountIndex: number, user: any): RemoveBankAccount => {
  return {
    type: SettingsActionTypes.REMOVE_BANK_ACCOUNT,
    payload: { accountIndex, user },
  };
};
export const removeBankAccountSuccess = (): RemoveBankAccountSuccess => {
  return {
    type: SettingsActionTypes.REMOVE_BANK_ACCOUNT_SUCCESS,
  };
};
export const removeBankAccountFailure = (): RemoveBankAccountFailure => {
  return {
    type: SettingsActionTypes.REMOVE_BANK_ACCOUNT_FAILURE,
  };
};
