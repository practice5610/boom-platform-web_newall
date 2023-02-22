import {
  AllOptionalExceptFor,
  BoomUser,
  Offer,
  PriceRegex,
  Product,
  toMoney,
} from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import moment from 'moment';
import Image from 'next/image';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Button, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestCreateOffer, requestEditOffers } from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';
import { replaceDomain } from '../../../utils/images';

interface Props {
  selectedProduct?: Product;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  handleModal: () => void;
  requestCreateOffer?: typeof requestCreateOffer;
  requestEditOffers?: typeof requestEditOffers;
  editMode?: boolean;
  selectedOffer?: Offer;
}

interface IFormInputs {
  title: string;
  maxVisit: string;
  maxQty: string;
  activeDate: string;
  expiredDate: string;
  description: string;
  cashback: string;
}

const FormAddOffer: FC<Props> = ({
  selectedProduct,
  user,
  handleModal,
  requestCreateOffer,
  requestEditOffers,
  editMode,
  selectedOffer,
}): ReactElement => {
  const [conditions, setConditions] = useState(new Set(''));
  const [newCondition, setNewCondition] = useState('');
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IFormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      title: editMode ? selectedOffer?.title : '',
      description: editMode ? selectedOffer?.description : '',
      activeDate: editMode ? moment.unix(selectedOffer?.createdAt).toDate() : undefined,
      expiredDate: editMode ? moment.unix(selectedOffer?.expiration).toDate() : '',
      cashback: editMode ? selectedOffer?.cashBackPerVisit?.amount : '',
      maxVisit: editMode ? selectedOffer?.maxVisits : '',
      maxQty: editMode ? selectedOffer?.maxQuantity : '',
    },
  });

  useEffect(() => {
    if (editMode && selectedOffer) {
      setConditions(selectedOffer?.conditions);
    }
  }, []);

  const onSubmit = (data: IFormInputs) => {
    if (user) {
      let getId;
      if (selectedOffer) {
        getId = selectedOffer?._id;
      } else {
        getId = selectedProduct?._id;
      }
      const offer: Offer = {
        cashBackPerVisit: toMoney(data.cashback),
        conditions: Array.from(conditions),
        description: data.description,
        maxQuantity: parseInt(data.maxQty),
        maxVisits: parseInt(data.maxVisit),
        startDate: moment(data.activeDate).unix(),
        expiration: moment(data.expiredDate).unix(),
        title: data.title,
        product: selectedProduct,
        merchantUID: user.uid,
        _id: getId,
      };
      if (editMode) {
        requestEditOffers?.(offer);
      } else {
        requestCreateOffer?.(offer);
      }
    }
    handleModal?.();
  };

  const onAddCondition = () => {
    if (newCondition.trim() !== '') {
      setConditions((oldValue) => {
        const newConditions = new Set(oldValue);
        newConditions.add(newCondition.trim());
        return newConditions;
      });
      setNewCondition('');
    }
  };
  const onRemoveCondition = (item) => {
    setConditions((oldValue) => {
      const newConditions = new Set(oldValue);
      newConditions.delete(item);
      return newConditions;
    });
  };

  const onNewConditionChange = (e) => {
    setNewCondition(e.currentTarget.value);
  };

  const _getConditions = () => {
    const items: any[] = [];
    conditions.forEach((condition) => {
      if (typeof condition === 'string') {
        items.push(
          <InputGroup key={condition}>
            <span className='form-control'>{condition}</span>
            <Button
              type='button'
              className='close p-2'
              aria-label='Close'
              onClick={() => onRemoveCondition(condition)}
            >
              <span aria-hidden='true'> x </span>
            </Button>
          </InputGroup>
        );
      }
    });

    return items;
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

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='px-4'>
      <Row form className='d-flex justify-content-between sticky-top bg-white pb-2 px-2'>
        <h4>
          Add New Offer
          <span className='question-icon'>
            <a className='ml-1' data-tip data-for='add-offer-help' data-event='click'>
              <img src='/images/icons8-help-20.png' alt='help icon' />
            </a>
            <ReactTooltip
              id='add-offer-help'
              place='right'
              effect='solid'
              clickable={true}
              border={true}
              type='light'
            >
              <p>In this section, you must add information about your offer.</p>
            </ReactTooltip>
          </span>
        </h4>
        <Button type='submit' className='bg-dark mr-4'>
          Add Offer
        </Button>
      </Row>
      <Row>
        <small className='mx-4 mb-5 text-muted'>
          {`Only for product: ${editMode ? selectedOffer?.product.name : selectedProduct?.name}`}
        </small>
      </Row>
      <Row form>
        <Col xl={5} className='pr-4'>
          <FormGroup>
            <Label for='title'>Title</Label>
            <Controller
              control={control}
              name='title'
              rules={{
                required: '⚠ This input is required.',
                minLength: {
                  value: 2,
                  message: '⚠ This input must have at least 2 characters.',
                },
                maxLength: {
                  value: 80,
                  message: '⚠ This input must have less than 80 characters.',
                },
              }}
              render={({ field }) => <Input {...field} name='title' type='text' />}
            />

            {_renderErrorMessage('title')}
          </FormGroup>
          <FormGroup>
            <Label for='description'>Description</Label>
            <Controller
              control={control}
              name='description'
              rules={{
                required: '⚠ This input is required.',
                minLength: {
                  value: 2,
                  message: '⚠ This input must have at least 2 characters.',
                },
                maxLength: {
                  value: 80,
                  message: '⚠ This input must have less than 80 characters.',
                },
              }}
              render={({ field }) => <Input {...field} name='description' type='textarea' />}
            />

            {_renderErrorMessage('description')}
          </FormGroup>
          <FormGroup>
            <Label>Conditions</Label>
            {_getConditions()}
            <InputGroup>
              <Input
                type='text'
                autoComplete='off'
                placeholder='Condition'
                onChange={(e) => onNewConditionChange(e)}
                value={newCondition}
                pattern='^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$'
              />
              <Button className='bg-dark' onClick={onAddCondition}>
                Add Condition
              </Button>
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xl={4}>
          <FormGroup>
            <Label for='activeDate'>Activation Date</Label>
            <Controller
              control={control}
              name='activeDate'
              render={({ field }) => (
                <InputGroup className='justify-content-start align-items-center w-100'>
                  <i id='calendar' className='fa fa-calendar p-2' />
                  <DatePicker
                    popperPlacement='bottom-start'
                    placeholderText='Select date'
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={60}
                    timeCaption='time'
                    dateFormat='MM-dd-yyyy h:mm'
                    isClearable
                    className={'form-control'}
                  />
                </InputGroup>
              )}
              rules={{ required: '⚠ This input is required.' }}
            />
            {_renderErrorMessage('activeDate')}
          </FormGroup>
          <FormGroup>
            <Controller
              control={control}
              name='expiredDate'
              render={({ field }) => (
                <FormGroup>
                  <Label for='expiredDate'>Expiration Date</Label>
                  <InputGroup className='justify-content-start align-items-center'>
                    <i id='calendar' className='fa fa-calendar p-2' />
                    <DatePicker
                      popperPlacement='right-start'
                      placeholderText='Select date'
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      showTimeSelect
                      timeFormat='HH:mm'
                      timeIntervals={60}
                      timeCaption='time'
                      dateFormat='MM-dd-yyyy h:mm'
                      isClearable
                      className={'form-control'}
                    />
                  </InputGroup>
                </FormGroup>
              )}
              rules={{ required: '⚠ This input is required.' }}
            />
            {_renderErrorMessage('expiredDate')}
          </FormGroup>
          <FormGroup>
            <Label for='cashback'>Cashback</Label>
            <Controller
              control={control}
              name='cashback'
              rules={{
                required: '⚠ This input is required.',
                pattern: {
                  value: PriceRegex,
                  message: '⚠ Invalid format. try 00.00',
                },
              }}
              render={({ field }) => <Input {...field} name='cashback' type='number' />}
            />
            {_renderErrorMessage('cashback')}
          </FormGroup>
          <FormGroup>
            <Label for='maxVisit'>Max Visit</Label>
            <Controller
              control={control}
              name='maxVisit'
              rules={{
                required: '⚠ This input is required.',
              }}
              render={({ field }) => <Input {...field} name='maxVisit' type='number' />}
            />

            {_renderErrorMessage('maxVisit')}
          </FormGroup>
          <FormGroup>
            <Label for='maxQty'>Max Quantity</Label>
            <Controller
              control={control}
              name='maxQty'
              rules={{
                required: '⚠ This input is required.',
              }}
              render={({ field }) => <Input {...field} name='maxQty' type='number' />}
            />

            {_renderErrorMessage('maxQty')}
          </FormGroup>
        </Col>
        <Col xl={3}>
          <Image
            src={
              !editMode && selectedProduct?.imageUrl?.includes('http')
                ? replaceDomain(selectedProduct.imageUrl)
                : editMode && selectedOffer?.product?.imageUrl?.includes('http')
                ? replaceDomain(selectedOffer?.product?.imageUrl)
                : 'https://via.placeholder.com/100'
            }
            alt='Picture of the product'
            layout='fill'
            objectFit='contain'
            className='px-4 '
          />
        </Col>
      </Row>
      <br />
      <br />
    </Form>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormAddOffer);
