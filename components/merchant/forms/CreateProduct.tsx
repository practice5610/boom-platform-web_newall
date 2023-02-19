import { AllOptionalExceptFor, BoomUser, Product, Store, toMoney } from '@boom-platform/globals';
import Ajv from 'ajv';
import { FromSchema } from 'json-schema-to-ts';
import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import {
  Button,
  ButtonDropdown,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { createProductAndOffer } from '../../../redux/actions/account-merchant';
import { requestProducts } from '../../../redux/actions/account-merchant';
import { uploadImage } from '../../../redux/actions/image';
import { requestStoreTypes } from '../../../redux/actions/stores';
import { AppState } from '../../../redux/reducers';
import { StoreConfigState } from '../../../redux/reducers/stores';
import { parseErrorSchema } from '../../../validation/parsers';
import { FormMerchantCreateProductSchema } from '../../../validation/schemas/FormMerchantCreateProduct';
interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  storeConfig?: StoreConfigState;
  requestStoreTypes?: typeof requestStoreTypes;
  uploadImage?: typeof uploadImage;
  requestProducts?: typeof requestProducts;
  createProductAndOffer?: typeof createProductAndOffer;
}

type useFormType = FromSchema<typeof FormMerchantCreateProductSchema>;

const ajv = new Ajv({ allErrors: true });

const useAjvValidationResolver = (validationSchema) =>
  useCallback(
    async (data: useFormType) => {
      const validate = ajv.compile(validationSchema);

      let valid: boolean = true;
      let errors;

      try {
        valid = await validate(data);

        if (!valid) {
          errors = { ...parseErrorSchema(validate.errors, true) };
        }
      } catch (e: any) {
        valid = false;
        errors = e;
      }
      return {
        values: valid ? data : {},
        errors,
      };
    },
    [validationSchema]
  );

