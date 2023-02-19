import { RoleKey } from '@boom-platform/globals';
import firebase from 'firebase/app';

import { AuthVerificationStatus } from '../constants';

/**
 * Describes state data provided for customer phone registration, phone number verification,
 * and for linking additional auth options after phone auth has been created.
 *
 * This state is only used for customers, not merchants. Merchants are not required to do a phone account first.
 */
export interface AuthVerificationState {
  status: AuthVerificationStatus;
  phone?: string | null;
  /**
   * This comes from Firebase. It is the confirmation result returned after requesting phone verification
   */
  confirmationResult?: firebase.auth.ConfirmationResult | null;
  /**
   * If a provider is set, the app will link that provider to the existing phone account.
   */
  provider?: SocialAuthProvider | firebase.auth.EmailAuthProvider | null;
  /**
   * Provided only for email signup requests
   */
  email?: string | null;
  /**
   * Provided only for email signup requests
   */
  password?: string | null;
  roles?: RoleKey[] | null;
}

/**
 * Describes the data passed to the requestPhoneAndAdditionalSignUp action creator.
 * Since all customers must have a phone account first. This request allows
 * us to first create a phone account, and then route to the appropriate auth option the user chose.
 */
export interface PhoneAndAdditionalSignUpRequestPayload {
  provider: SocialAuthProvider | firebase.auth.EmailAuthProvider;
  phone: string;
  roles: RoleKey[];
  verifier?: firebase.auth.RecaptchaVerifier;
  email?: string;
  password?: string;
}

export type SocialAuthProvider =
  | firebase.auth.FacebookAuthProvider
  | firebase.auth.GoogleAuthProvider
  | firebase.auth.TwitterAuthProvider;
