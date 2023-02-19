import { AllOptionalExceptFor, BoomUser, Store, StoreTypes } from '@boom-platform/globals';
import { Geolocation } from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import GoogleMap from 'google-map-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { CustomInput, Label } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestCreateStore } from '../../../redux/actions/account-merchant';
import { requestProfileUpdate } from '../../../redux/actions/auth';
import { AppState } from '../../../redux/reducers';
import { getRegistrationStep } from '../../../redux/selectors';
import { NextLayoutPage } from '../../../types';
import { storeTypeList, US_STATES, us_states } from '../../../utils/us-states';

type Props = {
  requestProfileUpdate?: typeof requestProfileUpdate;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  registrationStep?: number;
  requestCreateStore?: typeof requestCreateStore;
  nextStep?: any;
  backStep?: any;
  step: number;
};

const Third: NextLayoutPage<Props> = ({ user, step, nextStep, backStep, requestCreateStore }) => {
  const setRegistrationStep = (i) => {
    if (user)
      if (user.registrationStep) {
        if (user.registrationStep < i) user.registrationStep = i;
      } else {
        user.registrationStep = i;
      }
  };

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
    storeType: string;
    number: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    companyName: string;
    companyType: string;
    fein: string;
    years: string;
    companyDescription: string;
    pin: string;
    facebook_link: string;
    twitter_link: string;
    youtube_link: string;
    yeld_link: string;
    instagram_link: string;
    pinteres_link: string;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      storeType: '',
      number: '',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      companyName: '',
      companyType: '',
      fein: '',
      years: '',
      companyDescription: '',
      pin: '',
      facebook_link: '',
      twitter_link: '',
      youtube_link: '',
      yeld_link: '',
      instagram_link: '',
      pinteres_link: '',
    },
  });

  console.log(user);

  const onSubmit = (values: IFormInputs) => {
    const { storeType, number, street1, street2, city, state, zip, country } = values;
    const { companyName, companyType, fein, years, companyDescription, pin, links } = user?.store;

    console.log(companyName, companyType, fein, years, companyDescription, pin, links);
    if (user) {
      if (user.store) {

        //user.store.address = address; // TODO: Need to implement the new AddressInfo Interface here
        // user.store.companyLogoUrl = ''; // Review if this need to be asked in this step
        // user.store.coverImageUrl = ''; // Review if this need to be asked in this step
        const d: Store = {} as Store;
        user.store = d;
        user.store.companyName = companyName;
        user.store.companyType = companyType;
        user.store.fein = parseInt(fein);
        user.store.years = parseInt(years);
        user.store.companyDescription = companyDescription;
        user.store.pin = parseInt(pin);
        user.store.links = links;
        user.store.storeType = StoreTypes[storeType];
        user.store.number = number;
        user.store.street1 = street1;
        user.store.street2 = street2;
        user.store.city = city;
        user.store.state = state;
        user.store.zip = zip;
        user.store.country = country;
        const m: AllOptionalExceptFor<BoomUser, 'uid' | 'firstName' | 'lastName'> = {
          uid: user.uid,
          firstName: user.firstName,
          lastName: user.lastName,
        } as AllOptionalExceptFor<BoomUser, 'uid' | 'firstName' | 'lastName'>;
        user.store.merchant = m;
        if (!user.store._geoloc) {
          const g: Geolocation = {} as Geolocation;
          user.store._geoloc = g;
        }
        user.store._geoloc.lat = 25.7617; // need to be reviewed with the whole Geolocation system.
        user.store._geoloc.lng = -80.1918; // need to be reviewed with the whole Geolocation system.
        user.store.days = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
        // console.log(user);

        setRegistrationStep(3);
        const updatedUser: AllOptionalExceptFor<BoomUser, 'uid'> = {
          ...user,
          taxableNexus: [{ country: user.store?.country ?? '', state: user.store?.state ?? '' }],
        };
        // console.log(updatedUser);

        requestCreateStore?.(updatedUser);
      }
      nextStep();
    }
  };

  return (
    <div>
      {step === 3 ? (
        <section>
          <div className='container-medium'>
            <div className='centered-content'>
              <div className='form-tab'>
                {/* <div>
                  <GoogleMap
                    bootstrapURLKeys={
                      { key: 'AIzaSyBvrtnRWrIfU755Lg-qXJiY63TZZFRFAzk' } // TODO: Need to implement the new AddressInfo Interface here
                    }
                    center={data.center}
                    zoom={data.zoom}
                  >
                    lat={data.lat} lng={data.lon}
                    <SimpleMarker key={0} />
                  </GoogleMap>
                </div> */}
                <form id='form1' onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-group'>
                    <label htmlFor='storeType'>Type of store*</label>
                    <div className='radio-buttons'>
                      {storeTypeList.map((type) => (
                        <div key={type}>
                          <input
                            {...register('storeType', { required: '⚠ This input is required.' })}
                            type='radio'
                            value={type}
                          />
                          <span>{StoreTypes[type]}</span>
                        </div>
                      ))}
                    </div>
                    {_renderErrorMessage('storeType')}
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
                            minLength: {
                              value: 2,
                              message: '⚠ This input must have at least 2 characters.',
                            },
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
                      {...register('street2', {
                        minLength: {
                          value: 2,
                          message: '⚠ This input must have at least 2 characters.',
                        },
                      })}
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
            <div className='btn-group '>
              <button
                type='button'
                className='btn btn-back'
                onClick={() => {
                  backStep();
                }}
              >
                Go back
              </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Third);
