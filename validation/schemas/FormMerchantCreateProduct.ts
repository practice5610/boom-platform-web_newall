import { PriceRegex } from '@boom-platform/globals';

export const FormMerchantCreateProductSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 80 },
    description: { type: 'string', minLength: 2, maxLength: 280 },
    price: {
      type: 'string',
      pattern: PriceRegex.source,
    },
  },
  required: ['name', 'description', 'price'],
  additionalProperties: true,
} as const;
