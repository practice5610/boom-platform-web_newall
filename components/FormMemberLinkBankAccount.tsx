import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { getPlaidAccessToken, getPlaidEnvInfo, removeBankAccount } from '../redux/actions/settings';
import { AppState } from '../redux/reducers';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  plaidEnvInfo?: any;
  getPlaidAccessToken?: typeof getPlaidAccessToken;
  getPlaidEnvInfo?: typeof getPlaidEnvInfo;
  removeBankAccount?: typeof removeBankAccount;
  merchantUser?: boolean | undefined;
  createdPublicToken?: string;
}

const FormMemberLinkBankAccount: FunctionComponent<Props> = ({
  user,
  plaidEnvInfo,
  getPlaidEnvInfo,
  getPlaidAccessToken,
  removeBankAccount,
  merchantUser,
  createdPublicToken,
}) => {
  useEffect(() => {
    getPlaidEnvInfo!();
  }, []);
  const handlePlaidLoginSuccess = (token, metadata) => {
    setBankAccountinfo(metadata);
    setBankAccountToken(token);
    if (merchantUser) {
      setOpenBackChooseModal(true);
    } else {
      getPlaidAccessToken?.(token, user, metadata, merchantUser);
    }
  };
  const handleRemoveBankAccount = (accountIndex) => {
    if (merchantUser) {
      removeBankAccount?.(accountIndex, user);
      alert('All Merchants must have a bank account. Please be sure to link a new account.');
    } else {
      removeBankAccount?.(accountIndex, user);
    }
  };
  const [openBankChooseModal, setOpenBackChooseModal] = useState(false);
  const [bankAccountToken, setBankAccountToken] = useState('');
  const [bankAccountInfo, setBankAccountinfo] = useState<{ accounts: any }>({ accounts: null });
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [subAccountName, setSubAccountName] = useState('');
  const handleSelectAccount = (account) => {
    setOpenBackChooseModal(false);
    getPlaidAccessToken!(
      bankAccountToken,
      user,
      { ...bankAccountInfo, accounts: [account] },
      merchantUser
    );
  };
  return (
    <div className='FormCustomerSettings container'>
      <div className='Form-edit-profile link-creditCard d-flex justify-content-between'>
        <div className='form-link-bank-account'>
          <p className='plaid-state-info' />
          {user &&
            user.plaidInfo &&
            user.plaidInfo.map((bank, index) => (
              <div className='settings-content-form-row' key={bank?.item?.itemId}>
                <div className='settings-content-form-input'>
                  {bank.institution && bank.institution.name}
                  {merchantUser &&
                    ` - ${bank.accounts && bank.accounts[0].name.replace('Plaid', '')}`}
                </div>

                <button
                  className='settings-content-form-del'
                  onClick={() => {
                    handleRemoveBankAccount(index);
                  }}
                >
                  <img width='40' height='45' src='/images/delete_row.svg' alt='Delete' />
                </button>
              </div>
            ))}

          {user && (
            <div className='settings-content-form-add-row'>
              <div id='add2' className='button-container'>
                {(!merchantUser || !user?.plaidInfo || user?.plaidInfo?.length < 1) &&
                  plaidEnvInfo &&
                  !createdPublicToken &&
                  (!user?.plaidInfo || user?.plaidInfo?.length === 0) && (
                    <PlaidLink
                      clientName={plaidEnvInfo.plaidAppName}
                      env={plaidEnvInfo.plaidMode}
                      product={plaidEnvInfo.plaidProduct}
                      publicKey={plaidEnvInfo.plaidPublicKey}
                      onExit={() => {
                        console.log('exit');
                      }}
                      onSuccess={(token, metadata) => {
                        handlePlaidLoginSuccess(token, metadata);
                      }}
                    >
                      <img width='50' height='50' src='/images/add-symbol.svg' alt='Add' />
                      Link Bank Account
                    </PlaidLink>
                  )}
              </div>
            </div>
          )}
        </div>
        <div className='form-link-credit-card'>
          <div className='link-cc-header'>
            <span>Link Bank Account</span>
          </div>
          <p className='link-cc-text'>
            The easiest way for users to connect their bank accounts to an app
          </p>

          <div className='brand-shield d-flex'>
            <img width='84px' height='100' src='/images/boom_shield.svg' alt='Moob Shield' />
            <p className='brand-shield-text'>
              We value your business and the trust you have placed in Moob Marketplace. We take
              security very seriously and use a variety of measures to protect your personal
              information and accounts. Moob Marketplace employs advanced encryption technology to
              protect client information and protect against unauthorized users from accessing data
              during sign on or usage of Moob Acount activity.
            </p>
          </div>
        </div>
        <Modal isOpen={openBankChooseModal} backdrop='static'>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            <p className='plaid-state-info'>{!selectedAccountId ? 'Select account' : ''}</p>
            {bankAccountInfo &&
              bankAccountInfo!.accounts &&
              bankAccountInfo!.accounts.map((account, index1) => (
                <div
                  key={account.id}
                  className={`sub-account-item ${selectedAccountId === account.id ? 'active' : ''}`}
                  onClick={() => handleSelectAccount(account)}
                >
                  {account.name.replace('Plaid', '')}
                </div>
              ))}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setOpenBackChooseModal(false)}>
              Cancel
            </Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  plaidEnvInfo: state.settings.plaidEnvInfo,
  createdPublicToken: state.settings.createdPublicToken,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormMemberLinkBankAccount);
