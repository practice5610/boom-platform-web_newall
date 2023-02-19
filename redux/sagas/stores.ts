import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { get } from '../../utils/api';
import * as errorActions from '../actions/errors';
import * as StoresAction from '../actions/stores';
import { StoreActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';

export function* requestStoreDetails(action: StoresAction.RequestStoreDetails) {
  try {
    const id = action.payload.id;
    const result = yield call(get, `/stores/${id}`);
    const storeOffers = yield call(get, `/offers`, {
      params: { '[filter][where][product.store._id]': `${id ? id : null}` },
    });
    yield put(StoresAction.setStoreDetails(result.data, 'loaded'));
    yield put(StoresAction.setStoreOffers(storeOffers.data));
  } catch (error: any) {
    yield put(StoresAction.setStoreDetails(null, 'error'));
    yield put(errorActions.setAPIError(error.toString()));
  }
}
//STORE_CONFIG_TYPES_SET
export function* requestStoreTypes(action: StoresAction.RequestStoreTypes) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const storeConfigs = yield call(get, `/categories`, {}, jwt);
    yield put(StoresAction.setStoreTypes(storeConfigs.data.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* watchRequests() {
  yield takeLatest(StoreActionTypes.STORE_DETAILS_REQUEST, requestStoreDetails);
  yield takeLatest(StoreActionTypes.STORE_CONFIG_REQUEST, requestStoreTypes);
}

export default function* root() {
  yield fork(watchRequests);
}
