import getConfig from 'next/config';
const config = getConfig();
export const FIREBASE_CLIENT_CONFIG: object = config.publicRuntimeConfig.FIREBASE_CLIENT_CONFIG;

export const API_URL: string = config.publicRuntimeConfig.API_URL;

export const DEFAULT_INIT_URL_FOR_MERCHANTS: string = '/account/merchant/products';
export const DEFAULT_INIT_URL_FOR_CUSTOMERS: string = '/account/customer/transactions';

export enum FormNames {
  FORM_NAME_EMAIL_PASSWORD_PHONE = 'form-email-password-phone',
  FORM_PHONE = 'form-phone',
  FORM_SIGNUP_SOCIAL_MEDIA = 'form-signup-phone-social-media',
  FORM_SEND_FUNDS = 'form-send-funds',
  FORM_MERCHANT_SETTINGS = 'form-merchant-settings',
  FORM_MERCHANT_IMAGE_UPLOAD = 'from-merchant-image-upload',
}
export enum LocalStorageKeys {
  LOCAL_STORAGE_KEY_AUTH = 'authState',
}
export enum ToastTypes {
  SUCCESS = 'success',
  ERROR = 'danger',
  RETRY = 'warning',
}

export enum AuthVerificationStatus {
  INACTIVE = 'inactive',
  NEEDS_PHONE_SIGN_UP_OR_SIGN_IN = 'needs-phone-sign-up-or-sign-in',
  NEEDS_PHONE_AND_SOCIAL_SIGN_UP = 'needs-phone-and-social-sign-up',
  NEEDS_PHONE_AND_EMAIL_SIGN_UP = 'needs-phone-and-email-sign-up',
  NEEDS_PHONE_AND_ADDITIONAL_SIGN_UP = 'needs-phone-and-additional-sign-up',
  NEEDS_INVOCATION_FROM_USER = 'needs-invocation-from-user',
  PENDING_VERIFICATION_RESULT = 'pending-verification-result',
  NEEDS_PHONE_VERIFICATION = 'needs-phone-verification',
}

export enum LayoutTabs {
  TAB_MERCHANT_INVENTORY = 'MERCHANT-INVENTORY',
  TAB_MERCHANT_PROFILE = 'MERCHANT-PROFILE',
  TAB_MERCHANT_OFFERS = 'MERCHANT-OFFERS',
  TAB_MERCHANT_PRODUCTS = 'MERCHANT-PRODUCTS',
  TAB_MERCHANT_SETTINGS = 'MERCHANT-SETTINGS',
  TAB_MERCHANT_WITHDRAWALS = 'MERCHANT-WITHDRAWALS',
  TAB_MERCHANT_TRANSACTIONS = 'MERCHANT-TRANSACTIONS',

  TAB_ANALYTICS = 'ANALYTICS',
  TAB_OFFERS = 'OFFERS',
  TAB_CUSTOMERS = 'CUSTOMERS',
  TAB_FUNDING = 'FUNDING',
  TAB_INVENTORY = 'INVENTORY',
  TAB_MARKETING = 'MARKETING',
  TAB_REVIEWS = 'REVIEWS',
  TAB_SETTINGS = 'SETTINGS',
  TAB_TRANSACTIONS = 'TRANSACTIONS',
  TAB_RETURNS_AND_ORDERS = 'RETURNS & ORDERS',
}

export enum PopperPlacement {
  AUTO = 'auto',
  AUTO_START = 'auto-start',
  AUTO_END = 'auto-end',
  TOP = 'top',
  TOP_START = 'top-start',
  TOP_END = 'top-end',
  BOTTOM = 'bottom',
  BOTTOM_START = 'bottom-start',
  BOTTOM_END = 'bottom-end',
  RIGHT = 'right',
  RIGHT_START = 'right-start',
  RIGHT_END = 'right-end',
  LEFT = 'left',
  LEFT_START = 'left-start',
  LEFT_END = 'left-end',
}

export * from './admin-config';

export enum DefaultCoords {
  LAT = 26.7492,
  LNG = -80.0725,
}
export const defaultSearchDistance = 300;
