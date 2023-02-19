import { fromMoney, Offer } from '@boom-platform/globals';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Container, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import offer from '../pages/offer';
import actionCreators from '../redux/actions';
import { requestOffers } from '../redux/actions/account-merchant';
import { AppState } from '../redux/reducers';
import { replaceDomain } from '../utils/images';
import MerchantOffers from './MerchantOffers';

interface Props {
  offers?: Offer[];
  requestOffers?: typeof requestOffers;
}

const StoreOffers: FC<Props> = ({ offers, requestOffers }) => {
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);

  useEffect(() => {
    requestOffers!();
  }, []);

  const toggleModal = () => setIsOfferModalOpen(!isOfferModalOpen);

  const Item = (item) => {
    const today = moment(new Date()).unix();
    if (today < item.expiration) {
      return (
        <div
          key={item._id}
          className='equipment-recent-orders align-items-center pl-3 pt-3 pr-3 pb-3'
        >
          <div className='d-flex'>
            <img
              width='154'
              height='157'
              src={replaceDomain(item.product.imageUrl)}
              alt='Product'
            />
            <div>
              <div className='original-price-box pl-2 pt-1'>
                <span className='original-text'>Original Price</span>
                <br />
                <span className='original-price'>{fromMoney(item.product.price)}</span>{' '}
              </div>
              <div className='cashback-box pl-2 pt-1'>
                <span className='cashback-text'>Cash Back Up To</span>
                <br />
                <span className='cashback-price'>{fromMoney(item.cashBackPerVisit)}</span>{' '}
              </div>
            </div>
            <div className='active-results pl-3'>
              <div className='offer-title'>
                <span>{item.title}</span>
              </div>
              <div className='offer-description'>
                <span>{item.description}</span>
              </div>
              <div className='d-flex align-items-start justify-content-start'>
                <div className='d-flex flex-column visit-box-1'>
                  <ul>
                    <li>
                      Max Visits:&nbsp;<span className='visit-red'>{item.maxVisits}</span>
                    </li>
                  </ul>
                </div>
                <div className='d-flex flex-column visit-box-1 pl-3'>
                  <ul>
                    <li>
                      Max Quantity:&nbsp;<span className='visit-red'>{item.maxQuantity}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='d-flex flex-column align-items-center pl-5 ml-auto'>
              <Button
                className='cancel-btn d-flex align-items-center justify-content-center'
                // onClick={onCancelOrder}
              >
                Cancel
              </Button>

              <div className='d-flex flex-column visit-box-1 align-items-center justify-content-center'>
                <span className='visit-red'>
                  Activated: {moment.unix(item.startDate).format('MM/DD/YYYY')}
                </span>
                <span className='visit-red'>
                  Expires: {moment.unix(item.expiration).format('MM/DD/YYYY')}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className='StoreOffers pb-5'>
      <MerchantOffers toggleModal={toggleModal} isOfferModalOpen={isOfferModalOpen} />
      {offers && offers.slice(0, 5).map((item) => Item(item))}
      <div className='store-profile-update pl-1 pb-5 pt-5'>
        <Container fluid>
          <Row className='mt-3'>
            <Col xs='6'>
              <Button
                className='d-flex align-items-center justify-content-center'
                style={{
                  backgroundColor: '#D42C29',
                  fontSize: 30,
                  width: 175,
                  height: 55,
                  borderWidth: 0,
                  borderRadius: 'unset',
                }}
                onClick={toggleModal}
                color='danger'
                size='lg'
              >
                Add More
              </Button>
            </Col>
            <Col xs='6'>
              <Button
                href='/account/merchant/offers'
                className='d-flex align-items-center justify-content-center'
                style={{
                  backgroundColor: '#D42C29',
                  fontSize: 25,
                  width: 220,
                  height: 65,
                  borderWidth: 0,
                  borderRadius: 'unset',
                  float: 'right',
                }}
                color='danger'
                size='lg'
              >
                View More Offers
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  offers: state.accountMerchant.offers?.offers,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StoreOffers);
