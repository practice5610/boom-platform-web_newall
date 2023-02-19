import {
  AllOptionalExceptFor,
  BoomAccount,
  BoomUser,
  InventoryItem,
  InventoryOrder,
  Offer,
  Product,
  Store,
  Transaction,
  TransactionType,
} from '@boom-platform/globals';
import { Action } from 'redux';

import { MerchantAccountActionTypes } from '../actionTypes';

export type AccountMerchantActions =
  | RequestOffers
  | RequestFilteredOffers
  | SetOffers
  | SetNickNameSuccess
  | SetProducts
  | RequestMerchantTransactionHistory
  | SetMerchantTransactionHistory
  | SetMerchantTransactions
  | RequestMerchantTransactions
  | RequestProducts
  | RequestFilteredProducts
  | RequestStore
  | SetStore
  | RequestUpdateStore
  | SetMerchantImage
  | CreateProductAndOffer
  | RequestEditOffers
  | RequestCreateProducts
  | RequestUpdateProduct
  | RequestCreateOffer
  | RequestCreateStore
  | DeleteOffer
  | DeleteProduct
  | RequestInventory
  | SetInventory
  | AddTaxableStates
  | UpdateDeviceNickName
  | SetMerchantBoomAccount
  | RequestMerchantBoomAccount
  | RequestInventoryOrders
  | RequestFilteredInventoryOrders;

export interface RequestProducts extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_REQUEST;
}
export interface RequestFilteredProducts extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_PRODUCTS_REQUEST;
  payload: { filterBy: string; limit: number; skip: number };
}

export interface RequestOffers extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_REQUEST;
}

export interface RequestFilteredOffers extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_OFFERS_REQUEST;
  payload: { filterBy: string; limit: number; skip: number };
}

export interface RequestInventoryOrders extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_REQUEST_ORDER_HISTORY;
  payload: { inventoryOrders: InventoryOrder[]; count: number };
}

export interface RequestFilteredInventoryOrders extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_ORDER_HISTORY;
  payload: { filterBy: string; limit: number; skip: number };
}

export interface CreateProductAndOffer extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_AND_OFFER_CREATE;
  payload: { mproduct: Product; moffer: Offer | null; requestoffer: boolean };
}
export interface RequestCreateOffer extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFER_CREATE_REQUEST;
  payload: { offer: Offer };
}
export interface RequestCreateProducts extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_CREATE_REQUEST;
  payload: { products: Product[] };
}
export interface RequestUpdateProduct extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_UPDATE_REQUEST;
  payload: { product: Product };
}

export interface SetOffers extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_SET;
  payload: { offers: Offer[]; count: number };
}

export interface RequestEditOffers extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_EDIT;
  payload: { offer: Offer };
}
export interface SetNickNameSuccess extends Action {
  type: MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_SUCCESS;
  payload: boolean;
}

export interface RequestMerchantTransactionHistory extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_HISTORY_REQUEST;
}

export interface RequestMerchantTransactions extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_REQUEST;
}

export interface SetMerchantBoomAccount extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_BOOM_ACCOUNT_SET;
  payload: BoomAccount;
}
export interface RequestMerchantBoomAccount extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_BOOM_ACCOUNT_REQUEST;
}

export interface SetMerchantTransactionHistory extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_HISTORY_SET;
  payload: Transaction[];
}

export interface SetMerchantTransactions extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTIONS_SET;
  payload: Transaction[];
}

export interface AddTaxableStates extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TAXABLE_STATES_SET;
  payload: { states: { state: string; country: string }[] };
}

export interface RequestMerchantTransactions extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_REQUEST;
  payload: {
    type: TransactionType;
    filter?: any;
    limitTo?: number;
  };
}

export interface SetProducts extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_SET;
  payload: { products: Product[]; count: number };
}

export interface RequestStore extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_REQUEST;
}

export interface SetStore extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_SET;
  payload: Store;
}

export interface RequestUpdateStore extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_UPDATE_REQUEST;
  payload: { store: Store; id: string };
}

export interface SetMerchantImage extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_IMAGE_SET;
  payload: { imageUrl: string };
}
export interface RequestCreateStore extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_CREATE_REQUEST;
  payload: AllOptionalExceptFor<BoomUser, 'uid'>;
}

export interface DeleteProduct extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_DEL;
  payload: { id: string };
}

export interface DeleteOffer extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFER_DEL;
  payload: { id: string };
}

export interface RequestInventory extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_INVENTORY_REQUEST;
}

export interface SetInventory extends Action {
  type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_INVENTORY_SET;
  payload: InventoryItem[];
}

export interface UpdateDeviceNickName extends Action {
  type: MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_REQUEST;
  payload: { nickname: string; id: string };
}

