import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { get } from '../../utils/api';
import * as errorActions from '../actions/errors';
import * as OfferAction from '../actions/offers';
import { OfferActionTypes } from '../actionTypes';

export function* requestOfferAndStoreOffersDetails(action: OfferAction.RequestOfferDetails) {
  try {
    const id = action.payload.id;
    const result = yield call(get, `/offers/${id}`);
    console.log(result);
    // grab store id of offer selected
    const storeId = result.data.product.store._id;
    const storeOffers = yield call(getStoreOffers, id, storeId);
    yield put(OfferAction.setOfferDetails(result.data, 'loaded'));
    yield put(OfferAction.setStoreOffers(storeOffers));
  } catch (error: any) {
    yield put(OfferAction.setOfferDetails(null, 'error'));
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getStoreOffers(offerId: string, storeId: string) {
  try {
    const storeOffers = yield call(get, `/offers`, {
      params: { '[filter][where][product.store._id]': storeId },
    });
    return storeOffers.data.filter((offer) => offer._id !== offerId);
  } catch (error: any) {
    throw new Error(error);
  }
}

export function* watchRequests() {
  yield takeLatest(
    OfferActionTypes.OFFER_DETAILS_AND_STORE_OFFERS_REQUEST,
    requestOfferAndStoreOffersDetails
  );
}

export default function* root() {
  yield fork(watchRequests);
}
