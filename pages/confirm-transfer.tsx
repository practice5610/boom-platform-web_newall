import { NextPageContext } from 'next';
import Router from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../components/LayoutAccount';
import actionCreators from '../redux/actions';
import { requestTransferConfirmation } from '../redux/actions/transactions';
import { AppState } from '../redux/reducers';
import { GlobalProps, NextLayoutPage } from '../types';
import { isServer } from '../utils/environment';

interface Props {
  id: string;
  requestTransferConfirmation?: typeof requestTransferConfirmation;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({ id, requestTransferConfirmation }) => {
  useEffect(() => {
    if (id === '') {
      Router.replace('/');
    } else if (id && requestTransferConfirmation) {
      requestTransferConfirmation(id);
    }
  }, [id, requestTransferConfirmation]);

  return (
    <Container>
      <br />
      <p>{id ? 'Confirming transfers...' : ''}</p>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext): Promise<Props> => {
  let id: string = '';
  if (reduxContext?.query?.id) {
    id = reduxContext.query.id.toString();
  } else if (isServer && reduxContext?.res) {
    reduxContext.res.writeHead(302, { Location: '/' });
    reduxContext.res.end();
  }
  return {
    id,
    globalProps: {
      headTitle: 'Confirm Transfer',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
