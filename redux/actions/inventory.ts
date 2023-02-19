import { InventoryItemType } from '@boom-platform/globals';
import { Action } from 'redux';

import { InventoryActionTypes } from '../actionTypes';

export type InventoryAction = GetInventoryItemTypes | SetInventoryItemTypes;

export interface GetInventoryItemTypes extends Action {
  type: InventoryActionTypes.GET_INVENTORY_ITEM_TYPES;
  payload: {};
}

export interface SetInventoryItemTypes extends Action {
  type: InventoryActionTypes.SET_INVENTORY_ITEM_TYPES;
  payload: { inventoryItemTypes: InventoryItemType[] };
}

export const getInventoryItemTypes = (): GetInventoryItemTypes => {
  return {
    type: InventoryActionTypes.GET_INVENTORY_ITEM_TYPES,
    payload: {},
  };
};

export const setInventoryItemTypes = (
  inventoryItemTypes: InventoryItemType[]
): SetInventoryItemTypes => {
  return {
    type: InventoryActionTypes.SET_INVENTORY_ITEM_TYPES,
    payload: { inventoryItemTypes },
  };
};
