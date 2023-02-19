import { Offer, RoleKey, Transaction } from '@boom-platform/globals';
import _ from 'lodash';
import { createSelector } from 'reselect';

import { ProductHit } from '../../models/product-hit.model';
import { AppState } from '../reducers';
import { AccountMemberState, AppState as AppReducerState, AuthState } from '../reducers/app';

export const getAuthState = (state: AppState): AuthState => state.auth;
export const getAppState = (state: AppState): AppReducerState => state.app;
export const getMemberAccount = (state: AppState): AccountMemberState => state.accountMember;

export const getIsMerchant = createSelector(getAuthState, (state: AuthState) =>
  state.user ? state.user.roles && state.user.roles.includes(RoleKey.Merchant) : false
);
export const getIsRegistered = createSelector(getAuthState, (state: AuthState) =>
  state.user ? (state.user.registrationStep === 6 ? true : false) : false
);
export const getRegistrationStep = createSelector(getAuthState, (state: AuthState) =>
  state.user ? (state.user.registrationStep === 6 ? true : false) : false
);
export const getTransaction = (state: AppState, id: string | undefined) => {
  return state.transactions.transactions && id
    ? state.transactions.transactions.find((transaction: Transaction) => transaction._id === id)
    : null;
};

export const getStoreOffers = createSelector(
  (state: AppState, type: string | '') =>
    state[type].storeOffers ? state[type].storeOffers : ([] as Offer[]),
  (offers) =>
    offers
      .map((item: Offer) => {
        return {
          _id: item.product._id,
          categoryName: item.product.category?.name,
          subCategoryName: item.product.category?.subCategories
            ? item.product.category.subCategories.join(',')
            : [''],
          hasOffer: true,
          item: item,
          price: item.product.price,
          _geoloc: item.product ? item.product.store?._geoloc : {},
          name: item.title,
          imageUrl: item.product.imageUrl,
          merchantUID: item.product.merchantUID,
          category: {
            name: item.product.category?.name,
          },
          store: item.product.store,
        } as ProductHit;
      })
      .filter((product) => product !== null)
);

export const getInventoryOrders = (state: AppState) => state.order.inventoryOrders;
