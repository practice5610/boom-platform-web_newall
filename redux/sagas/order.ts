import {
  InventoryOrder,
  InventoryOrderResult,
  InventoryOrderStatus,
  InventoryOrderType,
} from '@boom-platform/globals';
import _ from 'lodash';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { ToastTypes } from '../../constants';
import { ToastRequest } from '../../models';
import { get, patch, post } from '../../utils/api';
import * as appActions from '../actions/app';
import * as errorActions from '../actions/errors';
import * as orderActions from '../actions/order';
import { OrderActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';

const LAST_ORDERS_COUNT = 10;

export function* getInventoryOrders() {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(
      get,
      `/inventory-orders`,
      {
        params: {
          '[filter][limit]': `${LAST_ORDERS_COUNT}`,
          '[filter][order]': `updatedAt DESC`,
        },
      },
      jwt
    );

    yield put(orderActions.setInventoryOrders(result.data as InventoryOrder[]));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestInventoryOrders(action: orderActions.RequestInventoryOrders) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const orderStore = yield select(({ order }) => order);
    const orders: InventoryOrder[] = action.payload.inventoryOrders;

    const result = yield call(
      post,
      `/inventory-orders`,
      orders,
      { headers: { 'Content-Type': 'application/json' } },
      jwt
    );

    const orderResults: InventoryOrderResult = result.data as InventoryOrderResult;

    if (!orderResults.success) {
      throw new Error(orderResults.message);
    }

    const heading = 'Success';
    let body = 'Inventory types are ordered successfully';
    const type: ToastTypes = ToastTypes.SUCCESS;

    // check if this was a new order or a replace/cancel order
    if (orders.length === 1 && orders[0].orderType !== InventoryOrderType.PURCHASE) {
      body = 'Your request was submitted successfully';
    }

    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));

    // We may want to only do this when the order type is purchase
    const inventoryOrders: InventoryOrder[] = [
      ...orderResults.inventoryOrders!,
      ...orderStore.inventoryOrders,
    ].slice(0, 10) as InventoryOrder[];

    yield put(orderActions.setInventoryOrders(inventoryOrders));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestInventoryOrderCancel(action: orderActions.RequestInventoryOrderCancel) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const inventoryOrders: InventoryOrder[] = yield select(({ order }) => order.inventoryOrders);

    const { inventoryOrder } = action.payload;
    yield call(
      patch,
      `/inventory-orders/${inventoryOrder._id!}`,
      { status: InventoryOrderStatus.CANCELLED },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      jwt
    );

    const heading = 'Success';
    const body = 'Order is cancelled';
    const type: ToastTypes = ToastTypes.SUCCESS;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));

    const updatedInventoryOrders: InventoryOrder[] = inventoryOrders.map((order) => {
      if (order._id! === inventoryOrder._id!) {
        return {
          ...order,
          status: InventoryOrderStatus.CANCELLED,
        };
      } else {
        return {
          ...order,
        };
      }
    });

    yield put(orderActions.setInventoryOrders(updatedInventoryOrders));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* watchRequests() {
  yield takeLatest(OrderActionTypes.GET_INVENTORY_ORDERS, getInventoryOrders);
  yield takeLatest(OrderActionTypes.REQUEST_INVENTORY_ORDERS, requestInventoryOrders);
  yield takeLatest(OrderActionTypes.REQUEST_INVENTORY_ORDER_CANCEL, requestInventoryOrderCancel);
}

export default function* root() {
  yield fork(watchRequests);
}
