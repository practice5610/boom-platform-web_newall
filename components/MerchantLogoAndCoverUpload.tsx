import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import { Field, Form, reduxForm } from 'redux-form';

import { FormNames } from '../constants';
import { replaceDomain } from '../utils/images';

const adaptFileEventToValue = (delegate) => (e) => delegate(e.target.files[0]);

const FileInput = ({ input: { onChange, onBlur }, meta: omitMeta, ...props }) => {
  return (
    <input
      onChange={adaptFileEventToValue(onChange)}
      onBlur={adaptFileEventToValue(onBlur)}
      type='file'
      {...props.input}
      {...props}
    />
  );
};

let MerchantLogoAndCoverUpload = (props) => {
  const { handleSubmit, companyLogoUrl, coverImageUrl, setImageData, setCoverImageData } = props;
  const [imageUrl, setImageUrl] = useState({ file: '' });
  const [bannerImageUrl, setBannerImageUrl] = useState({ file: '' });

  const chooseImage = (evt, imageType) => {
    evt.preventDefault();
    const el = document.getElementById(imageType);
    el!.click();
  };

  const imageUpload = (file, type) => {
    if (type === 'banner') {
      setBannerImageUrl({ file: URL.createObjectURL(file) });
      setCoverImageData(file);
    } else if (type === 'company') {
      setImageUrl({ file: URL.createObjectURL(file) });
      setImageData(file);
    }
  };

  const getCompanyLogo = (image) => {
    const tempImageUrl = `${image}?width=300&height=300`;
    return tempImageUrl;
  };

  const getCompanyCover = (image) => {
    const tempImageUrl = `${image}?width=1440&height=403`;
    return tempImageUrl;
  };

  return (
    <div className='upload-images'>
      <Form onSubmit={handleSubmit(imageUpload)}>
        <Row>
          <Col lg={12}>
            <Row>
              <Col md={3} />
              <Col md={6}>
                <div className='form-profile-container d-flex align-items-center justify-content-center '>
                  <img
                    alt='company logo'
                    style={{ height: '168px', width: '186px', borderRadius: '90px' }}
                    height={300}
                    width={300}
                    src={
                      imageUrl.file
                        ? imageUrl.file
                        : replaceDomain(companyLogoUrl)
                        ? replaceDomain(getCompanyLogo(companyLogoUrl))
                        : 'https://via.placeholder.com/300x300'
                    }
                  />
                </div>
              </Col>
              <Col md={3} />
            </Row>
            <Row>
              <Col md={4} />
              <Col md={4}>
                <div className='company-logo d-flex align-items-center justify-content-center'>
                  <button
                    type='submit'
                    className='upload-btn'
                    style={{ marginTop: '15px' }}
                    onClick={(evt) => chooseImage(evt, 'companyImage')}
                  >
                    Upload Company Logo
                  </button>
                </div>
                <Field
                  name='file'
                  component={FileInput}
                  type='file'
                  style={{ opacity: '0' }}
                  id='companyImage'
                  onChange={(evt) => imageUpload(evt, 'company')}
                />
              </Col>
              <Col md={4} />
            </Row>
            <Row>
              <Col md={12}>
                <div className='form-profile-container d-flex align-items-center justify-content-center '>
                  <img
                    alt='company cover'
                    style={{ height: '283px', width: '500px', borderRadius: '15px' }}
                    height={403}
                    width={1440}
                    src={
                      bannerImageUrl.file
                        ? bannerImageUrl.file
                        : replaceDomain(coverImageUrl)
                        ? getCompanyCover(replaceDomain(coverImageUrl))
                        : 'https://via.placeholder.com/1440x403'
                    }
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={4} />
              <Col md={4}>
                <div className='company-logo d-flex align-items-center justify-content-center'>
                  <button
                    type='submit'
                    className='upload-btn'
                    style={{ marginTop: '15px' }}
                    onClick={(evt) => chooseImage(evt, 'bannerImage')}
                  >
                    Upload Banner Image
                  </button>
                </div>
                <Field
                  name='file'
                  component={FileInput}
                  type='file'
                  style={{ opacity: '0' }}
                  id='bannerImage'
                  onChange={(evt) => imageUpload(evt, 'banner')}
                />
              </Col>
              <Col md={4} />
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

// @ts-ignore // TODO: Remove this and fix the errors
MerchantLogoAndCoverUpload = reduxForm({
  form: FormNames.FORM_MERCHANT_IMAGE_UPLOAD,
})(MerchantLogoAndCoverUpload);

export default MerchantLogoAndCoverUpload;
