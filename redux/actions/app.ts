import { Geolocation } from '@boom-platform/globals';
import { Action } from 'redux';

import { ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { AppActionTypes } from '../actionTypes';

export type AppAction =
  | RequestAppInitialize
  | SetAppAsInitialized
  | SetFirebaseAsInitialized
  | RehydrateLocalStorage
  | SetToLocalStorage
  | SetGeolocation
  | SetIp
  | SetGlobalToast
  | RequestSMSAppLinks
  | SetLoadingOverlay;

export interface RequestAppInitialize extends Action {
  type: AppActionTypes.APP_INITIALIZE_REQUEST;
}

export interface SetAppAsInitialized extends Action {
  type: AppActionTypes.APP_INITIALIZED_SET;
}

export interface SetFirebaseAsInitialized extends Action {
  type: AppActionTypes.FIREBASE_INITIALIZED_SET;
}

export interface RehydrateLocalStorage extends Action {
  type: AppActionTypes.APP_LOCAL_STORAGE_REHYDRATE;
}

export interface SetToLocalStorage extends Action {
  type: AppActionTypes.APP_LOCAL_STORAGE_SET;
  payload: { key: string; value: any };
}

export interface SetGeolocation extends Action {
  type: AppActionTypes.APP_GELOCATION_SET;
  payload: Geolocation;
}

export interface SetIp extends Action {
  type: AppActionTypes.APP_IP_SET;
  payload: string;
}

export interface SetGlobalToast extends Action {
  type: AppActionTypes.APP_TOAST_SET;
  payload: ToastRequest | null;
}

export interface RequestSMSAppLinks extends Action {
  type: AppActionTypes.APP_SMS_APP_LINKS_REQUEST;
  payload: { token: string; phone: string };
}

export interface SetLoadingOverlay extends Action {
  type: AppActionTypes.APP_LOADING_OVERLAY_SET;
  payload: boolean;
}

export const requestAppInitialize = (): RequestAppInitialize => {
  return {
    type: AppActionTypes.APP_INITIALIZE_REQUEST,
  };
};

export const setAppAsInitialized = (): SetAppAsInitialized => {
  return {
    type: AppActionTypes.APP_INITIALIZED_SET,
  };
};

export const setFirebaseAsInitialized = (): SetFirebaseAsInitialized => {
  return {
    type: AppActionTypes.FIREBASE_INITIALIZED_SET,
  };
};

export const rehydrateLocalStorage = (): RehydrateLocalStorage => {
  return {
    type: AppActionTypes.APP_LOCAL_STORAGE_REHYDRATE,
  };
};

export const setToLocalStorage = (key: string, value: any): SetToLocalStorage => {
  return {
    type: AppActionTypes.APP_LOCAL_STORAGE_SET,
    payload: { key, value },
  };
};

export const setGeolocation = (lat: number | null, lng: number | null): SetGeolocation => {
  return {
    type: AppActionTypes.APP_GELOCATION_SET,
    payload: { lat, lng },
  };
};

export const setIp = (ip: string): SetIp => {
  return {
    type: AppActionTypes.APP_IP_SET,
    payload: ip,
  };
};

export const setGlobalToast = (toast: ToastRequest | null): SetGlobalToast => {
  return {
    type: AppActionTypes.APP_TOAST_SET,
    payload: toast,
  };
};

export const setErrorGlobalToast = (error: string, heading = 'Error'): SetGlobalToast => {
  return {
    type: AppActionTypes.APP_TOAST_SET,
    payload: {
      heading,
      body: error,
      type: ToastTypes.ERROR,
    },
  };
};

export const requestSMSAppLinks = (token: string, phone: string): RequestSMSAppLinks => {
  return {
    type: AppActionTypes.APP_SMS_APP_LINKS_REQUEST,
    payload: { token, phone },
  };
};

export const setLoadingOverlay = (value: boolean): SetLoadingOverlay => {
  return {
    type: AppActionTypes.APP_LOADING_OVERLAY_SET,
    payload: value,
  };
};