export const requestOffers = (): RequestOffers => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_REQUEST,
  };
};

export const requestEditOffers = (offer: Offer): RequestEditOffers => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_EDIT,
    payload: { offer },
  };
};

export const requestFilteredOffers = (
  filterBy: string,
  limit: number,
  skip: number
): RequestFilteredOffers => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_OFFERS_REQUEST,
    payload: { filterBy, limit, skip },
  };
};

export const requestProducts = (): RequestProducts => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_REQUEST,
  };
};

export const requestFilteredProducts = (
  filterBy: string,
  limit: number,
  skip: number
): RequestFilteredProducts => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_PRODUCTS_REQUEST,
    payload: { filterBy, limit, skip },
  };
};

export const requestInventoryOrders = (
  inventoryOrders: InventoryOrder[],
  count: number
): RequestInventoryOrders => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_REQUEST_ORDER_HISTORY,
    payload: { inventoryOrders, count },
  };
};

export const requestFilteredInventoryOrders = (
  filterBy: string,
  limit: number,
  skip: number
): RequestFilteredInventoryOrders => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_ORDER_HISTORY,
    payload: { filterBy, limit, skip },
  };
};

export const requestMerchantTransactionHistory = (): RequestMerchantTransactionHistory => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_HISTORY_REQUEST,
  };
};

export const setMerchantTransactionHistory = (
  transactions: Transaction[]
): SetMerchantTransactionHistory => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_HISTORY_SET,
    payload: transactions,
  };
};

export const setMerchantBoomAccount = (boomAccount: BoomAccount): SetMerchantBoomAccount => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_BOOM_ACCOUNT_SET,
    payload: boomAccount,
  };
};

export const requestMerchantBoomAccount = (): RequestMerchantBoomAccount => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_BOOM_ACCOUNT_REQUEST,
  };
};

export const setMerchantTransactions = (transactions: Transaction[]): SetMerchantTransactions => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTIONS_SET,
    payload: transactions,
  };
};

export const requestMerchantTransactions = (
  type: TransactionType,
  filter?: any,
  limitTo?: number
): RequestMerchantTransactions => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_REQUEST,
    payload: { type, filter, limitTo },
  };
};

export const setProducts = (products: Product[], count: number): SetProducts => {
  console.log(products);
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_SET,
    payload: { products, count },
  };
};

export const setOffers = (offers: Offer[], count: number): SetOffers => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_SET,
    payload: { offers, count },
  };
};

export const setNickNameSuccess = (isNickNameUpdated: boolean): SetNickNameSuccess => {
  return {
    type: MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_SUCCESS,
    payload: isNickNameUpdated,
  };
};

export const requestStore = (): RequestStore => {
  return { type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_REQUEST };
};

export const setStore = (store: Store): SetStore => {
  return { type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_SET, payload: store };
};

export const requestUpdateStore = (store: Store, id: string): RequestUpdateStore => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_UPDATE_REQUEST,
    payload: { store, id },
  };
};

export const createProductAndOffer = (
  mproduct: Product,
  moffer: Offer | null,
  requestoffer = false
): CreateProductAndOffer => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_AND_OFFER_CREATE,
    payload: { mproduct, moffer, requestoffer },
  };
};

export const requestCreateProducts = (products: Product[]): RequestCreateProducts => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_CREATE_REQUEST,
    payload: { products },
  };
};

export const requestUpdateProduct = (product: Product): RequestUpdateProduct => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_UPDATE_REQUEST,
    payload: { product },
  };
};

export const requestCreateOffer = (offer: Offer): RequestCreateOffer => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFER_CREATE_REQUEST,
    payload: { offer },
  };
};

export const requestCreateStore = (
  user: AllOptionalExceptFor<BoomUser, 'uid'>
): RequestCreateStore => {
  return { type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_CREATE_REQUEST, payload: user };
};

export const deleteProduct = (id: string): DeleteProduct => {
  return { type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_DEL, payload: { id } };
};

export const deleteOffer = (id: string): DeleteOffer => {
  return { type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFER_DEL, payload: { id } };
};

export const requestInventory = (): RequestInventory => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_INVENTORY_REQUEST,
  };
};

export const setInventory = (inventory: InventoryItem[]): SetInventory => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_INVENTORY_SET,
    payload: inventory,
  };
};
export const addTaxableStates = (
  states: { state: string; country: string }[]
): AddTaxableStates => {
  return {
    type: MerchantAccountActionTypes.ACCOUNT_MERCHANT_TAXABLE_STATES_SET,
    payload: { states },
  };
};

export const updateDeviceNickName = (nickname: string, id: string): UpdateDeviceNickName => {
  return {
    type: MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_REQUEST,
    payload: { nickname: nickname, id: id },
  };
};
