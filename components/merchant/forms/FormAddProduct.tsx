import {
  AllOptionalExceptFor,
  BoomUser,
  Category,
  MassUnit,
  PackageDetails,
  PriceRegex,
  Product,
  ShippingBox,
  ShippingPolicy,
  Store,
  toMoney,
} from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import Dinero from 'dinero.js';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Button, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import {
  createProductAndOffer,
  requestUpdateProduct,
} from '../../../redux/actions/account-merchant';
import { uploadImage } from '../../../redux/actions/image';
import { requestShippingBoxes, requestShippingPolicies } from '../../../redux/actions/shipping';
import { requestStoreTypes } from '../../../redux/actions/stores';
import { AppState } from '../../../redux/reducers';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  categories?: Category[];
  shippingPolicies?: ShippingPolicy[];
  shippingBoxes?: ShippingBox[];
  requestStoreTypes?: typeof requestStoreTypes;
  requestShippingBoxes?: typeof requestShippingBoxes;
  uploadImage?: typeof uploadImage;
  createProductAndOffer?: typeof createProductAndOffer;
  requestUpdateProduct?: typeof requestUpdateProduct;
  requestShippingPolicies?: typeof requestShippingPolicies;
  togglePolicy: () => void;
  toggleBox: () => void;
  handleModal: () => void;
  handleEditProductMode?: () => void;
  editMode?: boolean;
  selectedProduct?: Product;
}

interface IFormInputs {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  quantity: number;
  box: string;
  policy: string;
  weight: number;
  itemsPerBox: number;
}

let form_data;

