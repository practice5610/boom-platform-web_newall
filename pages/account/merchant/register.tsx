import { AllOptionalExceptFor, BoomUser } from '@boom-platform/globals';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import Footer from '../../../components/Footer';
import { getLayout } from '../../../components/LayoutAccount';
import SignUpLeftSide from '../../../components/merchant/signup/LeftSide';
import First from '../../../components/merchant/signup/registerstep1';
import Second from '../../../components/merchant/signup/registerstep2';
import Third from '../../../components/merchant/signup/registerstep3';
import Fourth from '../../../components/merchant/signup/registerstep4';
import Fifth from '../../../components/merchant/signup/registerstep5';
import Sixth from '../../../components/merchant/signup/registerstep6';
import NavBar from '../../../components/NavBar';
import RStepper from '../../../components/RStepper';
import { DEFAULT_INIT_URL_FOR_MERCHANTS } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { createProductAndOffer, requestCreateStore } from '../../../redux/actions/account-merchant';
import { requestProfileUpdate } from '../../../redux/actions/auth';
import { AppState } from '../../../redux/reducers';
import { getIsRegistered, getRegistrationStep } from '../../../redux/selectors';
import { GlobalProps, NextLayoutPage } from '../../../types';

type Props = {
  requestProfileUpdate?: typeof requestProfileUpdate;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  registrationStep?: number;
  isRegistered: boolean;
  requestCreateStore?: typeof requestCreateStore;
  createProductAndOffer?: typeof createProductAndOffer;
  isUserSignedIn: boolean;
  globalProps: GlobalProps;
};

const Page: NextLayoutPage<Props> = ({
  registrationStep,
  isRegistered,
  isUserSignedIn,
  user,
}: Props) => {
  const [mstep, setmStep] = useState(registrationStep ? registrationStep : 1);

  useEffect(() => {
    // console.log(isRegistered, user, user?.registrationStep);
    if (user?.registrationStep) {
      if (isRegistered) {
        Router.replace(DEFAULT_INIT_URL_FOR_MERCHANTS);
      } else {
        setmStep(user.registrationStep + 1);
        console.log('user.registrationStep', user.registrationStep);
      }
    }
    // console.log(mstep);
  }, [isUserSignedIn, isRegistered, user]);

  const nextStep = () => {
    setmStep(mstep + 1);
  };
  const backStep = () => {
    setmStep(mstep - 1);
  };

  const steps = [
    {
      title: 'Are you the admin?',
      subtitle:
        'Welcome to your account. Before beginning your active location we need to get you setup for the wave of customers. To begin with, confirm your admin information for your account.',
    },
    {
      title: 'Describe your company',
      subtitle:
        'Member will want to know about what great business is sharing nearby offers. Promote your company, website and social media to your future customers.',
    },
    {
      title: 'Where is your business',
      subtitle:
        'Your store location will be displayed on our website and mobile app. Confirm your location details so that you can definitely be found by our members locally and from out of town.',
    },
    {
      title: 'Taxable states',
      subtitle: 'Please select the states that your business will report taxes.',
    },
    {
      title: 'Bank information',
      subtitle:
        'We are not keeping any bank information for security reasons. So, our friends from PLAID will certify your bank info.',
    },
  ];

  return (
    <div>
      {mstep === 6 && (
        <header>
          <NavBar />
        </header>
      )}
      <Row className={`signup-row ${mstep === 6 ? 'card-width' : ''}`}>
        {mstep < 6 && (
          <Col xs={12} md={6} className='signup-col'>
            <SignUpLeftSide
              title={steps[mstep - 1].title}
              subtitle={steps[mstep - 1].subtitle}
              isSignInLink={false}
            />
          </Col>
        )}

        <Col
          xs={12}
          md={mstep === 6 ? 12 : 6}
          className={`signup-col ${mstep === 6 ? 'card' : ''}`}
        >
          <div className={`signup-wizard ${mstep === 6 ? 'step5' : ''}`}>
            <div className='stepper-container mb-4'>
              <RStepper step={mstep - 1} />
            </div>

            {isUserSignedIn ? (
              <div>
                <First nextStep={nextStep} step={mstep} />
                <Second nextStep={nextStep} backStep={backStep} step={mstep} />
                <Third nextStep={nextStep} backStep={backStep} step={mstep} />
                <Fourth nextStep={nextStep} backStep={backStep} step={mstep} />
                <Fifth nextStep={nextStep} backStep={backStep} step={mstep} />
                <Sixth step={mstep} />
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
      {mstep === 6 && <Footer />}
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  registrationStep: getRegistrationStep(state),
  isRegistered: getIsRegistered(state),
  isUserSignedIn: state.auth.isUserSignedIn,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