let form_data;
const FormMerchantCreateProduct: FunctionComponent<Props> = ({
  storeConfig,
  requestStoreTypes,
  user,
  uploadImage,
  createProductAndOffer,
  requestProducts,
}) => {
  const resolver = useAjvValidationResolver(FormMerchantCreateProductSchema);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<useFormType>({
    defaultValues: {
      name: '',
      description: '',
      price: '0.00',
    },
    resolver,
    //criteriaMode: 'all',
    shouldFocusError: false,
  });

  const [dropProductIsOpen, setDropProductIsOpen] = useState(false);
  const [dropSubProductIsOpen, setSubDropProductIsOpen] = useState(false);

  const [pimage, setPImage] = useState('');
  const [category, setCategory] = useState('');
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [subcategory, setSubCategory] = useState('');
  const [tags, setTags] = useState(['']);
  const [keys, setKeys] = useState(['']);
  const [values, setValues] = useState(['']);
  const [categoryid, setCategoryId] = useState('');
  const fileUploader = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    requestStoreTypes?.();
    requestProducts?.();
  }, []);

  const uploadImageChange = () => {
    //@ts-ignore
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

  const _onSubmit = (data: useFormType) => {
    
    if (user?.uid) {
      const suffix = Math.random().toString(36).substring(7);
      const image_name = user.uid + '_' + suffix;

      if (form_data) {
        uploadImage?.(form_data, image_name);
      }

      const mproduct: Product = { store: {}, price: {}, attributes: {}, category: {} } as Product;

      mproduct.imageUrl = process.env.NEXT_PUBLIC_API_URL + '/images/' + image_name;
      mproduct.name = data.name;
      mproduct.description = data.description;

      mproduct.attributes = makePairString(keys, values);
      mproduct.price = toMoney(data.price);

      if (mproduct.category) {
        mproduct.category._id = categoryid;
        mproduct.category.name = category;
        mproduct.category.subCategories = [subcategory];
      }

      mproduct.merchantUID = user.uid;

      if (user && user.store && user.firstName && user.lastName) {
        const d: Store = {
          _id: user.store._id,
          companyName: user.store.companyName,
          number: user.store.number, // TODO: Review if we need to add street2
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
      createProductAndOffer?.(mproduct, null);
      requestProducts?.();
    } else {
      console.log('No user uid');
    }
  };
  const onCategory_Click = (e, value, index) => {
    setCategory(value);
    setCategoryIndex(index);

    if (storeConfig === undefined) return;

    if (index >= 0) {
      setSubCategory(storeConfig.storeCategories?.[index]?.subCategories?.[0] || ''); // TODO: Review this
      setCategoryId(storeConfig.storeCategories?.[index]?._id || '');
    }
  };
  const onSubCategory_Click = (e, value) => {
    setSubCategory(value);
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

  return (
    <div className='Merchant-Offers container p-0'>
      <div className='merchant-offers-header'>
        {' '}
        <h2>Add a new product</h2>{' '}
      </div>
      <div className='Form-edit-profile d-flex justify-content-between'>
        <Form onSubmit={handleSubmit(_onSubmit)}>
          <FormGroup>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input placeholder='Product Name' invalid={!!errors.name} {...field} />
              )}
            />
            <FormFeedback>{errors.name}</FormFeedback>
          </FormGroup>
          {
            // TODO: Validation should be added to these Dropdown buttons
          }
          <ButtonDropdown className='maxQuan-btn'>
            <Dropdown
              isOpen={dropProductIsOpen}
              toggle={() => setDropProductIsOpen(!dropProductIsOpen)}
            >
              <DropdownToggle caret>
                {category.length === 0 ? (
                  <span>Product Category</span>
                ) : (
                  <span style={{ color: '#212222' }}>{category}</span>
                )}
              </DropdownToggle>
              <DropdownMenu className='dropdown-menu' style={{ right: 0 }}>
                {storeConfig?.storeCategories &&
                  storeConfig.storeCategories.map((item, index) => (
                    <DropdownItem
                      key={item._id}
                      onClick={(e) => onCategory_Click(e, item.name, index)}
                    >
                      {item.name}
                      {}
                    </DropdownItem>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </ButtonDropdown>
          <ButtonDropdown className='maxQuan-btn'>
            <Dropdown
              isOpen={dropSubProductIsOpen}
              toggle={() => setSubDropProductIsOpen(!dropSubProductIsOpen)}
            >
              <DropdownToggle caret>
                {subcategory.length === 0 ? (
                  <span>Product Sub Category</span>
                ) : (
                  <span style={{ color: '#212222' }}>{subcategory}</span>
                )}
              </DropdownToggle>
              <DropdownMenu style={{ right: 0 }}>
                {categoryIndex > -1 &&
                  storeConfig?.storeCategories?.[categoryIndex]?.subCategories?.map(
                    (item, index) => (
                      <DropdownItem key={item} onClick={(e) => onSubCategory_Click(e, item)}>
                        {item}
                      </DropdownItem>
                    )
                  )}
              </DropdownMenu>
            </Dropdown>
          </ButtonDropdown>
          <FormGroup>
            <Controller
              name='price'
              control={control} //TODO: Ticket 746 should refactor this and create an input money component
              render={({ field }) => (
                <Input placeholder='Product Price' invalid={!!errors.price} {...field} />
              )}
            />
            <FormFeedback>{errors.price ?? 'This must be a price'}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <Input
                  type='textarea'
                  placeholder='Product Description'
                  style={{ height: 250 }}
                  invalid={!!errors.description}
                  {...field}
                />
              )}
            />
            <FormFeedback>{errors.description}</FormFeedback>
          </FormGroup>
          {
            // TODO: Remove button probably should only appear on the items added, and it is no clear if it is needed that tags created can be modified(generates a lot of re-renders)
          }
          <h5>Add tags to help your product be found on search</h5>{' '}
          {tags.map((item, index) => (
            <InputGroup key={index}>
              <Input
                placeholder='Tags'
                onChange={(e) => onTagChange(e, index)}
                value={tags[index]}
                maxLength={80}
              />
              <Button
                className='bg-dark'
                size='lg'
                style={{ height: 53 }}
                active
                onClick={() => onRemoveTag(index)}
              >
                Remove
              </Button>
            </InputGroup>
          ))}
          <FormGroup>
            <Button className='bg-dark' size='lg' onClick={onAddTag}>
              Add Tag
            </Button>
          </FormGroup>
          <h5>
            <br />
            Add attributes to help describe your product <br /> (e.g. key: SKU value: 11022 or key:
            Color, value: red)
          </h5>{' '}
          {keys.map((item, index) => (
            <div key={index}>
              <InputGroup>
                <Input
                  placeholder='Keys'
                  onChange={(e) => onKeyChange(e, index)}
                  value={keys[index]}
                  maxLength={80}
                />
                <Input
                  placeholder='Values'
                  onChange={(e) => onValueChange(e, index)}
                  value={values[index]}
                  maxLength={80}
                />
                <Button
                  className='bg-dark'
                  size='lg'
                  style={{ height: 53 }}
                  active
                  onClick={() => onRemoveAttribute(index)}
                >
                  Remove
                </Button>
              </InputGroup>
              <h5>These attributes will be publicly visible</h5>
            </div>
          ))}
          <FormGroup>
            <Button className='bg-dark' size='lg' active onClick={onAddAttribute}>
              Add Attribute
            </Button>
          </FormGroup>
          <br />
          <br />
          <FormGroup>
            <Button // TODO:do we need to use input or button(web\components\forms\customer\EditProfile.tsx) css is an issue here
              type='submit'
              style={{
                backgroundColor: '#D42C29',
                fontSize: 30,
                height: 70,
                borderWidth: 0,
                borderRadius: 'unset',
              }}
              color='danger'
              size='lg'
            >
              Add Product
            </Button>
          </FormGroup>
        </Form>
        {
          // TODO: This image uploader seems to be similar like the one on web\components\forms\customer\EditProfile.tsx see if we can reuse it
        }
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
          <div className='merchant-offers-profile-picture' style={{ cursor: 'pointer' }}>
            {pimage.length === 0 ? (
              <div>
                <h2>
                  UPLOAD
                  <br /> PRODUCT IMAGE
                </h2>
                <i className='fa fa-upload fa-5x'></i>
                <br />
                <span>
                  CLICK TO UPLOAD
                  <br />
                  600px x 600px
                </span>
                <div style={{ height: 38 }}></div>
              </div>
            ) : (
              <img width={459} height={459} src={pimage} alt='Profile' />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  storeConfig: state.storesConfig,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormMerchantCreateProduct);
