import {
  AllOptionalExceptFor,
  Booking,
  BookingStatus,
  BoomAccount,
  BoomCard,
  BoomUser,
  getComposedAddressFromStore,
  isOffer,
  isProduct,
  Money,
  Product,
  RoleKey,
} from '@boom-platform/globals';
import _ from 'lodash';
import { call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { ToastTypes } from '../../constants';
import { Tax } from '../../models/tax.model';
import { ToastRequest } from '../../models/toast-request.model';
import { get, patch, post, remove } from '../../utils/api';
import { ERRORS } from '../../utils/tempLocation';
import * as accountMemberActions from '../actions/account-member';
import * as appActions from '../actions/app';
import * as errorActions from '../actions/errors';
import * as taxActionTypes from '../actions/tax';
import { MemberAccountActionTypes } from '../actionTypes';
import { AccountMemberState } from '../reducers/app';
import { getAuthState, getMemberAccount } from '../selectors';

export function* getTransactionHistory(action: accountMemberActions.RequestTransactionHistory) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const filters = {
      where: {
        and: [
          {
            'sender.uid': user.uid,
          },
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
    yield put(accountMemberActions.setTransactionHistory(result.data));
  } catch (error: any) {
    console.error(error);
    yield put(errorActions.setAPIError(error.toString()));
  }
}
export function* getOrderHistory(action: accountMemberActions.RequestOrderHistory) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const filters = {
      where: {
        and: [
          {
            customerUID: user.uid,
          },
          ...(action.payload.filter ? [action.payload.filter] : []),
        ],
      },
      ...(action.payload.limitTo ? { limit: action.payload.limitTo } : {}),
      order: ['createdAt DESC'],
    };
    const result = yield call(
      get,
      `/orders`,
      {
        params: {
          filter: filters,
        },
      },
      jwt
    );
    yield put(accountMemberActions.setOrderHistory(result.data.data));
  } catch (error: any) {
    console.error(error);
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* getBookings(action: accountMemberActions.RequestBookings) {
  try {
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } =
      yield select(getAuthState);
    const result = yield call(
      get,
      `/bookings/?filter[where][memberUID]=${user.uid}`,
      undefined,
      jwt
    );
    yield put(
      accountMemberActions.setBookings(
        result.data.data.filter((curBooking) => curBooking.status !== BookingStatus.USED)
      )
    );

    const payload: any = [];
    const fromAddress: Record<string, unknown> = {};

    result.data.data.map(function (booking: Booking) {
      const item = booking.item;
      let price;
      let productId;
      if (isOffer(item) && item.product) {
        if (item.product.store) {
          fromAddress['address'] = getComposedAddressFromStore(item.product.store); // TODO: Check if this is correct
          fromAddress['city'] = item.product.store.city;
          fromAddress['state'] = item.product.store.state;
          fromAddress['zip'] = item.product.store.zip;
          fromAddress['country'] = item.product.store.country;
        }
        price = item.product.price;
        productId = item.product._id;
      } else if (isProduct(item) && item.store) {
        fromAddress['address'] = getComposedAddressFromStore(item.store); // TODO: Check if this is correct
        fromAddress['city'] = item.store?.city;
        fromAddress['state'] = item.store?.state;
        fromAddress['zip'] = item.store?.zip;
        fromAddress['country'] = item.store?.country;
        price = item.price;
        productId = item._id;
      } else {
        throw new Error(ERRORS.ITEM_IS_NEITHER_OFFER_OR_PRODUCT);
      }

      const contactInfo: any = user.contact;

      payload.push({
        id: productId,
        fromAddress: fromAddress,
        toAddress: {
          address: getComposedAddressFromStore(contactInfo.store), // TODO: Check if this is correct
          city: contactInfo.city,
          state: contactInfo.state,
          zip: contactInfo.zip,
          country: contactInfo.country,
        },
        amount: price,
      });
    });

    yield call(getTaxForAmounts, payload);
  } catch (error: any) {
    console.error(error);
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* addBookings(action: accountMemberActions.AddBookings) {
  const booking = action.payload; //TODO: Review the interface used for bookings interface it should match what the data on the controller is waiting for

  try {
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } =
      yield select(getAuthState);
    if (user.roles && user.roles.includes(RoleKey.Member)) {
      const result = yield call(post, `/bookings`, [booking], {}, jwt);
      yield put(accountMemberActions.requestBookings());
      const heading = 'Success';
      const body = 'Booking is successful';
      const type: ToastTypes = ToastTypes.SUCCESS;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    } else {
      const heading = 'Oops';
      const body = 'Only customer accounts can book items!';
      const type: ToastTypes = ToastTypes.RETRY;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* getTaxForAmounts(
  payload: {
    id: string;
    fromAddress: {
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    toAddress: {
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    amount: Money;
  }[]
) {
  try {
    const { jwt, user }: { jwt: string; user: AllOptionalExceptFor<BoomUser, 'uid'> } =
      yield select(getAuthState);
    const result = yield call(
      post,
      `/getTaxableProduct`,
      JSON.parse(JSON.stringify(payload)),
      undefined,
      jwt
    );
    const data: Tax[] = result.data;

    yield put(taxActionTypes.setTotalTax(data));
  } catch (error: any) {
    console.error(error);
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* deleteBooking(action: accountMemberActions.DeleteBooking) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    yield call(remove, `/bookings/` + action.payload, undefined, jwt);
    yield put(accountMemberActions.requestBookings());
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* requestBoomCardDetails(action: accountMemberActions.RequestBoomCardDetails) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const boomCardId: string | null =
      !_.isEmpty(user) && !_.isEmpty(user.cards) ? user.cards![0] : null;
    if (boomCardId) {
      const result = yield call(
        get,
        `/boom-cards`,
        { params: { '[filter][where][_id]': `${boomCardId}` } },
        jwt
      );
      const data: BoomCard[] = result.data;
      yield put(accountMemberActions.setBoomCardDetails(data[0]));
    } else {
      console.log(
        'Did not find a boomcard id from the user profile to retrieve the boomcard details'
      );
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* updateBoomCardDetails(action: accountMemberActions.UpdateBoomCardDetails) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const { boomCard }: AccountMemberState = yield select(getMemberAccount);

    const boomCardId: string | null = user?.cards?.[0] || null;

    if (boomCardId) {
      yield call(patch, `/boom-cards/${boomCardId}`, action.payload, undefined, jwt);

      yield put(
        accountMemberActions.setBoomCardDetails({ ...boomCard, ...action.payload } as BoomCard)
      );

      const heading = 'Success';
      const body = 'Profile updated successfully';
      const type: ToastTypes = ToastTypes.SUCCESS;

      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* checkoutBookings(action: accountMemberActions.CheckoutBookings) {
  try {
    const { jwt }: { jwt: string } = yield select(getAuthState);
    const result = (yield call(post, `/checkout`, action.payload, {}, jwt)).data;

    const checkedOutCount = result.checkout ? result.checkout.length : 0,
      failedCount = result.failed ? result.failed.length : 0,
      expiredCount = result.expired ? result.expired.length : 0;

    if (!failedCount && !expiredCount) {
      const heading = 'Success';
      const body = 'All bookings was successfully checked out';
      const type: ToastTypes = ToastTypes.SUCCESS;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    } else {
      const heading = 'Success';
      const body: string =
        '' +
        (checkedOutCount > 0 ? `${checkedOutCount} bookings was successfully checked out` : '') +
        (failedCount > 0 ? `${failedCount} bookings was failed. ${result.failed[0].reason}` : '') +
        (expiredCount > 0
          ? `${expiredCount} bookings was expired. ${result.failed[0].reason}`
          : '');

      const type: ToastTypes = ToastTypes.ERROR;
      yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
    }
    yield put(accountMemberActions.requestBookings());
  } catch (error: any) {
    const heading = 'Error';
    const body: string = error.toString();
    const type: ToastTypes = ToastTypes.ERROR;
    yield put(appActions.setGlobalToast({ heading, body, type } as ToastRequest));
  }
}

export function* getFundsDetails(action: accountMemberActions.RequestFundsDetails) {
  try {
    const { user, jwt }: { user: AllOptionalExceptFor<BoomUser, 'uid'>; jwt: string } =
      yield select(getAuthState);
    const boomAccountID: string | null =
      !_.isEmpty(user) && !_.isEmpty(user.boomAccounts) ? user.boomAccounts![0] : null;
    if (boomAccountID) {
      const result = yield call(get, `/boom-account/${boomAccountID}`, undefined, jwt);
      if (result.data && result.data.success) {
        const userBoomAccount: BoomAccount = result.data.data;
        const funds: Money = userBoomAccount.balance
          ? userBoomAccount.balance
          : ({ amount: 0 } as Money);
        yield put(accountMemberActions.setFundsDetails(funds));
      }
    } else {
      yield put(accountMemberActions.setFundsDetails({ amount: 0 } as Money));
    }
  } catch (error: any) {
    console.error(error);
    yield put(errorActions.setAPIError(error.toString()));
  }
}

export function* watchInitializationRequest() {
  yield takeLatest(MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_REQUEST, getBookings);
  yield takeEvery(MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKING_DELETE_REQUEST, deleteBooking);
  yield takeEvery(
    MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_CHECKOUT_REQUEST,
    checkoutBookings
  );
  yield takeLatest(
    MemberAccountActionTypes.ACCOUNT_MEMBER_TRANSACTION_HISTORY_REQUEST,
    getTransactionHistory
  );
  yield takeLatest(MemberAccountActionTypes.ACCOUNT_MEMBER_ORDER_HISTORY_REQUEST, getOrderHistory);
  yield takeLatest(MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_DETAILS_REQUEST, getFundsDetails);
  yield takeLatest(
    MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_REQUEST,
    requestBoomCardDetails
  );
  yield takeEvery(
    MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_UPDATE,
    updateBoomCardDetails
  );
  yield takeLatest(MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_ADD_REQUEST, addBookings);
}

export default function* root() {
  yield fork(watchInitializationRequest);
}
