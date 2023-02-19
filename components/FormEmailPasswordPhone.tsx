import 'firebase/auth';

import firebase from 'firebase/app';
import React from 'react';
import { clearSubmitErrors, Field, reduxForm, SubmissionError } from 'redux-form';

import { FormNames } from '../constants';
import InputPhoneMasked from './InputPhoneMasked';
import RenderIf from './utils/RenderIf';

interface Props {
  title: string;
  onSubmit: (values: any) => void;
  error?: string;
  apiError?: string;
  dispatch?: any;
  handleSubmit?: (values: any) => any;
  submitting?: boolean;
  pristine?: boolean;
  showPhoneField?: boolean;
}

let FormEmailPasswordPhone: React.FunctionComponent<Props> = ({
  title,
  onSubmit,
  error = '',
  apiError = '',
  dispatch,
  handleSubmit, // FIXME: This is not sent on "web\pages\account\login.tsx" so no clear how the submit works
  submitting = false,
  pristine = false,
  showPhoneField = false,
}) => {
  const onSubmitValidate = (values: any) => {
    const provider = new firebase.auth.EmailAuthProvider();
    const formattedPh: string | null =
      showPhoneField && values.phone !== '' && values.phone !== undefined
        ? `${values.phone.replace(/[() \-_]+/g, '')}`
        : null;
    if (values.email === '' || values.email === undefined) {
      throw new SubmissionError({
        email: 'Email is empty',
        _error: 'Email is empty',
      });
    } else if (values.password === '' || values.password === undefined) {
      throw new SubmissionError({
        password: 'Password is empty',
        _error: 'Password is empty',
      });
    } else if (showPhoneField && (!formattedPh || formattedPh.length !== 10)) {
      throw new SubmissionError({
        password: 'Phone is incomplete',
        _error: 'Phone is incomplete',
      });
    }
    dispatch?.(clearSubmitErrors(FormNames.FORM_NAME_EMAIL_PASSWORD_PHONE));
    onSubmit?.({ ...values, ...(showPhoneField ? { phone: formattedPh } : {}), provider });
  };

  return (
    <form onSubmit={handleSubmit?.(onSubmitValidate)}>
      <div className='form-group'>
        <Field
          name='email'
          type='email'
          className='form-control'
          placeholder='Enter email'
          component='input'
          autoComplete='username'
          maxLength={40}
        />
      </div>
      <div className='form-group'>
        <Field
          name='password'
          type='password'
          className='form-control'
          placeholder='Enter password'
          component='input'
          autoComplete='current-password'
          maxLength={40}
        />
      </div>
      <RenderIf condition={showPhoneField}>
        <div className='form-group'>
          <Field
            name='phone'
            id='phoneNumber-email-pass-field'
            type='tel'
            className='form-control'
            placeholder='Enter phone number'
            component={InputPhoneMasked}
          />
        </div>
      </RenderIf>
      <RenderIf condition={!!error || !!apiError}>
        <strong>{error || apiError}</strong>
      </RenderIf>
      <button type='submit' className='btn login-button' disabled={pristine || submitting}>
        <RenderIf condition={submitting}>
          <i className='fa fa-spinner fa-spin' />
        </RenderIf>
        {title}
      </button>
    </form>
  );
};
// @ts-ignore // TODO: Remove this and fix the errors
FormEmailPasswordPhone = reduxForm({
  // a unique name for the form
  form: FormNames.FORM_NAME_EMAIL_PASSWORD_PHONE,
  // @ts-ignore // TODO: Remove this and fix the errors
})(FormEmailPasswordPhone);

export default FormEmailPasswordPhone;
