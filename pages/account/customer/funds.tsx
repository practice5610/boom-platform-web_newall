import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import FundsAdd from '../../../components/FundsAdd';
import FundsSend from '../../../components/FundsSend';
import HeaderAccount from '../../../components/HeaderAccount';
import { getLayout } from '../../../components/LayoutAccount';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { requestPaymentProcessorToken } from '../../../redux/actions/account-member';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

//import DropIn from 'braintree-web-drop-in-react';
interface Props {
  clientToken?: string;
  requestPaymentProcessorToken?: typeof requestPaymentProcessorToken;
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({ clientToken }) => {
  return (
    <>
      <HeaderAccount title='ADD FUNDS' />
      <FundsAdd />
      <HeaderAccount title='SEND FUNDS' />
      <FundsSend />
      {/* *ngIf="(user | async)" */}
      {/*      /!* *ngIf="(user | async) as user" *!/*/}
      {/*      <div>*/}
      {/*        <strong>Current funds:</strong> $*/}
      {/*        /!* { user.funds?.toFixed(2) } *!/*/}
      {/*      </div>*/}
      {/*      <hr/>*/}
      {/*      /!* for="amount" *!/*/}
      {/*      <label>Amount to add:</label>*/}
      {/*      <div className="input-group">*/}
      {/*        <div className="input-group-prepend">*/}
      {/*          <span className="input-group-text">$</span>*/}
      {/*        </div>*/}
      {/*        /!* [(ngModel)]="amount" *!/*/}
      {/*        <input id="amount" type="number" placeholder="Amount to add" className="form-control"/>*/}
      {/*      </div>*/}
      {/*      <DropIn*/}
      {/*        options={{authorization: clientToken}}*/}
      {/*        onInstance={instance => setInstance(instance)}*/}
      {/*      />*/}
      {/*      /!* <ngx-braintree*/}
      {/*  [clientTokenURL]="'https://us-central1-boom-dc739.cloudfunctions.net/client_token'"*/}
      {/*                              [chargeAmount]="amount"*/}
      {/*                              [buttonText]="'Add Funds'"*/}
      {/*                              [createPurchase]="createPurchase"*/}
      {/*                              (paymentStatus)="onPaymentStatus($event)"*/}
      {/*                            >*/}
      {/*</ngx-braintree> *!/*/}
      {/*/!* <ng-template # content let-c="close" let-d="dismiss"> *!/*/}
      {/*<div className="modal-header">*/}
      {/*  <h4 className="modal-title">Re-authenticate</h4>*/}
      {/*  /!* (click)="c('')" *!/*/}
      {/*  <button type="button" className="close" aria-label="Close">*/}
      {/*    <span aria-hidden="true">&times;</span>*/}
      {/*  </button>*/}
      {/*</div>*/}
      {/*<div className="modal-body">*/}
      {/*  <form>*/}
      {/*    <div className="form-group">*/}
      {/*      /!* for="password" *!/*/}
      {/*      <label>Password</label>*/}
      {/*      /!* #password *!/*/}
      {/*      <input type="password" id="password" className="form-control"/>*/}
      {/*    </div>*/}
      {/*  </form>*/}
      {/*</div>*/}
      {/*<div className="modal-footer">*/}
      {/*  /!* (click)="c('')" *!/*/}
      {/*  <button type="button" className="btn btn-outline-dark">Cancel</button>*/}
      {/*  /!* (click) = "c(password.value)" *!/*/}
      {/*  <button type="button" className="btn bg-red"> Ok</button>*/}
      {/*</div>*/}
      {/*/!* </ng - template > *!/*/}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_FUNDING,
    },
    globalProps: {
      headTitle: 'Funds',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
