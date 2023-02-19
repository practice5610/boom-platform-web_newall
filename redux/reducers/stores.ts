import { Category, Offer, Store } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { StoresAction } from '../actions/stores';
import { StoreActionTypes } from '../actionTypes';

export interface StoreConfigState {
  storeTypes: string[];
  storeCategories: Category[];
  storeDetails: Store | null;
  storeStatus: string | '';
  storeOffers: Offer | null;
}

const initState = {
  storeTypes: ['Restaurant', 'Clothing', 'Repair', 'Home Goods'],
  storeCategories: [{ _id: 'id', name: '' }],
  storeDetails: null,
  storeStatus: 'loading',
  storeOffers: null,
};

export const storesConfig: Reducer<StoreConfigState, StoresAction> = (
  state = initState,
  action
) => {
  switch (action.type) {
    case StoreActionTypes.STORE_CONFIG_TYPES_SET: {
      //return { ...state, storeTypes: action.payload };
      return { ...state, storeCategories: action.payload };
    }
    case StoreActionTypes.STORE_DETAILS_REQUEST: {
      return { ...state, storeStatus: 'loading' };
    }
    case StoreActionTypes.STORE_DETAILS_SET: {
      return {
        ...state,
        storeDetails: action.payload.store,
        storeStatus: action.payload.storeStatus,
      };
    }
    case StoreActionTypes.STORE_OFFERS_SET: {
      return { ...state, storeOffers: action.payload.storeOffers };
    }
  }
  return state;
};
