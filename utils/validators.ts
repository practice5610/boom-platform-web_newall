import { EmailRegex } from '@boom-platform/globals';

import * as authActions from '../redux/actions/auth';

export function validatePhoneSignupRequest(
  action: authActions.RequestPhoneAuth | authActions.RequestPhoneAndAdditionalSignUp
): Error | void {
  const { phone, verifier } = action.payload;
  if (!phone || phone === '') {
    throw new Error('Phone is empty!');
  } else if (!verifier) {
    throw new Error('ReCaptcha verifier was not provided!');
  }
}
export function validateEMail(email: string) {
  return EmailRegex.test(email);
}
