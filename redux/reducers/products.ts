import { Product } from '@boom-platform/globals';
import { Reducer } from 'redux';

import { ProductAction } from '../actions/products';
import { ProductActionTypes } from '../actionTypes';

export interface ProductsState {
  products: { products: Product[]; count: number } | null;
  productDetails: Product | null;
  productStatus: string | '';
}

const initState = {
  products: null,
  productDetails: null,
  productStatus: 'loading',
};

export const products: Reducer<ProductsState, ProductAction> = (state = initState, action) => {
  switch (action.type) {
    case ProductActionTypes.GET_ALL_PRODUCT_REQUEST: {
      return {
        ...state,
      };
    }
    case ProductActionTypes.PRODUCT_DETAILS_AND_STORE_OFFERS_REQUEST: {
      return {
        ...state,
        productStatus: 'loading',
      };
    }
    case ProductActionTypes.PRODUCT_DETAILS_SET: {
      return {
        ...state,
        productDetails: action.payload.product,
        productStatus: action.payload.productStatus,
      };
    }
    case ProductActionTypes.SET_ALL_PRODUCT_REQUEST: {
      return { ...state, products: action.payload };
    }
  }
  return state;
};
