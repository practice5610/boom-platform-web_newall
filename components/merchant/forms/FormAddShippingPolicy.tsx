import { AllOptionalExceptFor, BoomUser, ShippingPolicy, toMoney } from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import React, { FC, ReactElement } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  ModalFooter,
  FormText,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { createShippingPolicy } from '../../../redux/actions/shipping';
import { AppState } from '../../../redux/reducers';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  createShippingPolicy?: typeof createShippingPolicy;
  togglePolicy: () => void;
}

interface IFormInputs {
  name: string;
  flatRate: string;
  itemsPerFlatRate: string;
  // freeShippingThresholds: FreeShippingThreshold[];
  pickUpOnly: string;
  pickUpLocations: string;
}

const FormAddShippingPolicy: FC<Props> = ({
  user,
  createShippingPolicy,
  togglePolicy,
}): ReactElement => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({ criteriaMode: 'all' });

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
    if (!user) {
      alert('Log in again, not user logged');
      return;
    }

    const newPolicy: ShippingPolicy = {
      name: data.name,
      merchantId: user.uid,
      flatRate: toMoney(data.flatRate),
      itemsPerFlatRate: parseInt(data.itemsPerFlatRate),
      freeShippingThresholds: [],
      pickUpOnly: data.pickUpOnly === 'on' ? true : false,
      pickUpLocations: ['Lahore'],
    };
    createShippingPolicy?.(newPolicy);
    togglePolicy();
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
  console.log(user?.addresses);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <h4>
            Add New Shipping Policy
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
                <p>In this section, you must add information about your shipping policy.</p>
              </ReactTooltip>
            </span>
          </h4>
        </FormGroup>
        <FormGroup>
          <Label for='name'>Policy Name</Label>
          <Controller
            control={control}
            name='name'
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
            render={({ field }) => <Input {...field} name='name' type='text' />}
          />
          {_renderErrorMessage('name')}
        </FormGroup>
        <FormGroup>
          <Label for='flatRate'>Flat Rate</Label>
          <Controller
            control={control}
            name='flatRate'
            rules={{
              required: '⚠ This input is required.',
              min: {
                value: 0,
                message: '⚠ This input minimum length of 0.',
              },
            }}
            render={({ field }) => <Input {...field} name='flatRate' type='number' />}
          />
          {_renderErrorMessage('flatRate')}
        </FormGroup>
        <FormGroup>
          <Label for='itemsPerFlatRate'>Items per flat rate</Label>
          <Controller
            control={control}
            name='itemsPerFlatRate'
            rules={{
              required: '⚠ This input is required.',
              min: {
                value: 0,
                message: '⚠ This input minimum length of 0.',
              },
            }}
            render={({ field }) => <Input {...field} name='flatRate' type='number' />}
          />
          {_renderErrorMessage('itemsPerFlatRate')}
        </FormGroup>
        <FormGroup>
          <Label>
            <Input
              type='checkbox'
              {...register('pickUpOnly', {})}
              name='pickUpOnly'
              id='pickUpOnly'
              placeholder='...'
            />{' '}
            Only for Pickup
          </Label>
          {_renderErrorMessage('pickUpOnly')}
        </FormGroup>
        <FormGroup>
          <Label for='pickUpLocations'>Select Pickup Locations</Label>
          <Input
            {...register('pickUpLocations', {})}
            type='select'
            name='pickUpLocations'
            id='pickUpLocations'
            multiple
          >
            {user?.addresses?.map((address, index) => (
              <option key={index + ` ${address.number}`} value={address.city}>
                {address.city}
              </option>
            ))}
          </Input>
        </FormGroup>

        <ModalFooter className='bt-0'>
          <Button>Add new policy</Button>
        </ModalFooter>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormAddShippingPolicy);
