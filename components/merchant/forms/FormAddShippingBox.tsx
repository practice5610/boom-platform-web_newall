import { AllOptionalExceptFor, BoomUser, DistanceUnit, ShippingBox } from '@boom-platform/globals';
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
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { createShippingBox } from '../../../redux/actions/shipping';
import { AppState } from '../../../redux/reducers';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  createShippingBox?: typeof createShippingBox;
  toggleBox: () => void;
}

interface IFormInputs {
  phone: string;
  name: string;
  // unit: "in",
  length: string;
  width: string;
  height: string;
}

const FormAddShippingBox: FC<Props> = ({ user, createShippingBox, toggleBox }): ReactElement => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({ criteriaMode: 'all' });

  const onSubmit = (data: IFormInputs) => {
    if (!user) {
      alert('Log in again, not user logged');
      return;
    }

    const newBox: ShippingBox = {
      name: data.name,
      merchantId: user.uid,
      unit: DistanceUnit.INCH,
      length: parseInt(data.length),
      width: parseInt(data.width),
      height: parseInt(data.height),
    };
    createShippingBox?.(newBox);
    toggleBox();
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
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <h4>
            Add New Shipping Box
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
                <p>In this section, you must add information about your shipping box.</p>
              </ReactTooltip>
            </span>
          </h4>
        </FormGroup>
        <FormGroup>
          <Label for='name'>Box Name</Label>
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
          <Label for='length'>Length</Label>
          <Controller
            control={control}
            name='length'
            rules={{
              required: '⚠ This input is required.',
              min: {
                value: 0,
                message: '⚠ This input minimum length of 0.',
              },
            }}
            render={({ field }) => <Input {...field} name='length' type='number' />}
          />
          {_renderErrorMessage('length')}
        </FormGroup>

        <FormGroup>
          <Label for='width'>Width</Label>
          <Controller
            control={control}
            name='width'
            rules={{
              required: '⚠ This input is required.',
              min: {
                value: 0,
                message: '⚠ This input minimum width of 0.',
              },
            }}
            render={({ field }) => <Input {...field} name='width' type='number' />}
          />
          {_renderErrorMessage('width')}
        </FormGroup>

        <FormGroup>
          <Label for='height'>Height</Label>
          <Controller
            control={control}
            name='height'
            rules={{
              required: '⚠ This input is required.',
              min: {
                value: 0,
                message: '⚠ This input minimum height of 0.',
              },
            }}
            render={({ field }) => <Input {...field} name='height' type='number' />}
          />
          {_renderErrorMessage('height')}
        </FormGroup>

        <ModalFooter className='bt-0'>
          <Button>Add new Box</Button>
        </ModalFooter>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormAddShippingBox);
