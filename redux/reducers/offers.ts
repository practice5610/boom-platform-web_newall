import { Offer } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { OfferAction } from '../actions/offers';
import { OfferActionTypes } from '../actionTypes';

export interface OffersState {
  offerDetails: Offer | null;
  storeOffers: Offer[] | [];
  offerStatus: string | '';
}

const initState = {
  offerDetails: null,
  storeOffers: [],
  offerStatus: 'loading',
};

export const offers: Reducer<OffersState, OfferAction> = (state = initState, action) => {
  switch (action.type) {
    case OfferActionTypes.OFFER_DETAILS_AND_STORE_OFFERS_REQUEST: {
      return {
        ...state,
        offerStatus: 'loading',
      };
    }
    case OfferActionTypes.OFFER_DETAILS_SET: {
      return {
        ...state,
        offerDetails: action.payload.offer,
        offerStatus: action.payload.offerStatus,
      };
    }
    case OfferActionTypes.STORE_OFFERS_SET: {
      return { ...state, storeOffers: action.payload.storeOffers };
    }
  }
  return state;
};
