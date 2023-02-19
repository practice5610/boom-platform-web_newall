import { AllOptionalExceptFor, BoomUser, toMoney } from '@boom-platform/globals';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { setGlobalToast } from '../redux/actions/app';
import { addFunds } from '../redux/actions/funds';
import {
  getPlaidAccessToken,
  getPlaidEnvInfo,
  getPlaidPublicToken,
  removeBankAccount,
  removePublicToken,
} from '../redux/actions/settings';
import { AppState } from '../redux/reducers';
import InputCheckBox from './InputCheckbox';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  plaidEnvInfo?: any;
  accountRemovingState?: number;
  addFundsState?: number;
  getPlaidAccessToken?: typeof getPlaidAccessToken;
  getPlaidPublicToken?: typeof getPlaidPublicToken;
  removePublicToken?: typeof removePublicToken;
  getPlaidEnvInfo?: typeof getPlaidEnvInfo;
  removeBankAccount?: typeof removeBankAccount;
  addFunds?: typeof addFunds;
  errorCode?: string;
  createdPublicToken?: string;
  setGlobalToast?: typeof setGlobalToast;
}

const FundsAdd: FunctionComponent<Props> = ({
  user,
  plaidEnvInfo,
  accountRemovingState,
  getPlaidEnvInfo,
  getPlaidAccessToken,
  getPlaidPublicToken,
  removePublicToken,
  removeBankAccount,
  addFundsState,
  addFunds,
  errorCode,
  createdPublicToken,
  setGlobalToast,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedBankId, setSelectedBankId] = useState();
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getPlaidEnvInfo!();
  }, []);
  useEffect(() => {
    setAmount('');
  }, [addFundsState]);

  const handlePlaidLoginSuccess = (token, metadata) => {
    getPlaidAccessToken!(token, user, metadata, false);
  };
  const handleSelectBank = (bankId) => {
    setSelectedBankId(bankId);
    setSelectedAccountId('');
  };
  const handleRemoveBankAccount = (accountIndex) => {
    removeBankAccount!(accountIndex, user);
  };
  const handleSelectAccount = (accountId, itemId) => {
    setSelectedAccountId(accountId);
    setSelectedItemId(itemId);
  };
  const handleAddFunds = () => {
    const reg = new RegExp(/^(-?\d+\.\d+)$|^(-?\d+)$/gm);
    if (amount && reg.test(amount) && selectedItemId && selectedAccountId) {
      addFunds?.(toMoney(amount), selectedItemId, selectedAccountId);
    } else if (!selectedItemId || !selectedAccountId) {
      alert('Select bank account!');
    } else if (!amount) {
      alert('Input amount!');
    } else if (!reg.test(amount)) {
      alert('Input correctly!');
    }
  };

  return (
    <div className='container funds'>
      <div className='row'>
        <div className='funds-content m-b-80'>
          <div className='funds-content-left'>
            <div className='funds-select-block'>
              <h3 className='funds-content-left-title'>Select a bank account</h3>
              <div className='funds-content-form'>
                {user &&
                  user.plaidInfo &&
                  user.plaidInfo.map((bank, index) => (
                    <div className='funds-content-form-row' key={bank.item.itemId}>
                      <div className='funds-bank-container'>
                        <InputCheckBox
                          id={`check${index}`}
                          checkState={selectedBankId === index}
                          onChange={(val) => {
                            removePublicToken!();
                            if (val) {
                              handleSelectBank(index);
                            } else {
                              handleSelectBank(-1);
                            }
                          }}
                        />
                        <div className='funds-content-form-input'>{bank.institution.name}</div>

                        <button
                          className='funds-content-form-del'
                          onClick={() => handleRemoveBankAccount(index)}
                        >
                          <img width='40' height='45' src='/images/delete_row.svg' alt='Delete' />
                        </button>
                      </div>
                      <div
                        className={`funds-account-container ${
                          selectedBankId === index ? 'active' : ''
                        }`}
                      >
                        <p className='plaid-state-info'>
                          {!selectedAccountId ? 'Select account' : ''}
                        </p>
                        {bank.accounts.map((account, index1) => (
                          <div
                            key={account.id}
                            className={`sub-account-item ${
                              selectedAccountId === account.id ? 'active' : ''
                            }`}
                            onClick={() => handleSelectAccount(account.id, bank.item.itemId)}
                          >
                            {account.name.replace('Plaid', '')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                <div className='funds-content-form-add-row'>
                  <div id='add2' className='funds-content-form-add'>
                    {plaidEnvInfo &&
                      !createdPublicToken &&
                      (!user?.plaidInfo || user?.plaidInfo.length === 0) && (
                        <PlaidLink
                          clientName={plaidEnvInfo.plaidAppName}
                          env={plaidEnvInfo.plaidMode}
                          product={plaidEnvInfo.plaidProduct}
                          publicKey={plaidEnvInfo.plaidPublicKey}
                          onExit={() => {}}
                          onSuccess={(token, metadata) => {
                            handlePlaidLoginSuccess(token, metadata);
                          }}
                        >
                          {!createdPublicToken &&
                            (!user?.plaidInfo || user?.plaidInfo.length === 0) && (
                              <img
                                width='50'
                                height='50'
                                src='/images/add-symbol.svg'
                                alt='Delete'
                              />
                            )}
                          Add Bank Account
                        </PlaidLink>
                      )}
                  </div>
                </div>
                <input
                  type='text'
                  className='funds-content-form-add-amount'
                  placeholder='Add Amount'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button className='funds-content-form-funds' onClick={handleAddFunds}>
                  Add Funds
                </button>
              </div>
            </div>
          </div>
          <div className='funds-content-right'>
            <h3 className='funds-content-right-title'>Adding to your balance</h3>
            <p className='funds-content-right-desc'>
              Adding funds to your Moob Card Balance is easy and fast. You can directly reload your
              balance with a credit/debit card or bank account. You can also set up Auto-Reload on
              the <span className='settings-page-text'>Settings Page</span> which allows you to add
              gift card funds automatically to your Moob Card Balance when the balance drops below a
              certain amount. The Moob Card Balance can be used to shop for millions of offers and
              there is no expiration date or service fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  plaidEnvInfo: state.settings.plaidEnvInfo,
  accountRemovingState: state.settings.accountRemovingState,
  createdPublicToken: state.settings.createdPublicToken,
  addFundsState: state.funds.addFundsState,
  errorCode: state.funds.errorCode,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FundsAdd);
