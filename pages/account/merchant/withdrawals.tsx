import {
  AllOptionalExceptFor,
  BoomAccount,
  BoomUser,
  fromMoney,
  Money,
  RoleKey,
  toMoney,
  Transaction,
  TransactionType,
} from '@boom-platform/globals';
import Dinero from 'dinero.js';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Button, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { bindActionCreators } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import ModalWithdrawalFunds from '../../../components/merchant/withdrawal/ModalWithdrawalFunds';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import {
  requestMerchantBoomAccount,
  requestMerchantTransactions,
} from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';
import { accountMerchant } from '../../../redux/reducers/app';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
  user: AllOptionalExceptFor<BoomUser, 'uid'>;
  requestMerchantTransactions?: typeof requestMerchantTransactions;
  requestMerchantBoomAccount?: typeof requestMerchantBoomAccount;
  merchantTransactions?: Transaction[];
  merchantBoomAccount?: BoomAccount;
}

interface Totals {
  grossIncome: Money;
  totalTaxes: Money;
  totalCashback: Money;
  netIncome: Money;
}

const Page: NextLayoutPage<Props> = ({
  user,
  requestMerchantTransactions,
  requestMerchantBoomAccount,
  merchantTransactions,
  merchantBoomAccount,
}) => {
  useEffect(() => {
    // This first request to get amount at component mount.
    requestMerchantTransactions?.(TransactionType.PURCHASE);
    requestMerchantBoomAccount?.();
    // Then we update every 5min to fetch new transactions.
    const id = setInterval(() => {
      requestMerchantTransactions?.(TransactionType.PURCHASE);
      requestMerchantBoomAccount?.();
    }, 300000);
    // Clear interval on component unmounted.
    return () => clearInterval(id);
  }, []);

  // On merchantTransactions change, calculate incomes should be call.
  useEffect(() => {
    calculateIncomes();
  }, [merchantTransactions]);

  const [totals, setTotals] = useState<Totals>();
  const [modalWithdrawalFunds, setModalWithdrawalFunds] = useState<boolean>(false);

  const handleSetModal = () => {
    setModalWithdrawalFunds(!modalWithdrawalFunds);
  };

  const calculateIncomes = () => {
    let grossIncome = toMoney(0);
    let totalTaxes = toMoney(0);
    let totalCashback = toMoney(0);
    merchantTransactions?.forEach((transaction) => {
      grossIncome = toMoney(Dinero(grossIncome).add(Dinero(transaction.amount)).toUnit());
      totalTaxes = toMoney(Dinero(totalTaxes).add(Dinero(transaction.salestax)).toUnit());
      totalCashback = toMoney(Dinero(totalCashback).add(Dinero(transaction.cashback)).toUnit());
    });
    const netIncome = toMoney(
      Dinero(grossIncome).subtract(Dinero(totalTaxes)).subtract(Dinero(totalCashback)).toUnit()
    );
    setTotals({
      grossIncome: grossIncome,
      totalTaxes: totalTaxes,
      totalCashback: totalCashback,
      netIncome: netIncome,
    });
  };

  return (
    <>
      <div className='Merchant-Withdrawal container-fluid'>
        <div className='Withdrawal-Container p-4'>
          <Row>
            <h3>My Withdrawal </h3>
            <div className='question-icon'>
              <a
                style={{ marginLeft: '10px' }}
                data-tip
                data-for='settings-help'
                data-event='click'
              >
                <img src='/images/icons8-help-20.png' alt='help icon' />
              </a>
              <ReactTooltip
                id='settings-help'
                place='right'
                effect='solid'
                clickable={true}
                border={true}
                type='light'
              >
                <p>
                  In this section, you can request a withdrawal transaction and follow up his
                  status.
                  <br />
                </p>
              </ReactTooltip>
            </div>
          </Row>
          <Row>
            <div className='col-lg-3 mt-4'>
              <div className='row col-lg-12 p-0'>
                <div className='col-lg-6 p-0'>
                  <h4>Revenue</h4>
                </div>
              </div>
              <div className='row col-lg-12 mt-2 p-0'>
                <div className='col-lg-6 p-0'>
                  <p className='m-0'>Gross Income</p>
                  <p className='revenue-price'>{fromMoney(totals?.grossIncome ?? toMoney(0))}</p>
                </div>
                <div className='col-lg-6 p-0'>
                  <p className='m-0'>Net Income</p>
                  <p className='revenue-price'>{fromMoney(totals?.netIncome ?? toMoney(0))}</p>
                </div>
              </div>
              <div className='row col-lg-12 mt-2 p-0'>
                <div className='col-lg-6 p-0'>
                  <p className='m-0'>Total Tax</p>
                  <p className='revenue-price'>{fromMoney(totals?.totalTaxes ?? toMoney(0))}</p>
                </div>
                <div className='col-lg-6 p-0'>
                  <p className='m-0'>Total Cash Back</p>
                  <p className='revenue-price'>{fromMoney(totals?.totalCashback ?? toMoney(0))}</p>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <div className='col-lg-3 mt-4'>
              <div className='row col-lg-12 p-0'>
                <div className='col-lg-6 p-0'>
                  <h4>Available For Withdrawal</h4>
                </div>
              </div>
              <div className='row col-lg-12 mt-2 p-0'>
                <div className='col-lg-6 p-0'>
                  <p className='m-0'>Your Moob Account Balance</p>
                  <p className='revenue-price'>
                    {fromMoney(merchantBoomAccount?.balance ?? toMoney(0))}
                  </p>
                </div>
              </div>
            </div>
          </Row>
          <Row>
            <div className='col-lg-3 mt-4'>
              <h4>Bank Account Linked</h4>
              {user &&
                user.plaidInfo &&
                user.plaidInfo.map((bank, index) => (
                  <div className='settings-content-form-row' key={bank?.item?.itemId}>
                    <div className='settings-content-form-input'>
                      <div>{bank.institution && bank.institution.name + ' Bank'}</div>
                      <div>
                        {user.roles?.includes(RoleKey.Merchant) &&
                          `${
                            bank.accounts && bank.accounts[0].name.replace('Plaid', '')
                          } ****-****-${bank.accounts && bank.accounts[0].mask}`}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Row>
          <Row className='pl-2 py-5'>
            <Button className='m-sm-1' onClick={handleSetModal}>
              withdraw funds
            </Button>
          </Row>
        </div>
      </div>
      <ModalWithdrawalFunds
        handleModal={handleSetModal}
        visible={modalWithdrawalFunds}
        balanceAvailable={merchantBoomAccount?.balance ?? toMoney(0)}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  merchantTransactions: state.accountMerchant.transactions,
  merchantBoomAccount: state.accountMerchant.boomAccount,
});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_MERCHANT_WITHDRAWALS,
    },
    globalProps: {
      headTitle: 'Merchant Withdrawals',
    },
  } as Props;
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
