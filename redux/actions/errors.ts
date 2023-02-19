import { Action } from 'redux';

import { ErrorActionTypes } from '../actionTypes';

export type ErrorAction =
  | ClearError
  | ClearAllErrors
  | SetAppInitializeError
  | SetAuthError
  | SetSearchError
  | SetAPIError;

export interface ClearError extends Action {
  type: ErrorActionTypes.ERROR_CLEAR;
  payload: string;
}

export interface SetAppError extends Action {
  type: ErrorActionTypes.ERROR_SET;
  payload: string;
}

export interface SetAPIError extends Action {
  type: ErrorActionTypes.ERROR_API_SET;
  payload: string;
}

export interface ClearAllErrors extends Action {
  type: ErrorActionTypes.ERROR_CLEAR_ALL;
}

export interface SetAppInitializeError extends Action {
  type: ErrorActionTypes.ERROR_APP_INITIALIZE;
  payload: string;
}

export interface SetAuthError extends Action {
  type: ErrorActionTypes.ERROR_AUTH_SET;
  payload: string;
}

export interface SetSearchError extends Action {
  type: ErrorActionTypes.ERROR_SEARCH_SET;
  payload: string;
}

export const setAppInitializeError = (error: string): SetAppInitializeError => {
  return {
    type: ErrorActionTypes.ERROR_APP_INITIALIZE,
    payload: error,
  };
};

export const setAppError = (key: string): SetAppError => {
  return {
    type: ErrorActionTypes.ERROR_SET,
    payload: key,
  };
};

export const setAPIError = (key: string): SetAPIError => {
  return {
    type: ErrorActionTypes.ERROR_API_SET,
    payload: key,
  };
};

export const setSearchError = (key: string): SetSearchError => {
  return {
    type: ErrorActionTypes.ERROR_SEARCH_SET,
    payload: key,
  };
};

export const clearError = (key: string): ClearError => {
  return {
    type: ErrorActionTypes.ERROR_CLEAR,
    payload: key,
  };
};

export const clearAllErrors = (): ClearAllErrors => {
  return {
    type: ErrorActionTypes.ERROR_CLEAR_ALL,
  };
};

export const setAuthError = (error: string): SetAuthError => {
  return {
    type: ErrorActionTypes.ERROR_AUTH_SET,
    payload: error,
  };
};
