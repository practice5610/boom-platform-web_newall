import {
  AllOptionalExceptFor,
  APIResponse,
  BoomUser,
  Offer,
  Product,
  ShippingBox,
  ShippingPolicy,
  Store,
} from '@boom-platform/globals';
import moment from 'moment';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { ToastTypes } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { del, get, patch, post, put as putRequest } from '../../utils/api';
import * as accountMerchantActions from '../actions/account-merchant';
import * as appActions from '../actions/app';
import * as authActions from '../actions/auth';
import * as errorActions from '../actions/errors';
import * as shippingActions from '../actions/shipping';
import { MerchantAccountActionTypes, ShippingActionTypes } from '../actionTypes';
import { getAuthState } from '../selectors';
import { requestInventoryOrders } from './order';

export function* getTransactionHistory(
  action: accountMerchantActions.RequestMerchantTransactionHistory
) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/transactions`,
      { params: { '[filter][where][merchant._id]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(accountMerchantActions.setMerchantTransactionHistory(result.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* addTaxableState(action: accountMerchantActions.AddTaxableStates) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(putRequest, `/setTaxableStates`, action.payload.states, {}, jwt);
    const heading: string = 'Success';
    const body: string = 'Taxable states updated successfully.';
    const type: ToastTypes = ToastTypes.SUCCESS;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  } catch (error) {
    yield put(appActions.setErrorGlobalToast('Failed to update taxable state.', 'Error'));
  }
}

export function* getTransactionForMerchant(
  action: accountMerchantActions.RequestMerchantTransactions
) {
  try {
    const { jwt }: { user: BoomUser; jwt: string } = yield select(getAuthState);
    const filters = {
      where: {
        and: [
          {
            type: action.payload.type,
          },
          ...(action.payload.filter ? [action.payload.filter] : []),
        ],
      },
      ...(action.payload.limitTo ? { limit: action.payload.limitTo } : {}),
      order: ['createdAt DESC'],
    };
    const result = yield call(
      get,
      `/transactions`,
      {
        params: {
          filter: filters,
        },
      },
      jwt
    );
    yield put(accountMerchantActions.setMerchantTransactions(result.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getProducts(action: accountMerchantActions.RequestProducts) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/products`,
      { params: { '[filter][where][merchantUID]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(accountMerchantActions.setProducts(result.data, result.data.length));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getFilteredProducts(action: accountMerchantActions.RequestFilteredProducts) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const searchFilters = action.payload.filterBy;
    const limit = action.payload.limit;
    const skip = action.payload.skip;
    const filter = {
      where: {
        and: [
          {
            merchantUID: `${user ? user.uid : null}`,
          },
        ],
        or: [
          { name: { like: `.*${searchFilters}.*`, options: 'i' } },
          { 'category.name': { like: `.*${searchFilters}.*`, options: 'i' } },
          { 'price.amount': { like: `.*${searchFilters}.*`, options: 'i' } },
          { quantity: { like: `.*${searchFilters}.*`, options: 'i' } },
          { status: { like: `.*${searchFilters}.*`, options: 'i' } },
        ],
      },
      order: ['createdAt DESC'],
      limit: limit,
      skip: skip,
    };
    const result = yield call(get, `/products`, { params: { filter } }, jwt);
    const countResult = yield call(get, `/products/count`, { params: filter }, jwt);
    yield put(accountMerchantActions.setProducts(result.data, countResult.data.count));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getOffers(action: accountMerchantActions.RequestOffers) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/offers`,
      { params: { '[filter][where][merchantUID]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(accountMerchantActions.setOffers(result.data, result.data.length));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getFilteredOffers(action: accountMerchantActions.RequestFilteredOffers) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const searchFilters = action.payload.filterBy;
    const limit = action.payload.limit;
    const skip = action.payload.skip;
    const filter = {
      where: {
        and: [
          {
            merchantUID: `${user ? user.uid : null}`,
          },
        ],
        or: [
          { title: { like: `.*${searchFilters}.*`, options: 'i' } },
          { 'product.category.name': { like: `.*${searchFilters}.*`, options: 'i' } },
          { maxVisits: { like: `.*${searchFilters}.*`, options: 'i' } },
          { 'product.price.amount': { like: `.*${searchFilters}.*`, options: 'i' } },
          { 'product.cashBackPerVisit.amount': { like: `.*${searchFilters}.*`, options: 'i' } },
        ],
      },
      order: ['createdAt DESC'],
      limit: limit,
      skip: skip,
    };
    const result = yield call(get, `/offers`, { params: { filter } }, jwt);
    const countResult = yield call(get, `/offers/count`, { params: filter }, jwt);
    yield put(accountMerchantActions.setOffers(result.data, countResult.data.count));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getInventoryOrders(action: accountMerchantActions.RequestInventoryOrders) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/inventory-orders`,
      { params: { '[filter][where][merchant.uid]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(accountMerchantActions.requestInventoryOrders(result.data, result.data.length));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getFilteredInventoryOrders(action: accountMerchantActions.RequestFilteredOffers) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const searchFilters = action.payload.filterBy;
    const limit = action.payload.limit;
    const skip = action.payload.skip;
    const filter = {
      where: {
        and: [
          {
            'merchant.uid': `${user ? user.uid : null}`,
          },
        ],
        or: [
          { _id: { like: `.*${searchFilters}.*`, options: 'i' } },
          { createdAt: { like: `.*${searchFilters}.*`, options: 'i' } },
          { maxVisits: { like: `.*${searchFilters}.*`, options: 'i' } },
          { amount: { like: `.*${searchFilters}.*`, options: 'i' } },
        ],
      },
      order: ['createdAt DESC'],
      limit: limit,
      skip: skip,
    };
    const result = yield call(get, `/inventory-orders`, { params: { filter } }, jwt);
    const countResult = yield call(get, `/inventory-orders/count`, { params: filter }, jwt);
    yield put(accountMerchantActions.requestInventoryOrders(result.data, countResult.data.count));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* updateNickName(action: accountMerchantActions.UpdateDeviceNickName) {
  try {
    const { jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } = yield select(
      getAuthState
    );
    const result = yield call(
      patch,
      `/inventory/${action.payload.id}`,
      { nickname: action.payload.nickname },
      undefined,
      jwt
    );
    const heading = 'Success';
    const body = 'Nickname updated successfully.';
    const type: ToastTypes = ToastTypes.SUCCESS;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    yield put(accountMerchantActions.setNickNameSuccess(true));
  } catch (error) {
    const heading = 'Error';
    const body = 'Failed to update nickname.';
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* getStore(action: accountMerchantActions.RequestStore) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const id: string | undefined = user ? user.store!._id : '63eb7914c40b9503a27cc30e';
    const result = yield call(get, `/stores/${id}`, {}, jwt);
    const store = result.data;
    yield put(accountMerchantActions.setStore(store));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestUpdateStore(action: accountMerchantActions.RequestUpdateStore) {
  try {
    yield put(errorActions.clearError('apiError'));
    const store = action.payload.store;
    const id = action.payload.id;
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(putRequest, `/store/${id}`, store, { timeout: 60000 }, jwt);
    if (result.data.success) {
      const heading = 'Success';
      const body = 'Store is updated successfully.';
      const type: ToastTypes = ToastTypes.SUCCESS;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(accountMerchantActions.setStore(store));
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(errorActions.setAPIError(error.toString()));
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* createProductAndOffer(action) {
  console.log(action);
  const mproduct = action.payload.mproduct;
  const moffer = action.payload.moffer;

  if (mproduct.name.length === 0) return;

  try {
    const heading = 'Success';
    const type: ToastTypes = ToastTypes.SUCCESS;
    const { jwt, user }: { jwt: string; user } = yield select(getAuthState);

    if (mproduct._id === null || mproduct._id === undefined || mproduct._id === '') {
      const result = yield call(post, `/products`, [mproduct], {}, jwt);
      if (result.data.successful.length === 0 && result.data.failed.length)
        throw new Error(`product failed: ${result.data.failed[0].reason}`);
      else if (result.data.successful.length === 0) throw new Error(`product failed`);

      mproduct._id = result.data.successful[0]._id;
    }

    if (mproduct._id.length === 0) return;

    if (moffer === null) {
      const body = 'One Product was created successfully.';
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      return;
    }

    //For Offer
    const offerData = {
      createdAt: moment().unix,
      updatedAt: moment().unix,
      cashBackPerVisit: moffer.cashBackPerVisit,
      merchantUID: moffer.merchantUID,
      conditions: moffer.conditions,
      description: moffer.description,
      maxQuantity: moffer.maxQuantity ? moffer.maxQuantity : 0,
      maxVisits: moffer.maxVisits ? moffer.maxVisits : 0,
      startDate: moffer.startDate ? moffer.startDate : 0,
      expiration: moffer.expiration ? moffer.expiration : 0,
      title: moffer.title,
      product: {
        _id: mproduct._id,
        createdAt: moment().unix,
        updatedAt: moment().unix,
        imageUrl: mproduct.imageUrl,
        merchantUID: mproduct.merchantUID,
        category: mproduct.category,
        name: mproduct.name,
        description: mproduct.description,
        store: mproduct.store,
        price: mproduct.price,
        attributes: mproduct.attributes,
        _tags: mproduct._tags,
      },
    };

    const offerResult = yield call(post, `/offers`, offerData, {}, jwt);

    if (!offerResult.data.success) throw new Error(offerResult.data.message);

    const body = 'One Offer was created successfully.';

    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));

    if (action.payload.requestoffer === false) return;

    const offeresult = yield call(
      get,
      `/offers`,
      { params: { '[filter][where][merchantUID]': `${user ? user.uid : null}` } },
      jwt
    );

    yield put(accountMerchantActions.setOffers(offeresult.data, offeresult.data.length));
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* requestCreateStore(action) {
  const user = action.payload;
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const storeData: Store = {
      companyLogoUrl: user.store.companyLogoUrl ?? 'https://i.stack.imgur.com/y9DpT.jpg',
      coverImageUrl: user.store.coverImageUrl ?? 'https://i.stack.imgur.com/y9DpT.jpg',
      companyType: user.store.companyType,
      companyName: user.store.companyName,
      companyDescription: user.store.companyDescription,
      emails: user.contact.emails ?? [],
      links: user.store.links,
      phoneNumber: user.contact.phoneNumber,
      fein: user.store.fein,
      years: user.store.years,
      storeType: user.store.storeType,
      pin: user.store.pin,
      number: user.store.number, // TODO: Review if this change to address is correct - AddressInfo
      street1: user.store.street1,
      street2: user.store.street2,
      city: user.store.city,
      state: user.store.state,
      zip: user.store.zip,
      country: user.store.country,
      _tags: user.store._tags ?? [],
      _geoloc: { lat: user.store._geoloc.lat, lng: user.store._geoloc.lng },
      openingTime: 8,
      closingTime: 17,
      days: user.store.days,
      merchant: {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };

    const result = yield call(post, `/stores`, storeData, {}, jwt);

    //@ If user already have a store, post request return 200
    //@ but Data return {success: false, message: "This merchant already has a store.}".
    //@ This case could happen when the user go back on step form
    //@ Next conditional validation if store exists then update existing
    if (result.data._id === undefined || result.data._id === '' || result.data._id === null) {
      const getExistingStore = yield call(
        get,
        `/stores`,
        { params: { '[filter][where][merchant.uid]': `${user.uid}` } },
        jwt
      );

      user.store._id = getExistingStore.data[0]._id;

      const storeDataToUpdate: Store = {
        _id: `${user ? user.store._id : null}`,
        //objectID: getExistingStore.data[0].objectID,
        companyName: getExistingStore.data[0].companyName,
        number: user.contact.number,
        street1: user.contact.street1,
        street2: user.contact.street2,
        city: user.store.city,
        state: user.store.state,
        zip: user.store.zip,
        country: user.store.country,
        phoneNumber: user.contact.phoneNumber,
        _geoloc: { lat: user.store._geoloc.lat, lng: user.store._geoloc.lng },
        merchant: {
          uid: user.uid,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
      yield call(putRequest, `/store/${user.store._id}`, storeDataToUpdate, {}, jwt);
    } else {
      user.store._id = result.data._id;
    }

    yield put(authActions.requestProfileUpdate(user));
    yield put(authActions.setAuthStateChange(user, null, true, false));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestCreateOffer(action: accountMerchantActions.RequestCreateOffer) {
  const offer: Offer = action.payload.offer;
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(post, `/offers`, offer, {}, jwt);
    if (result.status == 200) {
      const heading = 'Success';
      const type: ToastTypes = ToastTypes.SUCCESS;
      const body = 'Offer Created.';
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(accountMerchantActions.requestOffers());
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* requestCreateProducts(action: accountMerchantActions.RequestCreateProducts) {
  const products: Product[] = action.payload.products;
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(post, `/products`, products, {}, jwt);
    if (result.status == 200) {
      const heading = 'Success';
      const type: ToastTypes = ToastTypes.SUCCESS;
      const body = 'Products Created.';
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* requestUpdateProduct(action: accountMerchantActions.RequestUpdateProduct) {
  const product: Product = action.payload.product;
  const { _id, ...updatedProduct } = product;
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = yield call(patch, `/products/${_id}`, updatedProduct, {}, jwt);
    if (result.status == 204) {
      const heading = 'Success';
      const type: ToastTypes = ToastTypes.SUCCESS;
      const body = 'Product Updated.';
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* delProduct(action: accountMerchantActions.DeleteProduct) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const id = action.payload.id;

    const result = yield call(del, `/products/${id}`, {}, jwt);
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* delOffer(action: accountMerchantActions.DeleteOffer) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const id = action.payload.id;
    const result = yield call(del, `/offers/${id}`, {}, jwt);
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* editOffer(action: accountMerchantActions.RequestEditOffers) {
  try {
    const offer: Offer = action.payload.offer;
    //window.location.reload();
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const id = action.payload.offer._id;
    const result = yield call(patch, `/offers/${id}`, offer, {}, jwt);
    if (result.status == 200) {
      const heading = 'Success';
      const body = 'Offer Updated';
      const type: ToastTypes = ToastTypes.ERROR;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* getInventory(action: accountMerchantActions.RequestInventory) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/inventory`,
      { params: { '[filter][where][merchant.uid]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(accountMerchantActions.setInventory(result.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* requestShippingPolicies() {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/shipping/policies`,
      { params: { '[filter][where][merchantId]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(shippingActions.setShippingPolicies(result.data.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* createShippingPolicy(action: shippingActions.SetPolicyDetailsType) {
  try {
    const policy: ShippingPolicy = action.payload.shippingPolicy;
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(post, `/shipping/policy`, policy, {}, jwt);
    if (result.status == 200) {
      const heading = 'Success';
      const type: ToastTypes = ToastTypes.SUCCESS;
      const body = 'Shipping policy created.';
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(shippingActions.requestShippingPolicies());
    }
    throw new Error(`Something goes wrong.`);
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* requestShippingBoxes() {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/shipping/box`,
      { params: { '[filter][where][merchantId]': `${user ? user.uid : null}` } },
      jwt
    );
    yield put(shippingActions.setShippingBoxes(result.data.data));
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}
export function* getMerchantBoomAccount() {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const id = user.boomAccounts?.[0];
    const result = yield call(get, `/boom-account/${id}`, {}, jwt);
    if (result.status == 200)
      yield put(accountMerchantActions.setMerchantBoomAccount(result.data.data));
    throw new Error(`Something goes wrong getting merchant boom account.`);
  } catch (error: any) {
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* createShippingBox(action: shippingActions.SetBoxDetailsType) {
  try {
    const box: ShippingBox = action.payload.shippingBox;
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const result = yield call(post, `/shipping/box`, box, {}, jwt);
    if (result.status == 200) {
      const heading = 'Success';
      const type: ToastTypes = ToastTypes.SUCCESS;
      const body = 'Shipping Box Created.';
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
      yield put(shippingActions.requestShippingBoxes());
    }
    throw new Error(`Something goes wrong.`);
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* watchInitializationRequest() {
  yield takeLatest(ShippingActionTypes.SHIPPING_BOX_DETAILS_SET, createShippingBox);
  yield takeLatest(ShippingActionTypes.SHIPPING_POLICY_DETAILS_SET, createShippingPolicy);
  yield takeLatest(ShippingActionTypes.SHIPPING_BOXES_REQUEST, requestShippingBoxes);
  yield takeLatest(ShippingActionTypes.SHIPPING_POLICIES_REQUEST, requestShippingPolicies);
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_TAXABLE_STATES_SET, addTaxableState);
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_REQUEST,
    getTransactionForMerchant
  );
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_REQUEST, getProducts);
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_PRODUCTS_REQUEST,
    getFilteredProducts
  );
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_HISTORY_REQUEST,
    getTransactionHistory
  );
  yield takeLatest(MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_REQUEST, updateNickName);
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_REQUEST, getOffers);
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_OFFERS_REQUEST,
    getFilteredOffers
  );
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_REQUEST, getStore);
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_UPDATE_REQUEST,
    requestUpdateStore
  );
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_AND_OFFER_CREATE,
    createProductAndOffer
  );
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_CREATE_REQUEST,
    requestCreateStore
  );

  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_CREATE_REQUEST,
    requestCreateProducts
  );
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_UPDATE_REQUEST,
    requestUpdateProduct
  );
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFER_CREATE_REQUEST,
    requestCreateOffer
  );
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCT_DEL, delProduct);
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFER_DEL, delOffer);
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_EDIT, editOffer);
  yield takeLatest(MerchantAccountActionTypes.ACCOUNT_MERCHANT_INVENTORY_REQUEST, getInventory);
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_BOOM_ACCOUNT_REQUEST,
    getMerchantBoomAccount
  );
  // yield takeLatest(
  //   MerchantAccountActionTypes.ACCOUNT_MERCHANT_REQUEST_ORDER_HISTORY,
  //   getInventoryOrders
  // );
  yield takeLatest(
    MerchantAccountActionTypes.ACCOUNT_MERCHANT_FILTERED_ORDER_HISTORY,
    getFilteredInventoryOrders
  );
}

export default function* root() {
  yield fork(watchInitializationRequest);
}
