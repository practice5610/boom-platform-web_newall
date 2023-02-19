import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import Router from 'next/router';
import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { requestFundsDetails } from '../redux/actions/account-member';
import { AppState } from '../redux/reducers';
import { getIsMerchant, getIsRegistered } from '../redux/selectors';
import { LayoutAccountProps } from '../types';
import NavAccount from './NavAccount';
import NavMerchant from './NavMerchant';
import RenderIf from './utils/RenderIf';
interface Props extends LayoutAccountProps {
  children?: any;
  isMerchant?: boolean;
  requestFundsDetails?: typeof requestFundsDetails;
  isRegistered?: boolean;
  isUserSignedIn?: boolean;
  loading?: boolean;
  isInitialized?: boolean;
  isShowingLoadingOverlay?: boolean;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
}

const ignoredUrlsForCredentials = ['/signup/customer', '/signup/merchant'];
const LayoutAccount: FunctionComponent<Props> = ({
  requestFundsDetails,
  children,
  activeTab = '',
  isMerchant = false,
  isRegistered,
  isUserSignedIn,
  isInitialized,
  user,
}) => {
  useEffect(() => {
    if (isInitialized && requestFundsDetails && Router) {
      if (isUserSignedIn && !isMerchant) {
        requestFundsDetails();
      } else if (
        !ignoredUrlsForCredentials.includes(Router.pathname) &&
        (!isUserSignedIn || (isMerchant && !isRegistered))
      ) {
        Router.replace('/account/login');
      }
    }
  }, [isInitialized, requestFundsDetails, isUserSignedIn, isMerchant, isRegistered]);
  const step = user?.registrationStep ?? 0;
  return (
    <>
      <RenderIf condition={!isMerchant && isUserSignedIn === true}>
        <NavAccount activeTab={activeTab} />
      </RenderIf>
      <RenderIf condition={isMerchant && isUserSignedIn === true && step >= 5}>
        <NavMerchant activeTab={activeTab} />
      </RenderIf>
      <div className='LayoutAccount w-100'>
        <RenderIf condition={!isMerchant}>{children}</RenderIf>
        <RenderIf condition={isMerchant}>
          <div className='content'>{children}</div>
        </RenderIf>
      </div>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  isMerchant: getIsMerchant(state),
  isRegistered: getIsRegistered(state),
  isUserSignedIn: state.auth.isUserSignedIn,
  isInitialized: state.app.isInitialized,
  user: state.auth.user,
});

export const getLayout = (page, props) => {
  return <LayoutAccountRedux {...props.layoutProps}>{page}</LayoutAccountRedux>;
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

const LayoutAccountRedux = connect(mapStateToProps, mapDispatchToProps)(LayoutAccount);
