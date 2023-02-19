import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import actionCreators from '../../../redux/actions';
import { AppState } from '../../../redux/reducers';
import { NextLayoutPage } from '../../../types';

const Page: NextLayoutPage = () => {
  return (
    <>
      {/* <ng-container *ngFor="let store of stores"> */}
      <div style={{ padding: '16px' }}>
        {/* <h4>{store.companyName}</h4> */}
        {/* <img
      *ngIf="store.companyLogoUrl"
      [src]="store.companyLogoUrl"
      width=100
      height=100
    > */}
        <div style={{ display: 'inline-block', fontSize: '16px' }}>
          <strong>Address: </strong>
          {/* <strong>Address: </strong>{store.address1} */}
          <br />
          <strong>Phone number:</strong>
          {/* {store.phoneNumber} */}
          <br />
          {/* <a [routerLink]="'/merchant/' + store.id">View merchant</a> */}
        </div>
      </div>
      <hr />
      {/* </ng-container> */}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    globalProps: {
      headTitle: 'Favorites',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
