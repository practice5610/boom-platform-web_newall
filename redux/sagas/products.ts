import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { get } from '../../utils/api';
import * as errorActions from '../actions/errors';
import * as OfferAction from '../actions/offers';
import * as ProductActions from '../actions/products';
import { ProductActionTypes } from '../actionTypes';
import { getStoreOffers } from './offers';

export function* getAllProducts(action: ProductActions.RequestGetAllProducts) {
  try {
    const result = yield call(get, `/products`);
    yield put(ProductActions.setAllProducts(result.data, result.data.length));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestProductDetailsAndStoreOffers(
  action: ProductActions.RequestProductDetailsAndStoreOffers
) {
  try {
    const id = action.payload.id;
    const result = yield call(get, `/products/${id}`);
    const storeId = result.data.store._id;
    const storeOffers = yield call(getStoreOffers, id, storeId);
    yield put(ProductActions.setProductDetails(result.data, 'loaded'));
    yield put(OfferAction.setStoreOffers(storeOffers));
  } catch (error: any) {
    yield put(ProductActions.setProductDetails(null, 'error'));
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* watchRequests() {
  yield takeLatest(
    ProductActionTypes.PRODUCT_DETAILS_AND_STORE_OFFERS_REQUEST,
    requestProductDetailsAndStoreOffers
  );
  yield takeLatest(ProductActionTypes.GET_ALL_PRODUCT_REQUEST, getAllProducts);
}

export default function* root() {
  yield fork(watchRequests);
}
