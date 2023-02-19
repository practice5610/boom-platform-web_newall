import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import Link from 'next/link';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { useRouter } from 'next/router';

import actionCreators from '../../../redux/actions';
import { requestProfileUpdate } from '../../../redux/actions/auth';
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
  createdPublicToken?: string;
};

const Sixth: NextLayoutPage<Props> = ({
  requestProfileUpdate,
  step,
  registrationStep,
  user,
}: Props) => {
  // console.log(step, user?.registrationStep, user);

  const router = useRouter();
  const setRegistrationStep = (i) => {
    if (user)
      if (user.registrationStep) {
        if (user.registrationStep < i) user.registrationStep = i;
      } else {
        user.registrationStep = i;
      }
  };

  const endStep = () => {
    if (user) {
      setRegistrationStep(6);
      requestProfileUpdate?.(user);
      router.push('/account/merchant/inventory');
    }
  };
  return (
    <div className='fifth-step'>
      {step === 6 ? (
        <section>
          <div className='title'>Thank you for completing your application!</div>
          <div>
            We are processing your application and <br />
            we will email you when we&apos;re done.
          </div>
          <br />
          <div>
            In the meantime, <br />
            you can add products, prices and create cashback offers <br />
            so that when your account is activated you&apos;ll be ready to blast off.
          </div>
          <br />
          <div className='register'>
            <div className='btn-group'>
              {/* <Link href='/account/merchant/inventory'> */}
              <button className='btn btn-equ' onClick={endStep}>
                Select my Moob Equipment
              </button>
              {/* </Link> */}
            </div>
          </div>

          <div>
            Any question? you can call us today at <br />
            <br /> 844-278-00-72 <br /> or contact us <Link href='/docs/contact-us'>here</Link>{' '}
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

export default connect(mapStateToProps, mapDispatchToProps)(Sixth);
