import { Offer } from '@boom-platform/globals';
import { Action } from 'redux';

import { OfferActionTypes } from '../actionTypes';

export type OfferAction = RequestOfferDetails | SetOfferDetails | SetStoreOffers;

export interface RequestOfferDetails extends Action {
  type: OfferActionTypes.OFFER_DETAILS_AND_STORE_OFFERS_REQUEST;
  payload: { id: string };
}

export interface SetOfferDetails extends Action {
  type: OfferActionTypes.OFFER_DETAILS_SET;
  payload: { offer: Offer | null; offerStatus: string };
}

export interface SetStoreOffers extends Action {
  type: OfferActionTypes.STORE_OFFERS_SET;
  payload: { storeOffers: Offer[] };
}
/**
 * Generic transaction details request. You can pass a loopback filter here to query the transaction.
 * @param filter
 */
export const requestOfferAndStoreOffersDetails = (id: string): RequestOfferDetails => {
  return {
    type: OfferActionTypes.OFFER_DETAILS_AND_STORE_OFFERS_REQUEST,
    payload: { id },
  };
};

export const setOfferDetails = (offer: Offer | null, offerStatus: string): SetOfferDetails => {
  return {
    type: OfferActionTypes.OFFER_DETAILS_SET,
    payload: { offer, offerStatus },
  };
};

export const setStoreOffers = (storeOffers: Offer[]): SetStoreOffers => {
  return {
    type: OfferActionTypes.STORE_OFFERS_SET,
    payload: { storeOffers },
  };
};
