import {
  Booking,
  BoomCard,
  BoomUser,
  Money,
  Order,
  Transaction,
  TransactionType,
} from '@boom-platform/globals';
import { Action } from 'redux';

import { MemberAccountActionTypes, PaymentProccesorActionTypes } from '../actionTypes';

export type AccountMemberActions =
  | RequestBookings
  | DeleteBooking
  | CheckoutBookings
  | SelectBooking
  | RequestTransactionHistory
  | SetTransactionHistory
  | RequestOrderHistory
  | SetOrderHistory
  | SetBookings
  | RequestBoomCardDetails
  | SetBoomCardDetails
  | UpdateBoomCardDetails
  | AddBookings
  | RequestFundsDetails
  | SetFundsDetails
  | RequestFundsAdd
  | RequestPaymentProcessorToken;

export interface RequestBookings extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_REQUEST;
}

export interface DeleteBooking extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKING_DELETE_REQUEST;
  payload: string;
}

export interface CheckoutBookings extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_CHECKOUT_REQUEST;
  payload: Booking[];
}

export interface SelectBooking extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKING_SELECT;
  payload: boolean[];
}

export interface RequestTransactionHistory extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_TRANSACTION_HISTORY_REQUEST;
  payload: {
    type: TransactionType;
    filter?: any;
    limitTo?: number;
  };
}

export interface SetTransactionHistory extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_TRANSACTION_HISTORY_SET;
  payload: Transaction[];
}

export interface RequestOrderHistory extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_ORDER_HISTORY_REQUEST;
  payload: {
    filter?: any;
    limitTo?: number;
  };
}

export interface SetOrderHistory extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_ORDER_HISTORY_SET;
  payload: Order[];
}

export interface SetBookings extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_SET;
  payload: Booking[];
}

export interface ChangeProfile extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_PROFILE_CHANGE_REQUEST;
  payload: BoomUser;
}

export interface RequestBoomCardDetails extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_REQUEST;
}

export interface SetBoomCardDetails extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_SET;
  payload: BoomCard;
}

export interface UpdateBoomCardDetails extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_UPDATE;
  payload: Partial<BoomCard>;
}

export interface AddBookings extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_ADD_REQUEST;
  payload: Booking;
}
export interface RequestFundsDetails extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_DETAILS_REQUEST;
}

export interface SetFundsDetails extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_DETAILS_SET;
  payload: Money;
}

export interface RequestFundsAdd extends Action {
  type: MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_ADD_REQUEST;
  payload: Money;
}

export interface RequestPaymentProcessorToken extends Action {
  type: PaymentProccesorActionTypes.PAYMENT_PROCESSOR_TOKEN_REQUEST;
}

export const requestPaymentProcessorToken = (): RequestPaymentProcessorToken => {
  return {
    type: PaymentProccesorActionTypes.PAYMENT_PROCESSOR_TOKEN_REQUEST,
  };
};

export const requestFundsAdd = (money: Money): RequestFundsAdd => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_ADD_REQUEST,
    payload: money,
  };
};

export const requestBoomCardDetails = (): RequestBoomCardDetails => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_REQUEST,
  };
};

export const setBoomCardDetails = (card: BoomCard): SetBoomCardDetails => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_SET,
    payload: card,
  };
};

export const updateBoomCardDetails = (card: Partial<BoomCard>): UpdateBoomCardDetails => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOMCARD_DETAILS_UPDATE,
    payload: card,
  };
};

export const requestFundsDetails = (): RequestFundsDetails => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_DETAILS_REQUEST,
  };
};

export const setFundsDetails = (funds: Money): SetFundsDetails => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_FUNDS_DETAILS_SET,
    payload: funds,
  };
};

export const requestBookings = (): RequestBookings => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_REQUEST,
  };
};

export const deleteBooking = (id: string): DeleteBooking => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKING_DELETE_REQUEST,
    payload: id,
  };
};

export const checkoutBookings = (selectedBookings: Booking[]): CheckoutBookings => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_CHECKOUT_REQUEST,
    payload: selectedBookings,
  };
};

export const selectBooking = (ids: boolean[]): SelectBooking => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKING_SELECT,
    payload: ids,
  };
};

export const requestTransactionHistory = (
  type: TransactionType,
  filter?: any,
  limitTo?: number
): RequestTransactionHistory => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_TRANSACTION_HISTORY_REQUEST,
    payload: { type, filter, limitTo },
  };
};

export const setTransactionHistory = (transactions: Transaction[]): SetTransactionHistory => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_TRANSACTION_HISTORY_SET,
    payload: transactions,
  };
};

export const requestOrderHistory = (filter?: any, limitTo?: number): RequestOrderHistory => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_ORDER_HISTORY_REQUEST,
    payload: { filter, limitTo },
  };
};

export const setOrderHistory = (orders: Order[]): SetOrderHistory => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_ORDER_HISTORY_SET,
    payload: orders,
  };
};

export const setBookings = (bookings: Booking[]): SetBookings => {
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_SET,
    payload: bookings,
  };
};

export const addBookings = (booking: Booking): AddBookings => {
  //TODO: Review the interface used for bookings interface it should match what the data on the controller is waiting for
  return {
    type: MemberAccountActionTypes.ACCOUNT_MEMBER_BOOKINGS_ADD_REQUEST,
    payload: booking,
  };
};
