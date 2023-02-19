import { Money, toMoney } from '@boom-platform/globals';
import React from 'react';
import InputMask from 'react-input-mask';
import { clearSubmitErrors, Field, reduxForm, reset, SubmissionError } from 'redux-form';

import { FormNames } from '../../constants';
import { TransactionsActionTypes } from '../../redux/actionTypes';
import { formatMoneyInput } from '../../utils/money';
import { isValidPhone } from '../../utils/phone';
import RenderIf from './../utils/RenderIf';

const FormSendFunds = (props) => {
  const { handleSubmit, pristine, reset, submitting, dispatch, error, apiError } = props;
  const onSubmitValidate = (values) => {
    if (
      values.receiverPhoneNumber === '' ||
      values.receiverPhoneNumber === undefined ||
      !isValidPhone(values.receiverPhoneNumber)
    ) {
      throw new SubmissionError({
        receiverPhoneNumber: 'Phone is incomplete',
        _error: 'Phone is incomplete',
      });
    } else if (values.amount === '' || values.amount === undefined) {
      throw new SubmissionError({
        amount: 'Amount is empty',
        _error: 'Amount is empty',
      });
    }
    const numberMoney = +values.amount.replace('$', '');
    if (isNaN(numberMoney) || numberMoney <= 0) {
      throw new SubmissionError({
        amount: 'Amount must be a number',
        _error: 'Amount must be a number',
      });
    }
    const money = toMoney(numberMoney);

    const phone = values.receiverPhoneNumber.replace(/\D/g, '');

    dispatch({
      type: TransactionsActionTypes.TRANSFER_REQUEST,
      payload: {
        transfer: {
          amount: money,
          notes: values.notes,
          receiverName: values.receiverName,
          receiverPhoneNumber: phone,
        },
      },
    });
    dispatch(clearSubmitErrors(FormNames.FORM_SEND_FUNDS));
    dispatch(reset(FormNames.FORM_SEND_FUNDS));
  };

  return (
    <form className='funds-content-form' onSubmit={handleSubmit(onSubmitValidate)}>
      <div>
        <div>
          <Field
            name='receiverName'
            component='input'
            type='text'
            className='funds-content-form-add-amount'
            placeholder='Reciever Name'
          />
        </div>
      </div>
      <div>
        <div>
          <Field
            name='receiverPhoneNumber'
            component={(props) => {
              return (
                <InputMask
                  mask='(999) 999-9999' //TODO: Ticket 746 should refactor this
                  value={props.value}
                  onChange={(event) => props.input.onChange(event.target.value)}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      name='phone'
                      id='phoneNumber'
                      type='tel'
                      className='funds-content-form-add-amount'
                      placeholder='Enter phone number'
                      component='input'
                    />
                  )}
                </InputMask>
              );
            }}
            type='tel'
            className='funds-content-form-add-amount'
            placeholder='Reciever Phone Number'
          />
        </div>
      </div>
      <div>
        <div>
          <Field
            name='amount'
            component='input'
            format={(value: string, name) => {
              return formatMoneyInput(value);
            }}
            type='text'
            className='funds-content-form-add-amount'
            placeholder='Amount'
          />
        </div>
      </div>
      <div>
        <div>
          <Field
            name='notes'
            component='input'
            type='text'
            className='funds-content-form-add-amount'
            placeholder='Notes'
          />
        </div>
      </div>

      <RenderIf condition={!!error || !!apiError}>
        <strong>{error || apiError}</strong>
      </RenderIf>

      <div>
        <button
          className='funds-content-form-funds'
          type='submit'
          disabled={pristine || submitting}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: FormNames.FORM_SEND_FUNDS, // a unique identifier for this form
})(FormSendFunds);

// export default FormSendFunds
