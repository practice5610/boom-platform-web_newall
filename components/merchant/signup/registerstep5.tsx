import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import * as React from 'react';
import { PlaidLink } from 'react-plaid-link';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestProfileUpdate } from '../../../redux/actions/auth';
import { getPlaidAccessToken, getPlaidEnvInfo } from '../../../redux/actions/settings';
import { AppState } from '../../../redux/reducers';
import { getRegistrationStep } from '../../../redux/selectors';
import { NextLayoutPage } from '../../../types';

type Props = {
  requestProfileUpdate?: typeof requestProfileUpdate;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  registrationStep?: number;
  nextStep?: any;
  backStep?: any;
  step: number;
  plaidEnvInfo?: any;
  getPlaidEnvInfo?: typeof getPlaidEnvInfo;
  getPlaidAccessToken?: typeof getPlaidAccessToken;
  createdPublicToken?: string;
};

const Fifth: NextLayoutPage<Props> = ({
  requestProfileUpdate,
  user,
  step,
  nextStep,
  backStep,
  plaidEnvInfo,
  createdPublicToken,
  getPlaidAccessToken,
  getPlaidEnvInfo,
}) => {
  React.useEffect(() => {
    getPlaidEnvInfo?.();
  }, []);

  const handlePlaidLoginSuccess = (token, metadata) => {
    getPlaidAccessToken!(token, user, metadata, false);
  };

  const setRegistrationStep = (i) => {
    if (user)
      if (user.registrationStep) {
        if (user.registrationStep < i) user.registrationStep = i;
      } else {
        user.registrationStep = i;
      }
  };

  const goToNextStep = () => {
    if (user) {
      setRegistrationStep(5);
      requestProfileUpdate?.(user);
      nextStep();
    }
  };

  return (
    <div>
      {step === 5 ? (
        <section>
          <div className='container-medium step-5-container'>
            <div className='centered-content'>
              <div className='form-tab'>
                <div className='d-flex plaid-logo'>
                  <img src='/static/Plaid-Logo.png' alt='plaid-logo' />
                </div>
              </div>
            </div>
          </div>
          <div className='register'>
            <div className='btn-group'>
              {!user?.plaidInfo && (
                <button
                  type='button'
                  className='btn btn-back'
                  onClick={() => {
                    backStep();
                  }}
                >
                  Go back
                </button>
              )}
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
                            <img width='50' height='50' src='/images/add-symbol.svg' alt='Delete' />
                          )}
                        Add Bank Account
                      </PlaidLink>
                    )}
                </div>
              </div>
              {user?.plaidInfo && (
                <button type='button' className='btn btn-back' onClick={goToNextStep}>
                  Continue
                </button>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  registrationStep: getRegistrationStep(state),
  isUserSignedIn: state.auth.isUserSignedIn,
  user: state.auth.user,
  plaidEnvInfo: state.settings.plaidEnvInfo,
  createdPublicToken: state.settings.createdPublicToken,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Fifth);
