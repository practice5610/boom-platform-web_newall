import {
  AllOptionalExceptFor,
  BoomUser,
  Money,
  toMoney,
  Transaction,
} from '@boom-platform/globals';
import { ErrorMessage } from '@hookform/error-message';
import Dinero from 'dinero.js';
import React, { FC, ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Button, Container, Form, FormGroup, Input, Label, ModalFooter } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestWithdrawal } from '../../../redux/actions/transactions';
import { AppState } from '../../../redux/reducers';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  toggleBox: () => void;
  balanceAvailable: Money;
  requestWithdrawal?: typeof requestWithdrawal;
}

interface IFormInputs {
  amount: string;
}

const FormWithdrawalFunds: FC<Props> = ({
  user,
  toggleBox,
  balanceAvailable,
  requestWithdrawal,
}): ReactElement => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({ criteriaMode: 'all' });

  const onSubmit = (data: IFormInputs) => {
    if (user) {
      const transaction: AllOptionalExceptFor<Transaction, 'amount'> = {
        amount: toMoney(data.amount),
      };
      requestWithdrawal?.(transaction);
      toggleBox();
    }
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
            Withdrawal Funds
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
                <p>In this section, you must set the withdrawal amount.</p>
              </ReactTooltip>
            </span>
          </h4>
        </FormGroup>
        <FormGroup>
          <Label for='amount'>Withdrawal Amount</Label>
          <Input
            {...register('amount', {
              required: '⚠ This input is required.',
              max: {
                value: Dinero(balanceAvailable).toUnit(),
                message: '⚠ Not enough funds.',
              },
              min: {
                value: 100,
                message: '⚠ Must withdraw at least $100.',
              },
            })}
            name='amount'
            id='amount'
            placeholder='...'
          />
          {_renderErrorMessage('amount')}
        </FormGroup>

        <ModalFooter className='bt-0'>
          <Button>Withdraw</Button>
        </ModalFooter>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormWithdrawalFunds);
