import { AllOptionalExceptFor, BoomUser, EmailRegex } from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import moment from 'moment';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { connect } from 'react-redux';
import { Label } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestProfileUpdate } from '../../../redux/actions/auth';
import { deleteImage, getImage, uploadImage } from '../../../redux/actions/image';
import { AppState } from '../../../redux/reducers';
import { getRegistrationStep } from '../../../redux/selectors';
import { NextLayoutPage } from '../../../types';
import { US_STATES, us_states } from '../../../utils/us-states';

type Props = {
  requestProfileUpdate?: typeof requestProfileUpdate;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  registrationStep?: number;
  uploadImage?: typeof uploadImage;
  deleteImage?: typeof deleteImage;
  getImage?: typeof getImage;
  nextStep?: any;
  step: number;
};

const First: NextLayoutPage<Props> = ({ user, step, requestProfileUpdate, nextStep }) => {
  const setRegistrationStep = (i) => {
    if (user)
      if (user.registrationStep) {
        if (user.registrationStep < i) user.registrationStep = i;
      } else {
        user.registrationStep = i;
      }
  };

  // const addOtherAdmin = () => {
  //   const {
  //     fname,
  //     lname,
  //     // workPhone,
  //     // sex,
  //     // address,
  //     // city,
  //     // province,
  //     // country,
  //     // image,
  //     ownershipPercentage,
  //   } = data;

  //   // reset to initial state and show user added successfully
  //   setData({
  //     fname: '',
  //     lname: '',
  //     workPhone: '',
  //     noOfOwners: '',
  //     ownershipPercentage: '',
  //     sex: 'Male',
  //     address: '',
  //     city: '',
  //     province: '',
  //     zip: '',
  //     country: '',
  //     image: '',
  //     addedAdmin: `${fname} ${lname} ${ownershipPercentage ? `${ownershipPercentage}%` : ''}`,
  //   });
  // };

  const _renderErrorMessage = (name: keyof IFormInputs) => (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ messages }) => {
        return messages
          ? Object.entries(messages).map(([type, message]) => (
              <p className={'small text-danger'} key={type}>
                {message}
              </p>
            ))
          : null;
      }}
    />
  );

  interface IFormInputs {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: string;
    ownersNumber: string;
    ownership: string;
    number: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IFormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.contact?.phoneNumber ?? '',
      email: user?.contact?.emails?.[0] ?? '',
      gender: user?.gender ?? '',
      ownersNumber: '',
      ownership: '',
      number: user?.addresses?.[0].number ?? '',
      street1: user?.addresses?.[0].street1 ?? '',
      street2: user?.addresses?.[0].street2 ?? '',
      city: user?.addresses?.[0].city ?? '',
      state: user?.addresses?.[0].state ?? '',
      zip: user?.addresses?.[0].zip ?? '',
      country: user?.addresses?.[0].country ?? '',
    },
  });

  const onSubmit = (values: IFormInputs) => {
    if (user) {
      user.firstName = values.firstName;
      user.lastName = values.lastName;
      user.gender = values.gender;
      if (user.contact?.emails) user.contact.emails = [...user.contact.emails, values.email];
      else user.contact = { ...user.contact, emails: [values.email] };
      if (user.addresses) {
        user.addresses.push({
          number: values.number,
          street1: values.street1,
          street2: values.street2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
        });
      } else {
        user.addresses = [
          {
            number: values.number,
            street1: values.street1,
            street2: values.street2,
            city: values.city,
            state: values.state,
            zip: values.zip,
            country: values.country,
          },
        ];
      }
      setRegistrationStep(1);
      requestProfileUpdate?.(user);
      nextStep();
    }
  };

  return (
    <div>
      {step === 1 ? (
        <section>
          <div className='container-medium'>
            <div className='centered-content'>
              <div className='form-tab'>
                <form id='form1' onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-title'>Owner(s) information</div>
                  <div className='form-group'>
                    <label htmlFor='firstName'>First name*</label>
                    <input
                      {...register('firstName', {
                        required: '⚠ This input is required.',
                        pattern: {
                          value: /^[a-zA-Z .,'`&-]{2,25}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ First name to short.' },
                      })}
                      id='firstName'
                      type='text'
                      className='form-control'
                      placeholder=''
                      maxLength={25}
                    />
                    {_renderErrorMessage('firstName')}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='lastName'>Last name*</label>
                    <input
                      {...register('lastName', {
                        required: '⚠ This input is required.',
                        pattern: {
                          value: /^[a-zA-Z .,'`&-]{2,25}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ Last name to short.' },
                      })}
                      id='lastName'
                      type='text'
                      className='form-control'
                      placeholder=''
                      maxLength={25}
                    />
                    {_renderErrorMessage('lastName')}
                  </div>
                  <div className='form-group'>
                    <Label>Work phone</Label>
                    <Controller
                      name='phone'
                      control={control}
                      rules={{
                        required: '⚠ This input is required.',
                        // pattern: {
                        //   value: PhoneRegex,
                        //   message: "⚠ regex error"
                        // }
                      }}
                      render={({ field: { onChange, value } }) => (
                        <InputMask
                          mask='+9(999) 999-9999'
                          value={value}
                          onChange={onChange}
                          disabled={true}
                        >
                          {(inputProps) => (
                            <input
                              {...inputProps}
                              name='phone'
                              type='tel'
                              className='form-control'
                            />
                          )}
                        </InputMask>
                      )}
                    />
                    {_renderErrorMessage('phone')}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='email'>Email address*</label>
                    <input
                      {...register('email', {
                        required: '⚠ This input is required.',
                        pattern: { value: EmailRegex, message: '⚠ Regex error.' },
                      })}
                      name='email'
                      type='email'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('email')}
                  </div>
                  <div className='form-group'>
                    <label htmlFor='gender'>Gender*</label>
                    <div className='radio-buttons'>
                      <div>
                        <input
                          {...register('gender', { required: '⚠ This input is required.' })}
                          type='radio'
                          value='Male'
                        />
                        <span>Male</span>
                      </div>
                      <div>
                        <input
                          {...register('gender', { required: '⚠ This input is required.' })}
                          type='radio'
                          value='Female'
                        />
                        <span>Female</span>
                      </div>
                      {_renderErrorMessage('gender')}
                    </div>
                  </div>
                  <div className='multiple-groups'>
                    <div className='form-group'>
                      <Label>How many owners?*</Label>
                      <input
                        {...register('ownersNumber', {
                          required: '⚠ This input is required.',
                        })}
                        type='number'
                        className='form-control'
                        placeholder=''
                        min={1}
                        max={99}
                      />
                      {_renderErrorMessage('ownersNumber')}
                    </div>

                    <div className='form-group'>
                      <label htmlFor='ownership'>Percentage ownership*</label>
                      <div className='col'>
                        <input
                          {...register('ownership', {
                            required: '⚠ This input is required.',
                          })}
                          type='number'
                          className='form-control'
                          placeholder='%'
                          min={'1'}
                          max={'100'}
                          maxLength={3}
                        />
                        {_renderErrorMessage('ownership')}
                      </div>
                    </div>
                  </div>

                  <Label>Address*</Label>
                  <div className='form-row'>
                    <div className='col'>
                      <div className='form-group'>
                        <label htmlFor='number'>Building number*</label>
                        <input
                          {...register('number', {
                            required: '⚠ This input is required.',
                          })}
                          type='text'
                          className='form-control'
                          placeholder='1234'
                        />
                        {_renderErrorMessage('number')}
                      </div>
                    </div>
                    <div className='col'>
                      <div className='form-group'>
                        <label htmlFor='street1'>Main street*</label>
                        <input
                          {...register('street1', {
                            required: '⚠ This input is required.',
                          })}
                          type='text'
                          className='form-control'
                          placeholder='main st'
                        />
                        {_renderErrorMessage('street1')}
                      </div>
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='street2'>Apartment, studio or floor</label>
                    <input
                      {...register('street2')}
                      type='text'
                      className='form-control'
                      placeholder='apt 123'
                    />
                    {_renderErrorMessage('street2')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='city'>City*</label>
                    <input
                      {...register('city', {
                        required: '⚠ This input is required.',
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('city')}
                  </div>

                  <div className='form-row'>
                    <div className='col'>
                      <div className='form-group'>
                        <label htmlFor='state'>State*</label>
                        <select
                          {...register('state', {
                            required: '⚠ This input is required.',
                          })}
                          className='form-control'
                          defaultValue=''
                        >
                          <option value='' disabled>
                            Select State
                          </option>
                          {US_STATES.map((state) => (
                            <option className='form-control' key={state} value={state}>
                              {us_states[state]}
                            </option>
                          ))}
                        </select>
                        {_renderErrorMessage('state')}
                      </div>
                    </div>
                    <div className='col'>
                      <div className='form-group'>
                        <label htmlFor='zip'>Zip Code*</label>
                        <input
                          {...register('zip', {
                            required: '⚠ This input is required.',
                          })}
                          type='text'
                          className='form-control'
                          placeholder=''
                        />
                        {_renderErrorMessage('zip')}
                      </div>
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='country'>Country*</label>
                    <select
                      {...register('country', {
                        required: '⚠ This input is required.',
                      })}
                      className='form-control'
                      defaultValue=''
                    >
                      <option value='' disabled>
                        Select Country
                      </option>
                      <option className='form-control' value='US'>
                        United States
                      </option>
                    </select>
                    {_renderErrorMessage('country')}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='register'>
            <div className='btn-group'>
              {/* <button
                type='button'
                className='btn btn-back'
                onClick={() => {
                  // addOtherAdmin();
                }}
              >
                Add other admin
              </button> */}
              <button form='form1' type='submit' className='btn btn-cont'>
                Continue
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  registrationStep: getRegistrationStep(state),
  isUserSignedIn: state.auth.isUserSignedIn,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(First);
