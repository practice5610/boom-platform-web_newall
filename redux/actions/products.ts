import { Product } from '@boom-platform/globals';
import { Action } from 'redux';

import { ProductActionTypes } from '../actionTypes';

export type ProductAction =
  | RequestProductDetailsAndStoreOffers
  | SetProductDetails
  | RequestGetAllProducts
  | SetAllProducts;

export interface RequestGetAllProducts extends Action {
  type: ProductActionTypes.GET_ALL_PRODUCT_REQUEST;
}

export interface RequestProductDetailsAndStoreOffers extends Action {
  type: ProductActionTypes.PRODUCT_DETAILS_AND_STORE_OFFERS_REQUEST;
  payload: { id: string };
}

export interface SetProductDetails extends Action {
  type: ProductActionTypes.PRODUCT_DETAILS_SET;
  payload: { product: Product | null; productStatus: string };
}

export interface SetAllProducts extends Action {
  type: ProductActionTypes.SET_ALL_PRODUCT_REQUEST;
  payload: { products: Product[]; count: number };
}

export const requestGetAllProducts = (): RequestGetAllProducts => {
  return {
    type: ProductActionTypes.GET_ALL_PRODUCT_REQUEST,
  };
};

export const requestProductDetailsAndStoreOffers = (
  id: string
): RequestProductDetailsAndStoreOffers => {
  return {
    type: ProductActionTypes.PRODUCT_DETAILS_AND_STORE_OFFERS_REQUEST,
    payload: { id },
  };
};

export const setProductDetails = (
  product: Product | null,
  productStatus: string
): SetProductDetails => {
  return {
    type: ProductActionTypes.PRODUCT_DETAILS_SET,
    payload: { product, productStatus },
  };
};

export const setAllProducts = (products: Product[], count: number): SetAllProducts => {
  return {
    type: ProductActionTypes.SET_ALL_PRODUCT_REQUEST,
    payload: { products, count },
  };
};