const FormAddProduct: FC<Props> = ({
  user,
  categories,
  shippingPolicies,
  shippingBoxes,
  requestStoreTypes,
  uploadImage,
  createProductAndOffer,
  requestUpdateProduct,
  togglePolicy,
  toggleBox,
  handleModal,
  handleEditProductMode,
  requestShippingBoxes,
  requestShippingPolicies,
  editMode,
  selectedProduct,
}): ReactElement => {
  const selectedProductCategory = categories?.find((category) => {
    if (category._id === selectedProduct?.category?._id) return category;
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    selectedProductCategory
  );
  const [keys, setKeys] = useState(['']);
  const [values, setValues] = useState(['']);
  const [tags, setTags] = useState(['']);
  const [pimage, setPImage] = useState('');
  const fileUploader = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    requestStoreTypes?.();
    requestShippingBoxes?.();
    requestShippingPolicies?.();
    if (editMode && selectedProduct) {
      if (selectedProduct?.attributes) {
        setKeys(Object.keys(selectedProduct.attributes));
        setValues(Object.values(selectedProduct.attributes));
      }
      if (selectedProduct?._tags) setTags(selectedProduct._tags);
      if (selectedProduct.imageUrl) setPImage(selectedProduct.imageUrl);
    }

    return () => {
      if (editMode) handleEditProductMode?.();
    };
  }, []);

  const onSubmit = (data: IFormInputs) => {
    // debugger; // eslint-disable-line no-debugger
    if (user?.uid && user?.store?._id) {
      const mproduct: Product = { store: {}, price: {}, attributes: {}, category: {} } as Product;

      if (form_data) {
        const suffix = Math.random().toString(36).substring(7);
        const image_name = user.uid + '_' + suffix;
        mproduct.imageUrl = process.env.NEXT_PUBLIC_API_URL + '/images/' + image_name;
        uploadImage?.(form_data, image_name);
      }

      const shippingPolicy: ShippingPolicy = JSON.parse(data.policy);
      const shippingBox: ShippingBox = JSON.parse(data.box);

      const shippingPackage: PackageDetails = {
        weight: data.weight,
        massUnit: MassUnit.POUND,
        boxId: shippingBox._id ?? '',
        itemsPerBox: data.itemsPerBox,
        shipsFrom: user.store._id,
      };

      mproduct.name = data.name;
      mproduct.description = data.description;
      mproduct.shippingPolicy = shippingPolicy._id ?? '';
      mproduct.packageDetails = shippingPackage;
      mproduct.quantity = data.quantity;
      mproduct.attributes = makePairString(keys, values);
      mproduct.price = toMoney(data.price);

      if (mproduct.category && selectedCategory) {
        mproduct.category._id = selectedCategory._id;
        mproduct.category.name = selectedCategory.name;
        mproduct.category.subCategories = [data.subcategory];
      }

      mproduct.merchantUID = user.uid;

      if (user && user.store && user.firstName && user.lastName) {
        const d: Store = {
          _id: user.store._id,
          companyName: user.store.companyName,
          number: user.store.number,
          street1: user.store.street1,
          street2: user.store.street2,
          _geoloc: {
            lat: user.store._geoloc ? user.store._geoloc.lat : null,
            lng: user.store._geoloc ? user.store._geoloc.lng : null,
          },
          merchant: { uid: user.uid, firstName: user.firstName, lastName: user.lastName },
        } as Store;

        mproduct.store = d;
      }
      mproduct._tags = removeEmptyString(tags);
      if (editMode) {
        const updatedProduct = { ...mproduct, _id: selectedProduct?._id };
        const { merchantUID, ...rest } = updatedProduct;
        requestUpdateProduct?.(rest);
      } else {
        createProductAndOffer?.(mproduct, null);
      }
      handleModal?.();
    } else {
      handleModal?.();
    }
  };

  const handleSelectedCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(JSON.parse(event.target.value));
    clearErrors();
  };

  const onAddAttribute = () => {
    setKeys(keys.concat(''));
    setValues(values.concat(''));
  };

  const onRemoveAttribute = (index) => {
    const arrkeys = [...keys];
    const arrvalues = [...values];
    arrkeys.splice(index, 1);
    arrvalues.splice(index, 1);
    setKeys(arrkeys);
    setValues(arrvalues);
  };

  const onKeyChange = (e, index) => {
    const arrkeys = [...keys];
    arrkeys[index] = e.target.value;
    setKeys(arrkeys);
  };

  const onValueChange = (e, index) => {
    const arrvalues = [...values];
    arrvalues[index] = e.target.value;
    setValues(arrvalues);
  };

  const onAddTag = () => {
    setTags(tags.concat(''));
  };

  const onRemoveTag = (index) => {
    const arrtags = [...tags];
    arrtags.splice(index, 1);
    setTags(arrtags);
  };

  const onTagChange = (e, index) => {
    const arrtags = [...tags];
    arrtags[index] = e.target.value;
    setTags(arrtags);
  };

  const uploadImageChange = () => {
    fileUploader?.current?.click();
  };

  const changeImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPImage(URL.createObjectURL(event.target.files[0]));
      form_data = new FormData();
      form_data.append('file', event.target.files[0], event.target.files[0].name);
    }
  };

  const makePairString = (keys, values) => {
    const res = {};
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].length !== 0 || values[i].length !== 0) res[keys[i]] = values[i];
    }
    return res;
  };

  const removeEmptyString = (str) => {
    const res = [] as string[];
    for (let i = 0; i < str.length; i++)
      if (str[i].length !== 0) {
        res.push(str[i]);
      }
    return res;
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

  const selectedProductShippingBox = shippingBoxes?.find((box) => {
    if (box._id === selectedProduct?.packageDetails?.boxId) return box;
  });
  const selectedProductShippingPolicy = shippingPolicies?.find((policy) => {
    if (policy._id === selectedProduct?.shippingPolicy) return policy;
  });

  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm<IFormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      name: editMode ? selectedProduct?.name : undefined,
      category: editMode ? JSON.stringify(selectedProductCategory) : '',
      subcategory: editMode ? selectedProduct?.category?.subCategories?.[0] : '',
      description: editMode ? selectedProduct?.description : '',
      price: editMode ? Dinero(selectedProduct?.price).toUnit() ?? undefined : undefined,
      quantity: editMode ? selectedProduct?.quantity : undefined,
      box: editMode && selectedProductShippingBox ? JSON.stringify(selectedProductShippingBox) : '',
      policy:
        editMode && selectedProductShippingPolicy
          ? JSON.stringify(selectedProductShippingPolicy)
          : '',
      weight:
        editMode && selectedProduct?.packageDetails?.weight
          ? selectedProduct.packageDetails.weight
          : undefined,
      itemsPerBox:
        editMode && selectedProduct?.packageDetails?.itemsPerBox
          ? selectedProduct.packageDetails.itemsPerBox
          : undefined,
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row form className='d-flex justify-content-between sticky-top bg-white pb-2 px-2'>
        <h4>
          Add New Product
          <span className='question-icon'>
            <a className='ml-1' data-tip data-for='add-product-help' data-event='click'>
              <img src='/images/icons8-help-20.png' alt='help icon' />
            </a>
            <ReactTooltip
              id='add-product-help'
              place='right'
              effect='solid'
              clickable={true}
              border={true}
              type='light'
            >
              <p>In this section, you must add information about your product.</p>
            </ReactTooltip>
          </span>
        </h4>

        {editMode ? (
          <Button type='submit' className='bg-dark mr-4'>
            Save Changes
          </Button>
        ) : (
          <Button type='submit' className='bg-dark mr-4'>
            Add Product
          </Button>
        )}
      </Row>
      <br></br>
      <Row form>
        <Col md={4}>
          <div
            className='form-profile-container d-flex align-items-center justify-content-center ml-0 '
            onClick={uploadImageChange}
          >
            <input
              type='file'
              id='file'
              ref={fileUploader}
              style={{ display: 'none' }}
              onChange={changeImage}
              alt='Profile'
            />
            <div
              className='merchant-offers-profile-picture'
              style={{ cursor: 'pointer', width: 300, height: 300 }}
            >
              {pimage.length === 0 ? (
                <div>
                  <h4>
                    UPLOAD
                    <br /> PRODUCT IMAGE
                  </h4>
                  <i className='fa fa-upload fa-5x'></i>
                  <br />
                  <span>
                    CLICK TO UPLOAD
                    <br />
                    600px x 600px
                  </span>
                  <br />
                </div>
              ) : (
                <img width={300} height={300} src={pimage} alt='Profile' />
              )}
            </div>
          </div>
        </Col>
        <Col md={4}>
          <Label for='name'>Product Name</Label>
          <input
            {...register('name', {
              required: '⚠ This input is required.',
              minLength: {
                value: 2,
                message: '⚠ This input must have at least 2 characters.',
              },
              maxLength: {
                value: 80,
                message: '⚠ This input must have less than 80 characters.',
              },
            })}
            className='form-control'
            name='name'
            id='name'
            placeholder='...'
          />
          {_renderErrorMessage('name')}
          <br />
          <Row form>
            <Col sm={6}>
              <Label for='price'>Product Price</Label>
              <input
                {...register('price', {
                  valueAsNumber: true,
                  required: '⚠ This input is required.',
                  pattern: {
                    value: PriceRegex,
                    message: '⚠ Invalid format. try 00.00',
                  },
                })}
                className='form-control'
                name='price'
                id='price'
                type='number'
                placeholder='...'
              />
              {_renderErrorMessage('price')}
            </Col>
            <Col sm={6}>
              <Label for='quantity'>Quantity Available</Label>
              <input
                {...register('quantity', {
                  required: '⚠ This input is required.',
                  valueAsNumber: true,
                })}
                className='form-control'
                name='quantity'
                id='quantity'
                type='number'
                placeholder='...'
              />
              {_renderErrorMessage('quantity')}
            </Col>
          </Row>
          <br />
          {categories?.length ? (
            <>
              <br></br>
              <Label for='category'>Product Category</Label>
              <select
                {...register('category', {
                  required: '⚠ This input is required.',
                })}
                className='form-control'
                name='category'
                id='category'
                onChange={handleSelectedCategory}
              >
                <option disabled={true} value=''>
                  -- Select a Category --
                </option>
                {categories.map((category, index) => (
                  <option key={JSON.stringify(category._id)} value={JSON.stringify(category)}>
                    {category.name}
                  </option>
                ))}
              </select>
              {_renderErrorMessage('category')}
            </>
          ) : (
            <></>
          )}
          {selectedCategory?.subCategories?.length ? (
            <>
              <br />
              <Label for='subcategory'>Product Subcategory</Label>
              <select
                {...register('subcategory', {
                  required: '⚠ This input is required.',
                })}
                className='form-control'
                name='subcategory'
                id='subcategory'
              >
                <option disabled={true} value=''>
                  -- Select a Subcategory --
                </option>
                {selectedCategory.subCategories.map((subcategory, index) => (
                  <option key={index + ' ' + subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
              {_renderErrorMessage('subcategory')}
            </>
          ) : (
            <></>
          )}
          <br />
          <Label for='description'>Product Description</Label>
          <input
            {...register('description', {
              required: '⚠ This input is required.',
              minLength: {
                value: 2,
                message: '⚠ This input must have at least 2 characters.',
              },
              maxLength: {
                value: 80,
                message: '⚠ This input must have less than 80 characters.',
              },
            })}
            type='textarea'
            name='description'
            id='description'
            className='form-control flex-grow-1'
            placeholder='...'
          />
          {_renderErrorMessage('description')}
        </Col>
        <Col md={4} className='px-3'>
          <Row form className='mb-2'>
            <h5 className='w-100'>Attributes</h5>
            <h6 className='w-100 small text-muted'>
              Add attributes to help describe your product <br /> (e.g. key: Color, value: Red)
            </h6>
            {keys.map((item, index) => (
              <div key={index} className='w-100'>
                <InputGroup>
                  <Input
                    placeholder='Key...'
                    onChange={(e) => onKeyChange(e, index)}
                    value={keys[index]}
                    maxLength={80}
                  />
                  <Input
                    placeholder='Value...'
                    onChange={(e) => onValueChange(e, index)}
                    value={values[index]}
                    maxLength={80}
                  />

                  <Button
                    type='button'
                    className='close p-2'
                    aria-label='Close'
                    onClick={() => onRemoveAttribute(index)}
                  >
                    <span aria-hidden='true'> x </span>
                  </Button>
                </InputGroup>
                <span className='small text-muted'>
                  {' '}
                  these attributes will be publicly visible.
                </span>
              </div>
            ))}
            <FormGroup>
              <Button className='bg-dark' active onClick={onAddAttribute}>
                Add Attribute
              </Button>
            </FormGroup>
          </Row>
          <Row form className='my-2'>
            <h5 className='w-100'>Tags</h5>
            <h6 className='small text-muted'>Add tags to help your product be found on search</h6>
            {tags.map((item, index) => (
              <InputGroup key={index}>
                <Input
                  placeholder='Tag...'
                  onChange={(e) => onTagChange(e, index)}
                  value={tags[index]}
                  maxLength={80}
                />
                <Button
                  type='button'
                  className='close p-2'
                  aria-label='Close'
                  onClick={() => onRemoveTag(index)}
                >
                  <span aria-hidden='true'> x </span>
                </Button>
              </InputGroup>
            ))}
            <FormGroup>
              <Button className='bg-dark' onClick={onAddTag}>
                Add Tag
              </Button>
            </FormGroup>
          </Row>
        </Col>
        <Row className='w-100 my-4'>
          <Col md={6}>
            <Container fluid='md'>
              <Row form>
                <h5>Shipping Attributes </h5>
                <span className='question-icon'>
                  <a
                    className='ml-1'
                    data-tip
                    data-for='shipping-attributes-help'
                    data-event='click'
                  >
                    <img src='/images/icons8-help-20.png' alt='help icon' />
                  </a>
                  <ReactTooltip
                    id='shipping-attributes-help'
                    place='right'
                    effect='solid'
                    clickable={true}
                    border={true}
                    type='light'
                  >
                    <p>In this section, you must select a shipping method for your product.</p>
                  </ReactTooltip>
                </span>
              </Row>
              {shippingBoxes ? (
                <>
                  <br />
                  <Label for='box'>Shipping Boxes</Label>
                  <InputGroup>
                    <select
                      {...register('box', {
                        required: '⚠ This input is required.',
                      })}
                      id='box'
                      className='form-control'
                    >
                      <option disabled={true} value=''>
                        -- Select a Box --
                      </option>
                      {shippingBoxes.map((box) => (
                        <option key={box._id} value={JSON.stringify(box)}>
                          {box.name}
                        </option>
                      ))}
                    </select>
                    <Button className='bg-dark' active onClick={toggleBox}>
                      New Box
                    </Button>
                  </InputGroup>
                  {_renderErrorMessage('box')}
                  <Row form>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for='weight'>Weight</Label>
                        <input
                          {...register('weight', {
                            required: '⚠ This input is required.',
                            min: 0,
                          })}
                          name='weight'
                          id='weight'
                          type='number'
                          placeholder='...'
                          className='form-control'
                        />
                        {_renderErrorMessage('weight')}
                      </FormGroup>
                    </Col>
                    <Col sm={6}>
                      <FormGroup>
                        <Label for='itemsPerBox'>How many items per box ?</Label>
                        <input
                          {...register('itemsPerBox', {
                            required: '⚠ This input is required.',
                          })}
                          name='itemsPerBox'
                          id='itemsPerBox'
                          type='number'
                          placeholder='...'
                          className='form-control'
                        />
                        {_renderErrorMessage('itemsPerBox')}
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              ) : (
                <></>
              )}
            </Container>
          </Col>
          <Col md={6}>
            <Container fluid='md'>
              <Row form>
                <h5>Shipping Policy </h5>
                <span className='question-icon'>
                  <a className='ml-1' data-tip data-for='shipping-policy-help' data-event='click'>
                    <img src='/images/icons8-help-20.png' alt='help icon' />
                  </a>
                  <ReactTooltip
                    id='shipping-policy-help'
                    place='right'
                    effect='solid'
                    clickable={true}
                    border={true}
                    type='light'
                  >
                    <p>In this section, you must select a shipping policy for your product.</p>
                  </ReactTooltip>
                </span>
              </Row>
              {shippingPolicies ? (
                <>
                  <br />
                  <Label for='policy'>Shipping Policies</Label>
                  <InputGroup>
                    <select
                      {...register('policy', {
                        required: '⚠ This input is required.',
                      })}
                      id='policy'
                      className='form-control'
                    >
                      <option disabled={true} value=''>
                        -- Select a Policy --
                      </option>
                      {shippingPolicies.map((policy) => (
                        <option key={policy._id} value={JSON.stringify(policy)}>
                          {policy.name}
                        </option>
                      ))}
                    </select>
                    <Button className='bg-dark' active onClick={togglePolicy}>
                      New Policy
                    </Button>
                  </InputGroup>
                  {_renderErrorMessage('policy')}
                </>
              ) : (
                <></>
              )}
            </Container>
          </Col>
        </Row>
      </Row>
      <br></br>
    </Form>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  categories: state.storesConfig.storeCategories,
  shippingPolicies: state.shipping.shippingPolicies,
  shippingBoxes: state.shipping.shippingBoxes,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormAddProduct);
