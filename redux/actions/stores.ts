import { Category, Offer, Store } from '@boom-platform/globals';
import { Action } from 'redux';

import { StoreActionTypes } from '../actionTypes';

export interface SetStoreType extends Action {
  type: StoreActionTypes.STORE_CONFIG_TYPES_SET;
  //payload: string[];
  payload: Category[];
}

export interface RequestStoreDetails extends Action {
  type: StoreActionTypes.STORE_DETAILS_REQUEST;
  payload: { id: string | undefined };
}

export interface SetStoreDetails extends Action {
  type: StoreActionTypes.STORE_DETAILS_SET;
  payload: { store: Store | null; storeStatus: string | '' };
}

export interface SetStoreOffers extends Action {
  type: StoreActionTypes.STORE_OFFERS_SET;
  payload: { storeOffers: Offer | null };
}

export interface RequestStoreTypes extends Action {
  type: StoreActionTypes.STORE_CONFIG_REQUEST;
}

export type StoresAction =
  | SetStoreType
  | RequestStoreDetails
  | SetStoreDetails
  | SetStoreOffers
  | RequestStoreTypes;

//export const setStoreTypes = (types: string[]): SetStoreType => {
export const setStoreTypes = (types: Category[]): SetStoreType => {
  return {
    type: StoreActionTypes.STORE_CONFIG_TYPES_SET,
    payload: types,
  };
};

export const requestStoreTypes = (): RequestStoreTypes => {
  return { type: StoreActionTypes.STORE_CONFIG_REQUEST };
};

export const requestStoreDetails = (id: string | undefined): RequestStoreDetails => {
  return { type: StoreActionTypes.STORE_DETAILS_REQUEST, payload: { id } };
};

export const setStoreDetails = (store: Store | null, storeStatus: string | ''): SetStoreDetails => {
  return { type: StoreActionTypes.STORE_DETAILS_SET, payload: { store, storeStatus } };
};

export const setStoreOffers = (storeOffers: Offer | null): SetStoreOffers => {
  return { type: StoreActionTypes.STORE_OFFERS_SET, payload: { storeOffers } };
};
