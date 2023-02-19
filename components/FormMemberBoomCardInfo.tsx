import { AllOptionalExceptFor, BoomCard, BoomCardStatus, BoomUser } from '@boom-platform/globals';
import React from 'react';
import { connect } from 'react-redux';
import { Form, Input } from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { requestBoomCardDetails, updateBoomCardDetails } from '../redux/actions/account-member';
import { AppState } from '../redux/reducers';
import ButtonApp from './ButtonApp';
import RenderIf from './utils/RenderIf';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  card?: BoomCard;
  isUserSignedIn?: boolean;
  requestBoomCardDetails?: typeof requestBoomCardDetails;
  updateBoomCardDetails?: typeof updateBoomCardDetails;
}

interface State {
  pinNumber?: string;
  confirmPinNumber?: string;
}

class FormMemberBoomCardInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pinNumber: '',
      confirmPinNumber: '',
    };
  }
  componentDidMount() {
    this._requestCardDetailsIfNeeded(null, this.props);
  }
  componentDidUpdate(prevProps: Props) {
    this._requestCardDetailsIfNeeded(prevProps, this.props);
  }
  _requestCardDetailsIfNeeded(prevProps: Props | null, newProps: Props) {
    const { requestBoomCardDetails, user } = newProps;
    const didNotHaveCardPreviously =
      prevProps && (!prevProps.user! || !prevProps.user!.cards || !prevProps.user!.cards!.length);
    const hasCardNow = user && user.cards && user.cards.length;

    if ((didNotHaveCardPreviously && hasCardNow) || (prevProps === null && hasCardNow)) {
      requestBoomCardDetails?.();
    }
  }

  isValidPinNumber = (pinNumber) => {
    if (!pinNumber) return true;
    return /^\d+$/.test(pinNumber);
  };

  insertHypens = (cardNumber) => {
    if (cardNumber.length > 0) {
      cardNumber = cardNumber.match(new RegExp('.{1,4}', 'g')).join('-');
      return cardNumber;
    }
    return '';
  };

  submit = () => {
    const { card, updateBoomCardDetails } = this.props;
    if (card) {
      const { pinNumber } = this.state;
      const { cardNumber, fromBatchId, qrcode, _id, ...newCard } = card;
      newCard.pinNumber = parseInt(pinNumber ? pinNumber : '');
      updateBoomCardDetails?.(newCard);
      this.setState({ pinNumber: '', confirmPinNumber: '' });
    }
  };

  _onCardBlockRequested = async (e) => {
    e.preventDefault();

    const result = await confirm({
      title: (
        <>
          <p>Block Moob card Confirmation</p>
        </>
      ),
      message: (
        <>
          <p>This will immediately block your Moob card from being used at physical stores.</p>
          <p>
            Your card balance will remain available to you on your account for purchases. Are you
            sure you want to continue?
          </p>
        </>
      ),
      confirmText: 'Yes',
      confirmColor: 'btn text-danger',
      cancelColor: 'btn',
    });

    if (!result) return;

    const { card, updateBoomCardDetails } = this.props;
    const updatedCard: Partial<BoomCard> = { status: BoomCardStatus.BLOCKED };
    updateBoomCardDetails?.(updatedCard);
  };

  render() {
    const { pinNumber, confirmPinNumber } = this.state;
    const { card, user } = this.props;
    return user && user.cards ? (
      <div className='FormCustomerSettings container'>
        <div className='Form-edit-profile Moob-cardInfo d-flex align-items-top justify-content-between'>
          <Form>
            <div className='moob-card-info-item d-flex align-items-center'>
              <img src='/images/boom_eye.svg' alt='Eye' />

              <span>Pin: {card && card.pinNumber}</span>

              <span>
                Account Number:{' '}
                {card && card.cardNumber ? this.insertHypens(card.cardNumber) : null}
              </span>

              <RenderIf condition={!!card && card.status === BoomCardStatus.ACTIVE}>
                <ButtonApp
                  onClick={this._onCardBlockRequested}
                  disabled={card && card.status === BoomCardStatus.BLOCKED}
                >
                  Block lost/stolen card
                </ButtonApp>
              </RenderIf>
            </div>

            <h4 className='color-brand-grey'>
              Balance:{' '}
              {
                'Property balance does not exist on type Moob Card' //card ? fromMoney(card.balance) : '$0.00'
              }
            </h4>

            <RenderIf condition={!!card && card.status === BoomCardStatus.BLOCKED}>
              <div className={'mt-4 mb-4'}>
                <h5 className='color-brand-red'>This card is blocked</h5>
                <p>
                  Your card balance remains available to you on your account for online purchases.
                </p>
              </div>
            </RenderIf>

            <div className={'mt-4'}>
              <Input
                type='password'
                placeholder='New Pin'
                autoComplete='new-pin'
                value={pinNumber}
                onChange={(e) => {
                  this.setState({
                    pinNumber: e.currentTarget.value,
                  });
                }}
                invalid={!this.isValidPinNumber(pinNumber)}
              />
              <Input
                type='password'
                placeholder='Confirmation Pin'
                value={confirmPinNumber}
                onChange={(e) => {
                  this.setState({
                    confirmPinNumber: e.currentTarget.value,
                  });
                }}
              />
              <Input
                type='button'
                className='save-changes-btn'
                value='Save Changes'
                disabled={confirmPinNumber !== pinNumber || !this.isValidPinNumber(pinNumber)}
                onClick={() => this.submit()}
              />
            </div>
          </Form>
        </div>
      </div>
    ) : (
      ''
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  card: state.accountMember.boomCard,
  isUserSignedIn: state.auth.isUserSignedIn,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FormMemberBoomCardInfo);
