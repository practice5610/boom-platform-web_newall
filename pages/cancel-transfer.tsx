import { AllOptionalExceptFor, BoomUser, fromMoney, Transaction } from '@boom-platform/globals';
import _ from 'lodash';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Container } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../components/LayoutAccount';
import RenderIf from '../components/utils/RenderIf';
import actionCreators from '../redux/actions';
import { requestTransactionDetails, requestTransferCancel } from '../redux/actions/transactions';
import { AppState } from '../redux/reducers';
import { getTransaction } from '../redux/selectors';
import { GlobalProps, NextLayoutPage } from '../types';
import { isServer } from '../utils/environment';

interface Props {
  id: string;
  requestTransactionDetails?: typeof requestTransactionDetails;
  requestTransferCancel?: typeof requestTransferCancel;
  transaction?: Transaction;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  id,
  requestTransferCancel,
  requestTransactionDetails,
  transaction,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === '') {
      Router.replace('/');
    } else if (id && requestTransactionDetails) {
      requestTransactionDetails({ '[filter][where][_id]': id });
    }
  }, [id, requestTransactionDetails]);

  useEffect(() => {
    if (transaction) {
      setLoading(false);
    }
  }, [transaction]);

  const _cancelTransfer = () => {
    requestTransferCancel?.(id);
  };

  const receiver: AllOptionalExceptFor<BoomUser, 'uid'> | null =
    transaction && transaction.receiver
      ? (transaction.receiver as AllOptionalExceptFor<BoomUser, 'uid'>)
      : null;

  return (
    <Container>
      <br />
      <RenderIf condition={loading}>
        <span>Loading transaction...</span>
      </RenderIf>
      <RenderIf condition={!loading && !!transaction && !!transaction.receiver}>
        <div>
          <h2>Cancel transfer</h2>
          <strong>Recipient:</strong>
          <div>
            {receiver &&
              receiver.contact &&
              !_.isEmpty(receiver.contact.emails) &&
              receiver.contact.emails![0]}
          </div>
          <br />
          <strong>Amount:</strong>
          <div>{transaction && transaction.amount && fromMoney(transaction.amount)}</div>
          <br />
          <br />
          <div>Are you sure you wish to cancel this transfer?</div>
          <br />
          <Button onClick={() => _cancelTransfer()}>Cancel transfer</Button>
        </div>
      </RenderIf>
    </Container>
  );
};

const mapStateToProps = (state: AppState, props: Props) => ({
  transaction: getTransaction(state, props.id),
});

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
      headTitle: 'Cancel Transfer',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
