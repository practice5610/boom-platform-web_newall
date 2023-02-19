import { Money } from '@boom-platform/globals';
import Dinero from 'dinero.js';

/**
 * This function takes the value being typed into an input and formats it as money
 * like this:
 * 1 -> $0.01, 100 -> $1.00, etc.
 *
 * @param value The value of the input
 */
export const formatMoneyInput = (value: string) => {
  if (!value) return '$0.00';

  // remove all non digits
  value = value.replace(/\D/g, '');
  const numberValue = parseInt(value);
  if (isNaN(numberValue)) {
    return '$0.00';
  }
  const money = { amount: numberValue, precision: 2, currency: 'USD', symbol: '$' } as Money;
  return Dinero(money).toFormat('$0,0.00');
};
