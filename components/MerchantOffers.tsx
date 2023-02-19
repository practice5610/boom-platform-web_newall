import {
  AllOptionalExceptFor,
  BoomUser,
  fromMoney,
  Offer,
  Product,
  toMoney,
} from '@boom-platform/globals';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import {
  Button,
  ButtonDropdown,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { requestOffers, requestProducts } from '../redux/actions/account-merchant';
import { createProductAndOffer } from '../redux/actions/account-merchant';
import { requestStoreTypes } from '../redux/actions/stores';
import { AppState } from '../redux/reducers';
import { StoreConfigState } from '../redux/reducers/stores';
import { replaceDomain } from '../utils/images';
import InputCheckBox from './InputCheckbox';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  storeConfig?: StoreConfigState;
  requestStoreTypes?: typeof requestStoreTypes;
  requestProducts?: typeof requestProducts;
  requestOffers?: typeof requestOffers;
  createProductAndOffer?: typeof createProductAndOffer;
  products?: Product[];
  toggleModal;
  isOfferModalOpen;
}
const MerchantOffers: FunctionComponent<Props> = ({
  storeConfig,
  requestStoreTypes,
  user,
  requestProducts,
  products,
  createProductAndOffer,
  toggleModal,
  isOfferModalOpen,
}) => {
  const [dropOfferIsOpen, setDropOfferIsOpen] = useState(false);
  const [dropProductIsOpen, setDropProductIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [cashback, setCashBack] = useState('');
  const [mquantity, setMaxQuantity] = useState('');
  const [mvisits, setMaxVisits] = useState('');
  const [desc, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [conditions, setConditions] = useState(new Set(''));
  const [newCondition, setNewCondition] = useState('');
  const [actdate, setActDate] = useState('');
  const [expdate, setExpDate] = useState('');
  useEffect(() => {
    requestStoreTypes?.();
    requestProducts?.();
  }, []);

  const closeModal = () => {
    setName('');
    setCategory('');
    setCashBack('');
    setActDate('');
    setExpDate('');
    setMaxVisits('');
    setMaxQuantity('');
    setDescription('');
    setConditions(new Set(''));
    setDropOfferIsOpen(false);
    setDropProductIsOpen(false);
    toggleModal();
  };

  const onactdateChange = (date) => {
    setActDate(moment(date).format('MM/DD/YYYY'));
  };
  const onexpdateChange = (date) => {
    setExpDate(moment(date).format('MM/DD/YYYY'));
  };
  const onactdatetxtChange = (e) => {
    setActDate(e.target.value);
  };
  const onexpdatetxtChange = (e) => {
    setExpDate(e.target.value);
  };
  const onAddOffer = () => {
    const moffer: Offer = {} as Offer;
    moffer.title = name;
    moffer.maxVisits = parseInt(mvisits, 10);
    moffer.maxQuantity = parseInt(mquantity, 10);
    moffer.description = desc;
    moffer.conditions = [...conditions];
    moffer.cashBackPerVisit = toMoney(cashback);
    moffer.startDate = moment(actdate).unix();
    moffer.expiration = moment(expdate).unix();
    moffer.merchantUID = user?.uid;
    if (!product) return;
    createProductAndOffer?.(product, moffer, true);
    setName('');
    setCashBack('');
    setCategory('');
    setMaxVisits('');
    setMaxQuantity('');
    setDescription('');
    setConditions(new Set());
    setProduct(undefined);
    setActDate('');
    setExpDate('');
    closeModal();
  };
  const onCategory_Click = (value) => (event) => {
    setCategory(value);
  };
  const onProductSelected = (productSelected) => {
    setProduct(productSelected);
  };
  const onAddCondition = () => {
    setConditions((oldValue) => {
      const newConditions = new Set(oldValue);
      newConditions.add(newCondition);
      return newConditions;
    });
    setNewCondition('');
  };
  const onRemoveCondition = (item) => {
    setConditions((oldValue) => {
      const newConditions = new Set(oldValue);
      newConditions.delete(item);
      return newConditions;
    });
  };
  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onCashChange = (e) => {
    if (e.target.validity.valid) setCashBack(e.target.value);
  };

  const onMaxQuantityChange = (e) => {
    if (e.target.validity.valid) setMaxQuantity(e.target.value);
  };
  const onMaxVisitsChange = (e) => {
    if (e.target.validity.valid) setMaxVisits(e.target.value);
  };
  const onDescChange = (e) => {
    setDescription(e.target.value);
  };
  const onNewConditionChange = (e) => {
    setNewCondition(e.currentTarget.value);
  };
  const _getConditions = () => {
    const items: any[] = [];
    conditions.forEach((condition) => {
      if (typeof condition === 'string') {
        items.push(
          <div className='merchant-offers-condition-container' key={condition}>
            <span className='merchant-offers-condition'>{condition}</span>
            <Button
              className='bg-dark'
              style={{ fontSize: 'large' }}
              active
              onClick={() => onRemoveCondition(condition)}
            >
              Remove
            </Button>
          </div>
        );
      }
    });

    return items;
  };
  return (
    <Modal isOpen={isOfferModalOpen} toggle={closeModal} onOpened={requestProducts} size='lg'>
      <ModalHeader toggle={closeModal}>Add a New Offer</ModalHeader>
      <ModalBody>
        <div className='Merchant-Offers container'>
          <div className='merchant-add-offer justify-content-between'>
            <Form>
              <Input
                style={{ fontSize: '1.25rem' }}
                placeholder='Offer Name'
                onChange={onNameChange}
                value={name}
                maxLength={80}
              />

              <ButtonDropdown className='maxQuan-btn'>
                <Dropdown
                  isOpen={dropOfferIsOpen}
                  toggle={() => setDropOfferIsOpen(!dropOfferIsOpen)}
                >
                  <DropdownToggle caret style={{ fontSize: 'large' }}>
                    {category.length === 0 ? (
                      <span>Offer Category</span>
                    ) : (
                      <span style={{ color: '#ffff' }}>{category}</span>
                    )}
                  </DropdownToggle>
                  <DropdownMenu
                    modifiers={{
                      setMaxHeight: {
                        enabled: true,
                        order: 890,
                        fn: (data) => {
                          return {
                            ...data,
                            styles: {
                              ...data.styles,
                              overflow: 'auto',
                              maxHeight: '100px',
                            },
                          };
                        },
                      },
                    }}
                  >
                    {storeConfig?.storeCategories.map((item, index) => (
                      <DropdownItem key={item._id} onClick={onCategory_Click(item.name)}>
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ButtonDropdown>
              <div className='number-red d-flex'>
                <span style={{ color: 'red', fontSize: '1.75rem', marginRight: '1px' }}>1</span>
                <Input
                  style={{ fontSize: '1.25rem' }}
                  placeholder='Offer Cash Back'
                  pattern='[0-9.]*'
                  onChange={onCashChange}
                  value={cashback}
                />
              </div>

              <div className='merchant-offer-content-form-add-row' style={{ display: 'none' }}>
                <button type='button' id='add1' className='merchant-offer-content-form-add'>
                  <img width='38' height='38' src='/images/add-symbol.svg' alt='Add' />
                </button>
                <label htmlFor='add1' className='merchant-offer-content-form-add-label'>
                  Add Offer Cash Back Level&nbsp;
                  <span>(Highest level is the starting cash back amount)</span>
                </label>
              </div>

              <div className='Search-field d-flex justify-content-between align-items-center'>
                <Input
                  style={{ fontSize: '1.25rem' }}
                  placeholder='Offer Activation Date'
                  value={actdate}
                  className='unstyled'
                  onChange={onactdatetxtChange}
                />
                <DatePicker
                  popperPlacement='right-start'
                  onChange={onactdateChange}
                  customInput={
                    <Button style={{ fontSize: 'larger' }}>
                      <i id='calendar' className='fa fa-calendar'></i>
                    </Button>
                  }
                />
              </div>
              <div className='Search-field d-flex justify-content-between align-items-center'>
                <Input
                  style={{ fontSize: '1.25rem' }}
                  placeholder='Offer Expiration Date'
                  value={expdate}
                  className='unstyled'
                  onChange={onexpdatetxtChange}
                />
                <DatePicker
                  popperPlacement='right-start'
                  onChange={onexpdateChange}
                  customInput={
                    <Button style={{ fontSize: 'larger' }}>
                      <i id='calendar' className='fa fa-calendar'></i>
                    </Button>
                  }
                />
              </div>

              <Input
                style={{ fontSize: '1.25rem' }}
                pattern='[0-9.]*'
                placeholder='Max Visits'
                onChange={onMaxVisitsChange}
                value={mvisits}
                maxLength={10}
              />
              <Input
                style={{ fontSize: '1.25rem' }}
                pattern='[0-9.]*'
                placeholder='Max Quantity'
                onChange={onMaxQuantityChange}
                value={mquantity}
                maxLength={10}
              />
              <Input
                type='textarea'
                name='text'
                id='exampleText'
                placeholder='Offer Description'
                style={{ height: 250, fontSize: '1.25rem' }}
                onChange={onDescChange}
                value={desc}
                maxLength={280}
              />
              {_getConditions()}
              <InputGroup>
                <Input
                  type='text'
                  autoComplete='off'
                  style={{ fontSize: '1.25rem' }}
                  placeholder='Condition'
                  onChange={(e) => onNewConditionChange(e)}
                  value={newCondition}
                />
                <Button style={{ fontSize: 'large' }} className='bg-dark' onClick={onAddCondition}>
                  Add Condition
                </Button>
              </InputGroup>
              <div className='checkbox-header'>
                <h5>
                  <br />
                  {products ? 'Select products' : 'No products'}
                </h5>
              </div>
              {products && (
                <ButtonDropdown className='maxQuan-btn'>
                  <Dropdown
                    isOpen={dropProductIsOpen}
                    toggle={() => setDropProductIsOpen(!dropProductIsOpen)}
                  >
                    <DropdownToggle caret style={{ fontSize: 'large' }}>
                      <span>{product?.name || 'Select Product'}</span>
                    </DropdownToggle>
                    <DropdownMenu
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                overflow: 'auto',
                                maxHeight: '100px',
                              },
                            };
                          },
                        },
                      }}
                    >
                      {products.map((item) => (
                        <DropdownItem key={item._id} onClick={() => onProductSelected(item)}>
                          {item.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </ButtonDropdown>
              )}

              <FormGroup style={{ display: 'none' }}>
                <div>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                      <InputCheckBox id='input-2' />
                      <div className='select-store d-flex align-items-center'>
                        <span>Store 1234567890</span>
                      </div>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </FormGroup>
              <br />
              {product && (
                <div className='form-profile-container d-flex align-items-center justify-content-center ml-0 '>
                  <div className='merchant-offers-profile-picture' style={{ height: 459 }}>
                    {!product.imageUrl && (
                      <div>
                        <h2>
                          UPLOAD
                          <br /> OFFER IMAGE
                        </h2>
                        <i className='fa fa-upload fa-5x'></i>
                        <br />
                        <span>
                          CLICK TO UPLOAD
                          <br />
                          600px x 600px
                        </span>
                      </div>
                    )}
                    {product.imageUrl && (
                      <img
                        width={459}
                        height={459}
                        src={replaceDomain(product.imageUrl)}
                        alt='Product'
                      />
                    )}

                    <div className=' merchant-offers-boxes'>
                      <div className='box-original-price d-flex align-items-center justify-content-center'>
                        <span>Original Price - {fromMoney(product.price)}</span>
                      </div>
                      <div className='box-cash-back d-flex align-items-center justify-content-center'>
                        <span>Cash Back Up To - ${cashback}</span>
                      </div>
                      <div className='box-exp-date d-flex align-items-center justify-content-center'>
                        <span>
                          Expiration Date {expdate ? `-${moment(expdate).format('DD/MM/YY')}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          </div>
        </div>
      </ModalBody>
      <ModalFooter style={{ borderTop: 0 }}>
        <Button
          style={{
            backgroundColor: '#D42C29',
            borderWidth: 0,
            borderRadius: 'unset',
          }}
          color='danger'
          size='lg'
          onClick={onAddOffer}
        >
          Add Offer
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  storeConfig: state.storesConfig,
  products: state.accountMerchant.products,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MerchantOffers);
