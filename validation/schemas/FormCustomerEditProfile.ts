import { EmailRegex, Gender } from '@boom-platform/globals';

export const FormCustomerEditProfileSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    newPassword: { type: 'string', minLength: 6 }, // check api\src\validation\schemas\forms.ts
    confirmNewPassword: { type: 'string' },
    currentPassword: { type: 'string' },
    email: {
      type: 'string',
      pattern: EmailRegex.source,
    },
    phoneNumber: { type: 'string', minLength: 10 },
    gender: { enum: [Gender.MALE, Gender.FEMALE, Gender.NONE] },
  },
  required: ['firstName', 'lastName', 'email', 'phoneNumber'],
  additionalProperties: true,
} as const;

//TODO: replace the pattern for email, phoneNumber, gender, and others from globals once it is update
