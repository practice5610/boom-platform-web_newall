import { InventoryItemType } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { InventoryAction } from '../actions/inventory';
import { InventoryActionTypes } from '../actionTypes';

export interface InventoryState {
  inventoryItemTypes: InventoryItemType[] | null;
}

const initState: InventoryState = {
  inventoryItemTypes: [],
};

export const inventory: Reducer<InventoryState, InventoryAction> = (state = initState, action) => {
  switch (action.type) {
    case InventoryActionTypes.SET_INVENTORY_ITEM_TYPES: {
      return { ...state, inventoryItemTypes: action.payload.inventoryItemTypes };
    }
  }
  return state;
};
