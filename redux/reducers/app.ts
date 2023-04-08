import {
  AllOptionalExceptFor,
  Booking,
  BoomAccount,
  BoomCard,
  BoomUser,
  Category,
  Geolocation,
  InventoryItem,
  InventoryOrder,
  Money,
  Offer,
  Order,
  Product,
  Store,
  Transaction,
} from '@boom-platform/globals';
import { Reducer } from 'redux';

import { AuthVerificationStatus } from '../../constants';
import { ToastRequest } from '../../models/toast-request.model';
import { version } from '../../package.json';
import { AuthVerificationState } from '../../types/auth-verification';
import { AccountMemberActions } from '../actions/account-member';
import { AccountMerchantActions } from '../actions/account-merchant';
import { AppAction } from '../actions/app';
import { AuthAction } from '../actions/auth';
import { ErrorAction } from '../actions/errors';
import { SearchAction } from '../actions/search';
import {
  AppActionTypes,
  AuthActionTypes,
  CategoriesActionTypes,
  ErrorActionTypes,
  MemberAccountActionTypes,
  MerchantAccountActionTypes,
} from '../actionTypes';
export interface AppState {
  isInitialized: boolean;
  firebaseIsInitialized: boolean;
  geolocation: Geolocation | null;
  ipAddress: string | null;
  toast: ToastRequest | null;
  isShowingLoadingOverlay: boolean;
  appVersion: string;
}

const initState = {
  isInitialized: false,
  firebaseIsInitialized: false,
  geolocation: null,
  ipAddress: null,
  toast: null,
  isShowingLoadingOverlay: false,
  appVersion: `VERSION BoomCarding v1.${version} - Environment : ${process.env.NODE_ENV} - Facebook : ${process.env.FB_ENV}`, // alternative process.env.npm_package_version
};

export const app: Reducer<AppState, AppAction> = (state = initState, action) => {
  switch (action.type) {
    case AppActionTypes.APP_INITIALIZED_SET: {
      return {
        ...state,
        isInitialized: true,
      };
    }
    case AppActionTypes.APP_LOADING_OVERLAY_SET: {
      return {
        ...state,
        isShowingLoadingOverlay: action.payload,
      };
    }
    case AppActionTypes.FIREBASE_INITIALIZED_SET: {
      return {
        ...state,
        firebaseIsInitialized: true,
      };
    }
    case AppActionTypes.APP_GELOCATION_SET: {
      return {
        ...state,
        geolocation: action.payload,
      };
    }
    case AppActionTypes.APP_IP_SET: {
      return {
        ...state,
        ipAddress: action.payload,
      };
    }
    case AppActionTypes.APP_TOAST_SET: {
      return {
        ...state,
        toast: action.payload,
      };
    }
  }
  return state;
};

export interface AuthState {
  user: AllOptionalExceptFor<BoomUser, 'uid'> | null;
  isUserSignedIn: boolean;
  jwt: string | null;
  authVerificationState: AuthVerificationState;
}

const initAuthState = {
  user: null,
  isUserSignedIn: false,
  jwt: null,
  authVerificationState: { status: AuthVerificationStatus.INACTIVE, context: null },
};

export const auth: Reducer<AuthState, AuthAction> = (state = initAuthState, action) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_LOGOUT_REQUEST: {
      return { ...initAuthState };
    }
    case AuthActionTypes.AUTH_STATE_CHANGE_SET: {
      const currentUser: AllOptionalExceptFor<BoomUser, 'uid'> | null = state.user
        ? state.user
        : null;
      const replace: boolean = action.payload.replace;
      const incomingUser: AllOptionalExceptFor<BoomUser, 'uid'> | null = action.payload.user;
      const jwt: string | null = action.payload.keepJwt ? state.jwt : action.payload.jwt;

      if (replace) {
        return {
          ...state,
          user: incomingUser as AllOptionalExceptFor<BoomUser, 'uid'>,
          isUserSignedIn: !!incomingUser,
          jwt,
        };
      } else if (incomingUser && currentUser) {
        return {
          ...state,
          //user: _.merge({}, currentUser, incomingUser),
          user: { ...currentUser, ...incomingUser },
          isUserSignedIn: !!incomingUser,
          jwt,
        };
      }

      return state;
    }
    case AuthActionTypes.AUTH_VERIFICATION_STATE_SET: {
      const incomingState = action.payload;
      let incoming: AuthVerificationState = {} as AuthVerificationState;

      if (incomingState.status !== AuthVerificationStatus.INACTIVE) {
        //incoming = _.merge(incoming, state.authVerificationState, incomingState);
        incoming = { ...incoming, ...state.authVerificationState, ...incomingState };
      }

      return {
        ...state,
        authVerificationState: incoming,
      };
    }
  }
  return state;
};

