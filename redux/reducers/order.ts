import { InventoryOrder } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { OrderAction } from '../actions/order';
import { OrderActionTypes } from '../actionTypes';

export interface OrderState {
  inventoryOrders: InventoryOrder[] | null;
}

const initState: OrderState = {
  inventoryOrders: [],
};

export const order: Reducer<OrderState, OrderAction> = (state = initState, action) => {
  switch (action.type) {
    case OrderActionTypes.SET_INVENTORY_ORDERS: {
      return { ...state, inventoryOrders: action.payload.inventoryOrders };
    }
  }
  return state;
};
