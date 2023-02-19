import { Reducer } from 'redux';

import { SettingsAction } from '../actions/settings';
import { SettingsActionTypes } from '../actionTypes';

export interface SettingsState {
  plaidEnvInfo: any;
  getEnvInfoState: number;
  getAccessTokenState: number;
  getPublicTokenState: number;
  accountRemovingState: number;
  createdPublicToken: string;
}

const initState = {
  plaidEnvInfo: '',
  getEnvInfoState: 0,
  getAccessTokenState: 0,
  getPublicTokenState: 0,
  accountRemovingState: 0,
  createdPublicToken: '',
};

export const settings: Reducer<SettingsState, SettingsAction> = (state = initState, action) => {
  switch (action.type) {
    case SettingsActionTypes.GET_PLAID_ENV_INFO: {
      return { ...state, getEnvInfoState: 1 };
    }
    case SettingsActionTypes.GET_PLAID_ENV_INFO_SUCCESS: {
      return { ...state, getEnvInfoState: 2, plaidEnvInfo: action.payload.plaidEnvInfo };
    }
    case SettingsActionTypes.GET_PLAID_ENV_INFO_FAILURE: {
      return { ...state, getEnvInfoState: -1 };
    }

    case SettingsActionTypes.GET_PLAID_ACCESS_TOKEN: {
      return { ...state, getAccessTokenState: 1 };
    }
    case SettingsActionTypes.GET_PLAID_ACCESS_TOKEN_SUCCESS: {
      return { ...state, getAccessTokenState: 2 };
    }
    case SettingsActionTypes.GET_PLAID_ACCESS_TOKEN_FAILURE: {
      return { ...state, getAccessTokenState: -1 };
    }

    case SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN: {
      return { ...state, getPublicTokenState: 1 };
    }
    case SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN_SUCCESS: {
      return { ...state, getPublicTokenState: 2, createdPublicToken: action.payload.publicToken };
    }
    case SettingsActionTypes.GET_PLAID_PUBLIC_TOKEN_FAILURE: {
      return { ...state, getPublicTokenState: -1 };
    }
    case SettingsActionTypes.REMOVE_PUBLIC_TOKEN: {
      return { ...state, getPublicTokenState: 0, createdPublicToken: '' };
    }

    case SettingsActionTypes.REMOVE_BANK_ACCOUNT: {
      return { ...state, accountRemovingState: 1 };
    }
    case SettingsActionTypes.REMOVE_BANK_ACCOUNT_SUCCESS: {
      return { ...state, accountRemovingState: 2 };
    }
    case SettingsActionTypes.REMOVE_BANK_ACCOUNT_FAILURE: {
      return { ...state, accountRemovingState: -1 };
    }
  }
  return state;
};
