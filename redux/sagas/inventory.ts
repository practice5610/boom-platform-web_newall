import { InventoryItemType } from '@boom-platform/globals';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { AdminConfigType } from '../../constants';
import { get } from '../../utils/api';
import * as errorActions from '../actions/errors';
import * as inventoryActions from '../actions/inventory';
import { InventoryActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';

export function* getInventoryItemTypes() {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(
      get,
      `/config`,
      { params: { '[filter][where][type]': AdminConfigType.INVENTORY_TYPES } },
      jwt
    );
    if (result.data && result.data.length === 1) {
      yield put(
        inventoryActions.setInventoryItemTypes(result.data[0].value as InventoryItemType[])
      );
    }
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* watchRequests() {
  yield takeLatest(InventoryActionTypes.GET_INVENTORY_ITEM_TYPES, getInventoryItemTypes);
}

export default function* root() {
  yield fork(watchRequests);
}
