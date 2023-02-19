import { isValidNumber, NationalNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Formats a phone number so that it can be used by Firebase for phone based auth.
 * @param phone Should be a number with area code, no internal code, no spaces or dashes.
 * Example: "6505551234"
 * @returns A phone number with international code and spaces.
 * Example: "+1 650 555 1234"
 */
export const formatPhoneForFirebaseAuth = (phone: string): string | null => {
  const phoneNumber = parsePhoneNumberFromString(phone, 'US');
  return phoneNumber ? phoneNumber.formatInternational() : null;
};

export const isValidPhone = (phone: NationalNumber): boolean => isValidNumber(phone, 'US');
