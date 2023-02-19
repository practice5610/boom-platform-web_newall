import { InventoryOrder } from '@boom-platform/globals';
import { Action } from 'redux';

import { OrderActionTypes } from '../actionTypes';

export type OrderAction =
  | GetInventoryOrders
  | SetInventoryOrders
  | RequestInventoryOrders
  | RequestInventoryOrderCancel;

export interface GetInventoryOrders extends Action {
  type: OrderActionTypes.GET_INVENTORY_ORDERS;
  payload: {};
}

export interface SetInventoryOrders extends Action {
  type: OrderActionTypes.SET_INVENTORY_ORDERS;
  payload: { inventoryOrders: InventoryOrder[] };
}

export interface RequestInventoryOrders extends Action {
  type: OrderActionTypes.REQUEST_INVENTORY_ORDERS;
  payload: { inventoryOrders: InventoryOrder[] };
}

export interface RequestInventoryOrderCancel extends Action {
  type: OrderActionTypes.REQUEST_INVENTORY_ORDER_CANCEL;
  payload: { inventoryOrder: InventoryOrder };
}

export const getInventoryOrders = (): GetInventoryOrders => {
  return {
    type: OrderActionTypes.GET_INVENTORY_ORDERS,
    payload: {},
  };
};

export const setInventoryOrders = (inventoryOrders: InventoryOrder[]): SetInventoryOrders => {
  return {
    type: OrderActionTypes.SET_INVENTORY_ORDERS,
    payload: { inventoryOrders },
  };
};

export const requestInventoryOrders = (
  inventoryOrders: InventoryOrder[]
): RequestInventoryOrders => {
  return {
    type: OrderActionTypes.REQUEST_INVENTORY_ORDERS,
    payload: { inventoryOrders },
  };
};

export const requestInventoryOrderCancel = (
  inventoryOrder: InventoryOrder
): RequestInventoryOrderCancel => {
  return {
    type: OrderActionTypes.REQUEST_INVENTORY_ORDER_CANCEL,
    payload: { inventoryOrder },
  };
};
