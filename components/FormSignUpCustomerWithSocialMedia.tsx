import 'firebase/storage';
import 'firebase/auth';

import firebase from 'firebase/app';
import React from 'react';
import InputMask from 'react-input-mask';
import { Button } from 'reactstrap';
import { Input } from 'reactstrap';
import { clearSubmitErrors, Field, reduxForm, SubmissionError } from 'redux-form';

import { FormNames } from '../constants';
import { SocialAuthProvider } from '../types/auth-verification';
import RenderIf from './utils/RenderIf';

interface Props {
  onSubmit: (values: any) => void;
  error: string;
  dispatch?: any;
  handleSubmit?: (values: any) => any;
}

let FormSignUpCustomerWithSocialMedia: React.FunctionComponent<Props> = ({
  onSubmit,
  error,
  dispatch,
  handleSubmit, // FIXME: This is not sent on "web\pages\account\signup\customer.tsx" so no clear how the submit works
}) => {
  const onSubmitValidate = (values, provider: SocialAuthProvider) => {
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
    dispatch(clearSubmitErrors(FormNames.FORM_SIGNUP_SOCIAL_MEDIA));
    onSubmit({ phone: formattedPh, provider });
  };
  return (
    <form onSubmit={handleSubmit?.(onSubmitValidate)}>
      <Button
        className='button button--social-login button--linkedin'
        onClick={handleSubmit?.((values) =>
          onSubmitValidate(values, new firebase.auth.GoogleAuthProvider())
        )}
      >
        <i className='icon fa fa-google' />
        Login With Google
      </Button>
      <Button
        className='button button--social-login button--facebook'
        onClick={handleSubmit?.((values) =>
          onSubmitValidate(values, new firebase.auth.FacebookAuthProvider())
        )}
      >
        <i className='icon fa fa-facebook' />
        Login With Facebook
      </Button>
      <Button
        className='button button--social-login button--twitter'
        onClick={handleSubmit?.((values) =>
          onSubmitValidate(values, new firebase.auth.TwitterAuthProvider())
        )}
      >
        <i className='icon fa fa-twitter' />
        Login With Twitter
      </Button>
      <Field
        name='phone'
        id='phoneNumber-social-media-field'
        type='tel'
        className='form-control'
        placeholder='Enter phone number'
        component={(props) => {
          return (
            <InputMask
              mask='(999) 999-9999' //TODO: Ticket 746 should refactor this
              value={props.value}
              onChange={(event) => props.input.onChange(event.target.value)}
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  name='phone'
                  id='phoneNumber-social-media'
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
      <div style={{ fontSize: '12px' }}>
        Clicking on a social media icon will send a text to your phone for verification. Standard
        data rates may apply.
      </div>

      <hr />
    </form>
  );
};
//@ts-ignore
FormSignUpCustomerWithSocialMedia = reduxForm({
  form: FormNames.FORM_SIGNUP_SOCIAL_MEDIA,
  //@ts-ignore
})(FormSignUpCustomerWithSocialMedia);

export default FormSignUpCustomerWithSocialMedia;
