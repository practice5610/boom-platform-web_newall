import { AllOptionalExceptFor, BoomUser, Gender } from '@boom-platform/globals';
import Ajv from 'ajv';
import { FromSchema } from 'json-schema-to-ts';
import dynamic from 'next/dynamic';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { ProfileAndImageUpdate, requestProfileAndImageUpdate } from '../../../redux/actions/auth';
import { deleteImage, getImage, uploadImage } from '../../../redux/actions/image';
import { AppState } from '../../../redux/reducers';
import {
  base64ToImageSrc,
  existImage,
  fileToBase64,
  generateUUID,
  parseUUID,
} from '../../../utils/image-utils';
import { formatPhoneForFirebaseAuth, isValidPhone } from '../../../utils/phone';
import { parseErrorSchema } from '../../../validation/parsers';
import { FormCustomerEditProfileSchema } from '../../../validation/schemas/FormCustomerEditProfile';

//import { CountryInput } from './CountrySelection';

const _NoSSRImageUploadAccProfile = dynamic(import('../../ImageUploaderAccProfile'), {
  ssr: false,
});

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  uploadImage?: typeof uploadImage;
  getImage?: typeof getImage;
  deleteImage?: typeof deleteImage;
  requestProfileAndImageUpdate?: typeof requestProfileAndImageUpdate;
}

type useFormType = FromSchema<typeof FormCustomerEditProfileSchema>;

const ajv = new Ajv({ allErrors: true });

