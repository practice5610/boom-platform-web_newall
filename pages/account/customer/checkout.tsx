import { Booking, BoomUser, fromMoney, isOffer, Money, toMoney } from '@boom-platform/globals';
import Dinero from 'dinero.js';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import { LayoutTabs } from '../../../constants';
import { Tax } from '../../../models/tax.model';
import actionCreators from '../../../redux/actions';
import {
  checkoutBookings,
  deleteBooking,
  requestBookings,
  selectBooking,
} from '../../../redux/actions/account-member';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  user?: BoomUser;
  bookings?: Booking[];
  selectedBookings?: boolean[];
  selectBooking?: typeof selectBooking;
  deleteBooking?: typeof deleteBooking;
  checkoutBookings?: typeof checkoutBookings;
  requestBookings?: typeof requestBookings;
  totalTax?: Tax[] | undefined | null;
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  user,
  bookings,
  deleteBooking,
  selectBooking,
  requestBookings,
  // selectedBookings,
  // checkoutBookings,
  // totalTax,
}) => {
  useEffect(() => {
    requestBookings?.();
  }, []);
  useEffect(() => {
    calculateTotals();
  }, [bookings]);

  const [totals, setTotals] = useState({});

  const calculateTotals = () => {
    if (bookings?.length) {
      // let totalShipping: Money = toMoney(0);
      let totalBeforeTax: Money = toMoney(0);
      let totalCashback: Money = toMoney(0);
      for (const booking of bookings) {
        totalBeforeTax = toMoney(
          Dinero(totalBeforeTax)
            .add(
              isOffer(booking.item)
                ? Dinero(booking.item.product.price)
                : Dinero(booking.item.price)
            )
            .toUnit()
        );
        if (isOffer(booking.item)) {
          totalCashback = toMoney(
            Dinero(totalCashback).add(Dinero(booking.item.cashBackPerVisit)).toUnit()
          );
        }
      }
      const totalOrder: Money = toMoney(Dinero(totalBeforeTax).toUnit());
      setTotals({
        ...totals,
        totalBeforeTax: totalBeforeTax,
        totalCashback: totalCashback,
        totalOrder: totalOrder,
      });
    }
  };
  return (
    <Container fluid className='p-5'>
      <Row className='border-bottom'>
        <h3 className='table-tittle'>Check out</h3>
      </Row>
      <Row className='border-bottom py-3'>
        <Col sm='6'>
          <text>
            <small className='text-danger'>Important</small>
            <br />
            <small>
              cancellation items <strong>are not guaranteed!</strong> it will depends to the
            </small>
            <br />
            <small className='text-danger'>merchant's terms and conditions</small>
          </text>
        </Col>
        <Col sm='6'>
          <text>
            <small className='text-danger'>Payment information</small>
            <br />
            <small>Your boom card</small>
            <br />
            <small className='text-danger'>Ship to: Noel Strachan</small>
          </text>
        </Col>
      </Row>
      <Row className='py-5'>
        <Col sm='3' className='d-flex align-items-center justify-content-center'>
          <img
            src='https://d1k0ppjronk6up.cloudfront.net/products/1529/images_b75_image2_844.jpg'
            alt=''
            width='100'
            height='100'
          />
        </Col>
        <Col sm='9'>
          {bookings &&
            bookings.length &&
            bookings.map((element, index) => {
              return (
                <Row key={index}>
                  <Col sm='6'>
                    <p>
                      <small>
                        {isOffer(element.item) ? element.item.product.name : element.item.name}
                      </small>
                    </p>
                  </Col>
                  <Col sm='6'>
                    <p>
                      {isOffer(element.item)
                        ? fromMoney(element.item.product.price)
                        : fromMoney(element.item.price)}
                    </p>
                  </Col>
                </Row>
              );
            })}
          <Row>
            <Col>
              <p>
                <strong>Total before tax:</strong>
              </p>
            </Col>
            <Col>
              <p>
                <strong>{totals && fromMoney(totals['totalBeforeTax'])}</strong>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <strong>Total Order:</strong>
              </p>
            </Col>
            <Col>
              <p>
                <strong>{totals && fromMoney(totals['totalOrder'])}</strong>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <strong>Cashback:</strong>
              </p>
            </Col>
            <Col>
              <p>
                <strong>{totals && fromMoney(totals['totalCashback'])}</strong>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    user: state.auth.user,
    bookings: state.accountMember.bookings,
    selectedBookings: state.accountMember.selectedBookings,
    categories: state.publicData.categories,
    isUserSignedIn: state.auth.isUserSignedIn,
    totalTax: state.tax.tax,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_OFFERS,
    },
    globalProps: {
      headTitle: 'Checkout',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
