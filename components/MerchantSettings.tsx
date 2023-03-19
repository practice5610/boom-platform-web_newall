import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import { FormNames } from '../constants';
import { CountryField } from './CountrySelection';
import MerchantLogoAndCoverUpload from './MerchantLogoAndCoverUpload';
import MerchantStoreProfile from './MerchantStoreProfile';
import { StateField } from './StateChoices';
import RenderIf from './utils/RenderIf';

const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: false });

let MerchantSettings = (props) => {
  const {
    onSubmit,
    handleSubmit,
    error,
    apiError,
    submitting,
    uploadImage,
    uploadCoverImage,
    companyLogoUrl,
    coverImageUrl,
    imageName,
    coverImageName,
    categories,
  } = props;

  //FIXME: this component needs to be updated to support the new address fields number, street1, and street2
  const [data, setImage] = useState({ file: '' });
  const [coverImageFile, setCoverImageFile] = useState({ file: '' });
  const [locationModal, setLocationModal] = useState(false);

  const onSubmitValidate = async (values: any) => {
    if (values.email === '' || values.email === undefined) {
      alert('Email is required!');
      throw new SubmissionError({
        email: 'Email is required',
      });
    }
    if (data.file) {
      const formData = new FormData();
      formData.append('file', data.file);
      await uploadImage(formData);
      values.companyLogoUrl = process.env.NEXT_PUBLIC_API_URL + '/images/' + imageName;
    }

    if (coverImageFile.file) {
      const coverFormData = new FormData();
      coverFormData.append('file', coverImageFile.file);
      await uploadCoverImage(coverFormData);
      values.coverImageUrl = process.env.NEXT_PUBLIC_API_URL + '/images/' + coverImageName;
    }

    // dispatch(clearSubmitErrors(FormNames.FORM_MERCHANT_SETTINGS));
    onSubmit({ ...values });
  };

  const setImageData = (file) => {
    setImage({ file });
  };
  const setCoverImageData = (file) => {
    setCoverImageFile({ file });
  };

  const toggleModal = () => {
    setLocationModal((locationModal) => !locationModal);
  };

  return (
    <>
      <Modal
        className='merchant-settings-modal'
        isOpen={locationModal}
        toggle={toggleModal}
        size='xl'
      >
        <ModalHeader className='merchant-settings-header' toggle={toggleModal} />
        <ModalBody className='merchant-settings-body'>
          <MerchantStoreProfile />
        </ModalBody>
      </Modal>
      <div className='NavAccount d-flex w-100'>
        <a
          style={{
            backgroundColor: '#d42d27',
            color: 'white',
            fontSize: '0.875rem',
            padding: '9px 11px',
          }}
        >
          SETTINGS
        </a>
      </div>
      <div className='MerchantSettings'>
        <div className='merchant-settings d-flex'>
          <RenderIf condition={!!error || !!apiError}>
            <div>
              <strong>{error || apiError}</strong>
            </div>
          </RenderIf>
          <Form className='settings-form' onSubmit={handleSubmit(onSubmitValidate)}>
            <Row>
              <h3>Settings</h3>
              <div className='question-icon'>
                <a
                  style={{ marginLeft: '10px' }}
                  data-tip
                  data-for='settings-help'
                  data-event='click'
                >
                  <img src='/images/icons8-help-20.png' alt='help icon' />
                </a>
                <ReactTooltip
                  id='settings-help'
                  place='right'
                  effect='solid'
                  clickable={true}
                  border={true}
                  type='light'
                >
                  <p>
                    In this section, you can edit your name, company information, business logo and
                    cover image, and any links that connect to either your company website or social
                    media accounts.
                    <br />
                    <b>Image sizes:</b>
                    <br />
                    Company logo 300x300
                    <br />
                    Banner 1440x403
                  </p>
                </ReactTooltip>
              </div>
            </Row>
            <Row>
              <p>Change or add store information</p>
            </Row>
            <Row>
              <Col lg={6}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='first-name'>First Name</Label>
                      <Field
                        name='firstName'
                        component='input'
                        type='text'
                        className='form-control'
                        maxLength={20}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='last-name'>Last Name</Label>
                      <Field
                        name='lastName'
                        component='input'
                        type='text'
                        className='form-control'
                        maxLength={20}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='address'>HQ Address</Label>
                      <Field
                        name='address'
                        component='input'
                        type='text'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='city'>City</Label>
                      <Field name='city' component='input' type='text' className='form-control' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='country'>Country</Label>
                      <CountryField />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='state'>State/Province</Label>
                      <StateField />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='zip'>Zip Code</Label>
                      <Field
                        name='zip'
                        component='input'
                        type='text'
                        className='form-control'
                        maxLength={10}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='name'>Business Name</Label>
                      <Field
                        name='companyName'
                        component='input'
                        type='text'
                        className='form-control'
                        maxLength={40}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='category'>Business Type</Label>
                      <Field
                        name='companyType'
                        component='select'
                        className='form-control'
                        maxLength={50}
                      >
                        {categories.map((category) => {
                          return (
                            <option key={`cat_${category._id}`} value={`${category.name}`}>
                              {category.name}
                            </option>
                          );
                        })}
                      </Field>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='email'>Email</Label>
                      <Field
                        name='email'
                        type='email'
                        component='input'
                        className='form-control'
                        maxLength={30}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='website'>Website</Label>
                      <Field
                        name='website'
                        component='input'
                        className='form-control'
                        maxLength={20}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='phone'>Phone Number</Label>
                      <Field
                        name='phoneNumber'
                        component='input'
                        className='form-control'
                        maxLength={15}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='fein'>Federal Tax Number</Label>
                      <Field
                        name='fein'
                        component='input'
                        className='form-control'
                        maxLength={10}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for='years'>Year(s) in Business</Label>
                      <Field
                        name='years'
                        component='input'
                        className='form-control'
                        maxLength={10}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for='companyDescription'>Company Description</Label>
                      <Field
                        name='companyDescription'
                        component='textarea'
                        className='form-control'
                        maxLength={250}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup tag='fieldset'>
                      <legend className='col-form-label'>Type of Store</legend>
                      <FormGroup check>
                        <Label for='radio' check>
                          <Input type='radio' name='storeType' />
                          Online
                        </Label>
                        <Label for='radio' check>
                          <Input type='radio' name='storeType' />
                          Brick and Mortar
                        </Label>
                        <Label for='radio' check>
                          <Input type='radio' name='storeType' />
                          Online, Brick and Mortar
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-facebook-20.png'
                        style={{ marginRight: '5px' }}
                        alt='facebook icon'
                      />
                      <Label for='facebook'>Facebook</Label>
                      <Field
                        name='companyFacebookUrl'
                        type='text'
                        component='input'
                        placeholder='Company Facebook URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-twitter-20.png'
                        style={{ marginRight: '5px' }}
                        alt='twitter icon'
                      />
                      <Label for='twitter'>Twitter</Label>
                      <Field
                        name='companyTwitterUrl'
                        type='text'
                        component='input'
                        placeholder='Company Twitter URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-instagram-20.png'
                        style={{ marginRight: '5px' }}
                        alt='instagram icon'
                      />
                      <Label for='instagram'>Instagram</Label>
                      <Field
                        name='companyInstagramUrl'
                        type='text'
                        component='input'
                        placeholder='Company Instagram URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-linkedin-20.png'
                        style={{ marginRight: '5px' }}
                        alt='linkedin icon'
                      />
                      <Label for='linkedin'>LinkedIn</Label>
                      <Field
                        name='companyLinkedInUrl'
                        type='text'
                        component='input'
                        placeholder='Company LinkedIn URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-play-button-20.png'
                        style={{ marginRight: '5px' }}
                        alt='youtube icon'
                      />
                      <Label for='youtube'>YouTube</Label>
                      <Field
                        name='companyYouTubeUrl'
                        type='text'
                        component='input'
                        placeholder='Company YouTube URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-yelp-20.png'
                        style={{ marginRight: '5px' }}
                        alt='yelp icon'
                      />
                      <Label for='yelp'>Yelp</Label>
                      <Field
                        name='companyYelpUrl'
                        type='text'
                        component='input'
                        placeholder='Company Yelp URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <img
                        src='/images/icons8-pinterest-20.png'
                        style={{ marginRight: '5px' }}
                        alt='pinterest icon'
                      />
                      <Label for='pinterest'>Pinterest</Label>
                      <Field
                        name='companyPinterestUrl'
                        type='text'
                        component='input'
                        placeholder='Company Pinterest URL'
                        className='form-control'
                        maxLength={80}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={2} />
                  <Col md={4}>
                    <button type='submit' className='update-btn'>
                      <RenderIf condition={submitting}>
                        <i className='fa fa-spinner fa-spin' />
                      </RenderIf>
                      Update
                    </button>
                  </Col>
                  <Col md={4}>
                    <button
                      type='button'
                      className='update-btn'
                      onClick={() => setLocationModal(true)}
                    >
                      Store Preview
                    </button>
                  </Col>
                  <Col md={2} />
                </Row>
              </Col>
              <Col lg={6}>
                <MerchantLogoAndCoverUpload
                  companyLogoUrl={companyLogoUrl}
                  coverImageUrl={coverImageUrl}
                  setImageData={setImageData}
                  setCoverImageData={setCoverImageData}
                />

                <FormGroup className='store-locations' tag='fieldset'>
                  <legend className='col-form-label'>
                    <h2>Store Locations</h2>
                  </legend>
                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for='address1'>Weston Store</Label>
                        <Input
                          type='text'
                          name='address1'
                          value='55 Weston Road, Weston, FL 33326, US'
                          readOnly
                          style={{ backgroundColor: '#fff' }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <Input
                        type='button'
                        className='edit-btn'
                        value='Edit Address'
                        onClick={toggleModal}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for='address2'>Miami Store</Label>
                        <Input
                          type='text'
                          name='address2'
                          value='11401 NW 12 Street, Miami, FL 33172, US'
                          readOnly
                          style={{ backgroundColor: '#fff' }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <Input
                        type='button'
                        className='edit-btn'
                        value='Edit Address'
                        onClick={toggleModal}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <FormGroup>
                        <Label for='address3'>Delray Store</Label>
                        <Input
                          type='text'
                          name='address3'
                          value='201 E Atlantic Ave, Delray Beach, FL 33444, US'
                          readOnly
                          style={{ backgroundColor: '#fff' }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <Input
                        type='button'
                        className='edit-btn'
                        value='Edit Address'
                        onClick={toggleModal}
                      />
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

// @ts-ignore // TODO: Remove this and fix the errors
MerchantSettings = reduxForm({
  form: FormNames.FORM_MERCHANT_SETTINGS,
  enableReinitialize: true,
})(MerchantSettings);

export default MerchantSettings;