const FormCustomerEditProfile: FunctionComponent<Props> = ({
  user,
  uploadImage,
  getImage,
  deleteImage,
  requestProfileAndImageUpdate,
}) => {
  const {
    control,
    //register,
    handleSubmit,
    setError,
    setValue: setFormValue,
    //watch,
    formState: { errors, isValid },
  } = useForm<useFormType>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      newPassword: '',
      confirmNewPassword: '',
      currentPassword: '',
      email: user?.contact?.emails?.[0] ?? '',
      phoneNumber: user?.contact?.phoneNumber ?? '',
      gender:
        user?.gender === Gender.MALE
          ? Gender.MALE
          : user?.gender === Gender.FEMALE
          ? Gender.FEMALE
          : Gender.NONE,
    },

    //criteriaMode: 'all',
    shouldFocusError: false,
  });

  const [uuid, setUuid] = useState<string>(
    user?.profileImg?.imgUrl ? parseUUID(user.profileImg.imgUrl) ?? '' : generateUUID()
  );
  const [preview, setPreview] = useState<null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(user?.profileImg?.imgFile || null);
  const [profileBase64Data, setProfileBase64Data] = useState<string | null>(
    base64ToImageSrc(user?.profileImg?.base64Data)
  );
  const [cropCount, setCropCount] = useState<number>(0);
  console.log('userdat', user);
  useEffect(() => {
    if (user) {
      user.firstName && setFormValue('firstName', user.firstName);
      user.lastName && setFormValue('lastName', user.lastName);
      if (user.contact?.emails?.[0]) {
        user.contact?.emails?.[0] && setFormValue('email', user.contact.emails[0]);
      }
      setFormValue('newPassword', '');
      setFormValue('confirmNewPassword', '');
      setFormValue('currentPassword', '');
      if (user.contact?.phoneNumber) {
        user.contact?.phoneNumber && setFormValue('phoneNumber', user.contact.phoneNumber);
      }
      user.gender &&
        setFormValue(
          'gender',
          user?.gender === Gender.MALE
            ? Gender.MALE
            : user?.gender === Gender.FEMALE
            ? Gender.FEMALE
            : Gender.NONE
        );

      if (user.profileImg && existImage(user.profileImg.imgUrl)) {
        if (user.profileImg.imgFile?.size && user.profileImg.base64Data) {
          setProfileBase64Data(base64ToImageSrc(user.profileImg.base64Data));
          setProfileImage(user.profileImg.imgFile);
          setCropCount(0);
          setUuid(parseUUID(user.profileImg.imgUrl) ?? '');
        }
      } else {
        setProfileBase64Data(null);
        setProfileImage(null);
        setCropCount(0);
        setUuid(generateUUID());
      }
    }
  }, [user, setFormValue]);

  const _setImageUploaderSrc = async (e: any) => {
    const files = e.currentTarget.files;
    const profileBase64Data: string = (await fileToBase64(files)) as string;
    setProfileImage(files[0]);
    setProfileBase64Data(profileBase64Data ? profileBase64Data : null);
  };

  const _openFileBrowser = (e: any) => {
    // TODO: Implement a useRef here
    const fileUploader: HTMLElement = document.getElementById('file') as HTMLElement;
    fileUploader.click();
  };

  const _setPreviewBase64 = (previewBase64: any, isOnCrop = false) => {
    if (isOnCrop) {
      setCropCount((oldValue) => {
        return oldValue + 1 - (cropCount >> 1);
      });
      setPreview(previewBase64);
    } else setPreview(previewBase64);
  };

  const _onSubmit = (data: useFormType) => {
    console.log('workinggg');
    if (!user) {
      // TODO: Check if we need to throw error
      return;
    }
    if (data.email != user.contact?.emails?.[0] && !data.currentPassword?.length) {
      setError('currentPassword', {
        message: 'Email change requires that you enter your current password',
        type: 'pattern',
      });
      return;
    }
    const sendData: any = {
      user: {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        contact: {
          emails: [data.email],
          phoneNumber: data.phoneNumber,
        },
        gender: data.gender,
        profileImg: {
          imgFile: profileImage,
        },
      },
      previewBase64: null,
      uuid,
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      addresses: [
        {
          Object_id: '121212112',
          is_complete: true,
          name: 'dummyname',
          number: '121212112',
          street1: '12street',
          street2: '12street',
          city: 'lahore',
          state: 'punjab',
          zip: 232323,
          country: 'pakistan',
        },
      ],
    };
    if (preview) {
      sendData.previewBase64 =
        cropCount < 2 && profileBase64Data === base64ToImageSrc(user?.profileImg?.base64Data)
          ? base64ToImageSrc(user?.profileImg?.base64Data)
          : preview;
    }
    // TODO: Compare old and current data to see if it is needed to send the data (Cannot be implemented now since Image uploading needs to be tested first)

    requestProfileAndImageUpdate?.(sendData);
  };
  return (
    <div className='FormCustomerSettings container'>
      <div className='Form-edit-profile d-flex'>
        <Form onSubmit={handleSubmit(_onSubmit)}>
          <FormGroup>
            <Controller
              name='firstName'
              control={control}
              render={({ field }) => (
                <Input
                  placeholder='First Name'
                  invalid={!!errors?.firstName}
                  autoComplete='given-name'
                  {...field}
                />
              )}
            />
            <FormFeedback>{errors?.firstName || 'First name is required'}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Controller
              name='lastName'
              control={control}
              //defaultValue={lastName}
              render={({ field }) => (
                <Input
                  placeholder='Last Name'
                  invalid={!!errors?.lastName}
                  autoComplete='family-name'
                  {...field}
                />
              )}
            />
            <FormFeedback>{errors?.lastName || 'Last name is required'}</FormFeedback>
          </FormGroup>
          <hr className='hr_space' />
          <FormGroup>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input type='email' placeholder='Email' invalid={!!errors?.email} {...field} />
              )}
            />
            <FormFeedback>Invalid E-mail</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Controller
              name='newPassword'
              control={control}
              render={({ field }) => (
                <Input
                  type='password'
                  placeholder='New Password'
                  invalid={!!errors?.confirmNewPassword}
                  autoComplete='new-password'
                  {...field}
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Controller
              name='confirmNewPassword'
              control={control}
              render={({ field }) => (
                <Input
                  type='password'
                  placeholder='Confirm Password'
                  invalid={!!errors?.confirmNewPassword}
                  autoComplete='new-password'
                  {...field}
                />
              )}
            />
            <FormFeedback>{errors?.confirmNewPassword}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Controller
              name='currentPassword'
              control={control}
              render={({ field }) => (
                <Input
                  type='password'
                  placeholder='Current Password'
                  invalid={!!errors?.currentPassword}
                  autoComplete='new-password'
                  {...field}
                />
              )}
            />
            <FormFeedback>{errors?.currentPassword}</FormFeedback>
          </FormGroup>
          <hr className='hr_space' />
          <FormGroup>
            <Controller
              control={control}
              name='phoneNumber'
              //defaultValue={lastName}
              render={({ field }) => (
                <Input placeholder='Mobile Number' invalid={!!errors?.phoneNumber} {...field} />
              )}
            />
            <FormFeedback>{errors?.phoneNumber}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Controller
              name='gender'
              control={control}
              render={({ field }) => (
                <Input type='select' {...field}>
                  <option value='' disabled>
                    Gender
                  </option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </Input>
              )}
            />
          </FormGroup>

          {/*
            // TODO: Need to implement the new AddressInfo Interface here
            <Input
              placeholder='Address'
              value={contact && contact.address ? contact.address : ''}
              onChange={(e) => this.setContact({ address: e.currentTarget.value })}
            />
            <Input
              placeholder='City'
              value={contact && contact.city ? contact.city : ''}
              onChange={(e) => this.setContact({ city: e.currentTarget.value })}
            />
            //<CountryInput
              val={contact && contact.country ? contact.country : ''}
              onChange={(e) => this.setContact({ country: e.currentTarget.value })}
              state={contact && contact.state ? contact.state : ''}
              stateChange={(e) => this.setContact({ state: e.currentTarget.value })}
              province={contact && contact.state ? contact.state : ''}
              provinceChange={(e) => this.setContact({ state: e.currentTarget.value })}
            />

            <Input
              placeholder='Zip Code'
              value={contact && contact.zip ? contact.zip : ''}
              onChange={(e) => this.setContact({ zip: e.currentTarget.value })}
            />
            */}

          <Input type='submit' className='save-changes-btn' value='Save Changes' />
        </Form>
        <div className='form-profile-container d-flex align-items-center justify-content-center '>
          {profileBase64Data ? (
            <_NoSSRImageUploadAccProfile
              //setPreview={setPreview}
              setPreview={_setPreviewBase64}
              setProfileImage={setProfileImage}
              setNullProfileBase64Data={() => {
                setProfileBase64Data(null);
              }}
              profileBase64Data={profileBase64Data}
            />
          ) : (
            <Button className='form-profile-picture' onClick={_openFileBrowser}>
              <input
                type='file'
                id='file'
                //ref='fileUploader'
                accept='image/*'
                onChange={_setImageUploaderSrc}
                style={{ display: 'none' }}
              />
              <h2>PROFILE PICTURE</h2>
              <span>
                CLICK TO UPLOAD
                <br />
                600px x 600px
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormCustomerEditProfile);
