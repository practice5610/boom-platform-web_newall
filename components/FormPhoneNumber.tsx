import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from 'reactstrap';
import { clearSubmitErrors, Field, reduxForm, SubmissionError } from 'redux-form';

import { FormNames } from '../constants';
import RenderIf from './utils/RenderIf';

interface Props {
  error: string;
  onSubmit: (values: any) => void;
  onChange?: (values: any) => any;
  handleSubmit?: (values: any) => any;
  dispatch?: any;
  submitting?: boolean;
  pristine?: boolean;
  label?: string;
}

let FormPhoneNumber: React.FunctionComponent<Props> = ({
  error = '',
  onSubmit,
  onChange,
  handleSubmit, // FIXME: This is not sent on "web\pages\account\login.tsx" so no clear how the submit works
  dispatch,
  submitting = false,
  pristine = false,
  label = 'Submit',
}) => {
  const onSubmitValidate = (values) => {
    const formattedPh: string | null =
      values.phone !== '' && values.phone !== undefined
        ? `${values.phone.replace(/[() \-_]+/g, '')}`
        : null;
    if (!formattedPh || formattedPh.length !== 10) {
      throw new SubmissionError({
        password: 'Phone is incomplete',
        _error: 'Phone is incomplete',
      });
    }
    dispatch?.(clearSubmitErrors(FormNames.FORM_NAME_EMAIL_PASSWORD_PHONE));
    onSubmit({ phone: formattedPh });
  };
  const _onChange = (props, value) => {
    props.input.onChange(value);
    onChange?.(value);
  };
  return (
    <form onSubmit={handleSubmit?.(onSubmitValidate)}>
      <Field
        name='phone'
        id='phoneNumber-field'
        type='tel'
        className='form-control'
        placeholder='Enter phone number'
        component={(props) => {
          return (
            <InputMask
              mask='(999) 999-9999' //TODO: Ticket 746 should refactor this
              value={props.value}
              onChange={(event) => _onChange(props, event.target.value)}
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  name='phone'
                  id='phoneNumber'
                  type='tel'
                  className='form-control'
                  placeholder='Enter phone number'
                  component='input'
                />
              )}
            </InputMask>
          );
        }}
      />
      <RenderIf condition={!!error}>
        <div>
          <strong>{error}</strong>
        </div>
      </RenderIf>
      <br />
      <button
        id='submit-phone'
        type='submit'
        className='btn login-button'
        disabled={submitting || pristine}
      >
        <RenderIf condition={submitting}>
          <i className='fa fa-spinner fa-spin' />
        </RenderIf>
        {label}
      </button>
    </form>
  );
};
//@ts-ignore
FormPhoneNumber = reduxForm({
  form: FormNames.FORM_PHONE,
  //@ts-ignore
})(FormPhoneNumber);

export default FormPhoneNumber;