export interface AccountMemberState {
  transactions: Transaction[] | null;
  orders: Order[] | null;
  bookings: Booking[] | null;
  selectedBookings: boolean[] | null;
  funds: Money | null;
  boomCard: BoomCard | null;
}

const initAccountState = {
  transactions: null,
  orders: null,
  bookings: null,
  selectedBookings: null,
  funds: null,
  boomCard: null,
};

export const accountMember: Reducer<AccountMemberState, AccountMemberActions> = (
  state = initAccountState,
  action
) => {
  switch (action.type) {
    case MemberAccountActionTypes.ACCOUNT_MEMBER_TRANSACTION_HISTORY_SET: {
      return { ...state, transactions: action.payload };
    }
    case MemberAccountActionTypes.ACCOUNT_MEMBER_ORDER_HISTORY_SET: {
      return { ...state, orders: action.payload };
    }
    case MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_SET: {
      console.log('checkinreducer', action, state);
      return { ...state, bookings: action.payload };
    }
    case MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKING_SELECT: {
      return { ...state, selectedBookings: action.payload };
    }
    case MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_DETAILS_SET: {
      return { ...state, funds: action.payload };
    }
    case MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_SET: {
      return { ...state, boomCard: action.payload };
    }
  }
  return state;
};

export interface AccountMerchantState {
  boomAccount: BoomAccount | null;
  transactions: Transaction[] | null;
  products: { products: Product[]; count: number } | null;
  offers: { offers: Offer[]; count: number } | null;
  inventoryOrders: { inventoryOrders: InventoryOrder[]; count: number } | null;
  store: Store | null;
  isStoreUpdated: boolean | false;
  inventory: InventoryItem[] | null;
  isNickNameUpdateRequest: boolean | null;
  isNickNameUpdateSuccess: boolean | null;
}

const initAccountMerchantState = {
  boomAccount: null,
  transactions: null,
  products: null,
  offers: null,
  inventoryOrders: null,
  store: null,
  isStoreUpdated: false,
  inventory: null,
  isNickNameUpdateRequest: null,
  isNickNameUpdateSuccess: null,
};

export const accountMerchant: Reducer<AccountMerchantState, AccountMerchantActions> = (
  state = initAccountMerchantState,
  action
) => {
  switch (action.type) {
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_BOOM_ACCOUNT_SET: {
      return { ...state, boomAccount: action.payload };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTION_HISTORY_SET: {
      return { ...state, transactions: action.payload };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_TRANSACTIONS_SET: {
      return { ...state, transactions: action.payload };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_PRODUCTS_SET: {
      return { ...state, products: action.payload };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_OFFERS_SET: {
      return { ...state, offers: action.payload };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_REQUEST_ORDER_HISTORY: {
      return { ...state, inventoryOrders: action.payload };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_UPDATE_REQUEST: {
      return { ...state, isStoreUpdated: false };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_STORE_SET: {
      return { ...state, store: action.payload, isStoreUpdated: true };
    }
    case MerchantAccountActionTypes.ACCOUNT_MERCHANT_INVENTORY_SET: {
      return { ...state, inventory: action.payload };
    }
    case MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_REQUEST: {
      return { ...state, isNickNameUpdateRequest: true };
    }
    case MerchantAccountActionTypes.UPDATE_DEVICE_NICKNAME_SUCCESS: {
      return { ...state, isNickNameUpdateSuccess: action.payload, isNickNameUpdateRequest: false };
    }
  }
  return state;
};

export interface PublicDataState {
  categories: Category[];
}

/**
 * Store here data which is available for public Access on the API (ratelimit could be disabled on these paths)
 */
export const publicData: Reducer<PublicDataState, SearchAction> = (
  state = { categories: [] },
  action
) => {
  switch (action.type) {
    case CategoriesActionTypes.CATEGORIES_SET: {
      return { ...state, categories: action.payload };
    }
  }
  return state;
};

export interface ErrorState {
  authError?: string | undefined;
  appInitError?: string | undefined;
  apiError?: string | undefined;
}

export const errors: Reducer<ErrorState, ErrorAction> = (state = {}, action) => {
  switch (action.type) {
    case ErrorActionTypes.ERROR_AUTH_SET:
      return { ...state, authError: action.payload };
    case ErrorActionTypes.ERROR_CLEAR:
      return { ...state, [action.payload]: undefined };
    case ErrorActionTypes.ERROR_CLEAR_ALL:
      return {};
    case ErrorActionTypes.ERROR_APP_INITIALIZE: {
      return {
        ...state,
        appInitError: action.payload,
      };
    }
    case ErrorActionTypes.ERROR_API_SET: {
      return { ...state, apiError: action.payload };
    }
  }
  return state;
};
