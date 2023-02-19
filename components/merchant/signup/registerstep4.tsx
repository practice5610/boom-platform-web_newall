import { AllOptionalExceptFor, BoomUser, Nexus } from '@boom-platform/globals';
import { Color } from 'ag-grid-community';
import _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import USAMap from 'react-usa-map';
import { Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestProfileUpdate } from '../../../redux/actions/auth';
import { AppState } from '../../../redux/reducers';
import { getRegistrationStep } from '../../../redux/selectors';
import { NextLayoutPage } from '../../../types';
import { US_STATES, us_states } from '../../../utils/us-states';

type Props = {
  requestProfileUpdate?: typeof requestProfileUpdate;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  registrationStep?: number;
  nextStep?: any;
  backStep?: any;
  step: number;
};

const Fourth: NextLayoutPage<Props> = ({
  user,
  step,
  nextStep,
  backStep,
  requestProfileUpdate,
}) => {
  const [selectedStates, setSelectedStates] = React.useState<string[]>([]);

  const init = () => {
    if (user?.taxableNexus) {
      const taxableStates: string[] = [];
      user.taxableNexus.map((nexus) => {
        taxableStates.push(nexus.state);
      });
      setSelectedStates(taxableStates);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const setRegistrationStep = (i) => {
    if (user)
      if (user.registrationStep) {
        if (user.registrationStep < i) user.registrationStep = i;
      } else {
        user.registrationStep = i;
      }
  };

  const setUserInfo = () => {
    const taxableNexus: Nexus[] = [];
    selectedStates.map((state) => {
      taxableNexus.push({
        country: user?.store?.country ?? 'US',
        state: state,
      });
    });

    if (user) {
      user.taxableNexus = taxableNexus;
      setRegistrationStep(4);
      requestProfileUpdate?.(user);
      nextStep();
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    setUserInfo();
  };

  const mapHandler = (event) => {
    setSelectedStates([...selectedStates, event.target.dataset.name]);
  };

  const checkboxHandler = (state) => {
    setSelectedStates([...selectedStates, state]);
  };

  const selectAllStates = () => {
    setSelectedStates(US_STATES);
  };

  const statesCustomConfig = () => {
    let filledStates = {};
    selectedStates.map((state) => {
      filledStates = { ...filledStates, [state]: { fill: '#d52c25' } };
    });

    return filledStates;
  };

  console.log(user);

  return (
    <div>
      {step === 4 ? (
        <section>
          <div className='container-medium'>
            <div className='centered-content'>
              <div className='form-tab'>
                <form
                  id='form1'
                  onSubmit={(e) => {
                    goToNextStep(e);
                  }}
                >
                  <div>
                    <div>
                      <div>
                        <div className='pb-3'>
                          <USAMap
                            width={400}
                            height={280}
                            customize={statesCustomConfig()}
                            onClick={mapHandler}
                          />
                        </div>
                        <div className='taxable-states col-md-12'>
                          <div
                            className='m-2'
                            style={{ maxHeight: 200, width: 170, overflowY: 'scroll' }}
                          >
                            <ListGroup
                              className='pl-2 pr-2 pt-2 borderless'
                              style={{ border: 'none' }}
                            >
                              {US_STATES.map((state, index) => {
                                return (
                                  <ListGroupItem
                                    key={index + state}
                                    style={{ border: 'none', paddingBottom: 0 }}
                                  >
                                    <Label className='ml-2' style={{ border: 'none' }} check>
                                      <Input
                                        type='checkbox'
                                        onChange={() => checkboxHandler(state)}
                                        checked={
                                          selectedStates.includes(state) !== undefined
                                            ? state['unChecked']
                                            : false
                                        }
                                      />{' '}
                                      {us_states[state]}
                                    </Label>
                                  </ListGroupItem>
                                );
                              })}
                            </ListGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='register'>
            <div className='btn-group'>
              <button
                type='button'
                className='btn btn-back'
                onClick={() => {
                  backStep();
                }}
              >
                Go back
              </button>
              <button type='button' className='btn btn-cont' onClick={() => selectAllStates()}>
                Select all states
              </button>
              <button form='form1' type='submit' className='btn btn-cont'>
                Submit
              </button>
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
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Fourth);
