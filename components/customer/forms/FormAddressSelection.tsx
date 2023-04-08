import {
  AddressInfo,
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
import { Controller, useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Button, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestCreateOffer } from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';

interface Props {
  handleSetSelectedAddress: (address: AddressInfo) => void;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  handleModal: () => void;
  selectedAddress?: AddressInfo;
  requestCreateOffer?: typeof requestCreateOffer;
}

interface IFormInputs {
  address: string;
}

const FormAddressSelection: FC<Props> = ({
  handleSetSelectedAddress,
  selectedAddress,
  user,
  handleModal,
}): ReactElement => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IFormInputs>({ criteriaMode: 'all' });

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
    handleModal?.();
  };

  const handleSelectedAddress = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleSetSelectedAddress(JSON.parse(event.target.value));
    handleModal?.();
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
          Select Address
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
              <p>In this section, you must select information about your shipping address.</p>
            </ReactTooltip>
          </span>
        </h4>
        <Button type='submit' className='bg-dark mr-4'>
          Add New Address
        </Button>
      </Row>
      <Row>
        <small className='mx-4 mb-5 text-muted'>{`Selected shipping address: ${
          selectedAddress?.name ?? ''
        }`}</small>
      </Row>

      <>
        <Label for='category'>Address</Label>
        <select
          {...register('address', {
            required: '⚠ This input is required.',
          })}
          className='form-control'
          name='address'
          id='address'
          onChange={handleSelectedAddress}
        >
          <option disabled={true} value=''>
            -- Select Address --
          </option>
          {user?.addresses &&
            user?.addresses.map((address, index) => (
              <option key={JSON.stringify(address)} value={JSON.stringify(address)}>
                {address.name}
              </option>
            ))}
        </select>
        {_renderErrorMessage('address')}
      </>

      <br />
    </Form>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormAddressSelection);
