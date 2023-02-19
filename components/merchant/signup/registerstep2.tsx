import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestProfileUpdate } from '../../../redux/actions/auth';
import { deleteImage, uploadImage } from '../../../redux/actions/image';
import { requestStoreTypes } from '../../../redux/actions/stores';
import { AppState } from '../../../redux/reducers';
import { getRegistrationStep } from '../../../redux/selectors';
import { NextLayoutPage } from '../../../types';

type Props = {
  requestProfileUpdate?: typeof requestProfileUpdate;
  requestStoreTypes?: typeof requestStoreTypes;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  registrationStep?: number;
  uploadImage?: typeof uploadImage;
  deleteImage?: typeof deleteImage;
  nextStep?: any;
  backStep?: any;
  step: number;
};
const Second: NextLayoutPage<Props> = ({
  user,
  step,
  nextStep,
  backStep,
  requestProfileUpdate,
}) => {
  React.useEffect(() => {
    requestStoreTypes();
  }, []);

  const setRegistrationStep = (i) => {
    if (user?.registrationStep && user.registrationStep < i) user.registrationStep = i;
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
    const {
      companyName,
      companyType,
      fein,
      years,
      companyDescription,
      pin,
      facebook_link,
      twitter_link,
      youtube_link,
      yeld_link,
      instagram_link,
      pinteres_link,
    } = values;

    const links = [
      facebook_link,
      twitter_link,
      youtube_link,
      yeld_link,
      instagram_link,
      pinteres_link,
    ];
    if (user) {
      if (!user.store) {
        user.store = {
          companyName: companyName,
          companyType: companyType,
          fein: parseInt(fein),
          years: parseInt(years),
          companyDescription: companyDescription,
          pin: parseInt(pin),
          links: links,
        };
      } else {
        user.store.companyName = companyName;
        user.store.companyType = companyType;
        user.store.fein = parseInt(fein);
        user.store.years = parseInt(years);
        user.store.companyDescription = companyDescription;
        user.store.pin = parseInt(pin);
        user.store.links = links;
      }
      setRegistrationStep(2);
      requestProfileUpdate?.(user);
      nextStep();
    }
  };

  return (
    <div>
      {step === 2 ? (
        <section>
          <div className='container-medium'>
            <div className='centered-content'>
              <div className='form-tab'>
                <form id='form1' onSubmit={handleSubmit(onSubmit)}>
                  <div className='form-title'>Company profile information.</div>

                  <div className='form-group'>
                    <label htmlFor='companyName'>Company Name*</label>
                    <input
                      {...register('companyName', {
                        required: '⚠ This input is required.',
                        pattern: {
                          value: /^[a-zA-Z .,'`&-]{2,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ Company name to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                      maxLength={30}
                    />
                    {_renderErrorMessage('companyName')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='companyType'>Company Type* (LLC,INC,etc)</label>
                    <input
                      {...register('companyType', {
                        required: '⚠ This input is required.',
                        pattern: {
                          value: /^[a-zA-Z .,'`&-]{2,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ Company type to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                      maxLength={30}
                    />
                    {_renderErrorMessage('companyType')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='fein'>Federal tax number* (FEIN)</label>
                    <input
                      {...register('fein', {
                        required: '⚠ This input is required.',
                      })}
                      type='number'
                      className='form-control'
                      placeholder=''
                      min={1}
                    />
                    {_renderErrorMessage('fein')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='years'>Year(s) in business*</label>
                    <input
                      {...register('years', {
                        required: '⚠ This input is required.',
                      })}
                      type='number'
                      className='form-control'
                      placeholder=''
                      min={1}
                    />
                    {_renderErrorMessage('years')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='companyDescription'>Company Description*</label>
                    <textarea
                      {...register('companyDescription', {
                        required: '⚠ This input is required.',
                        minLength: { value: 50, message: '⚠ Company description to short.' },
                      })}
                      className='form-control textarea'
                      rows={3}
                      placeholder=''
                    ></textarea>
                    <span>min of 50 characters</span>
                    {_renderErrorMessage('companyDescription')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='pin'>Pin*</label>
                    <input
                      {...register('pin', {
                        required: '⚠ This input is required.',
                      })}
                      type='number'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('pin')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='facebook_link'>Facebook page link (optional)</label>
                    <input
                      {...register('facebook_link', {
                        pattern: {
                          value: /^[a-zA-Z0-9.&/-]{5,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ URL to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('facebook_link')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='twitter_link'>Twitter link (optional)</label>
                    <input
                      {...register('twitter_link', {
                        pattern: {
                          value: /^[a-zA-Z0-9.&/-]{5,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ URL to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('twitter_link')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='youtube_link'>Youtube link (optional)</label>
                    <input
                      {...register('youtube_link', {
                        pattern: {
                          value: /^[a-zA-Z0-9.&/-]{5,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ URL to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('youtube_link')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='yeld_link'>Yeld link (optional)</label>
                    <input
                      {...register('yeld_link', {
                        pattern: {
                          value: /^[a-zA-Z0-9.&/-]{5,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ URL to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('yeld_link')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='Instagram'>Instagram link (optional)</label>
                    <input
                      {...register('instagram_link', {
                        pattern: {
                          value: /^[a-zA-Z0-9.&/-]{5,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ URL to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('instagram_link')}
                  </div>

                  <div className='form-group'>
                    <label htmlFor='pinteres_link'>Pinterest link (optional)</label>
                    <input
                      {...register('pinteres_link', {
                        pattern: {
                          value: /^[a-zA-Z0-9.&/-]{5,30}$/,
                          message: '⚠ Regex error.',
                        },
                        minLength: { value: 2, message: '⚠ URL to short.' },
                      })}
                      type='text'
                      className='form-control'
                      placeholder=''
                    />
                    {_renderErrorMessage('pinteres_link')}
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
  storeConfig: state.storesConfig,
  registrationStep: getRegistrationStep(state),
  isUserSignedIn: state.auth.isUserSignedIn,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Second);
