import { AddressInfo, Booking, BoomUser } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { BoookingTable } from '../../../components/customer/myCart/bookingTable';
import { ShippingAddressSelection } from '../../../components/customer/myCart/shippingAddressSelection';
import { SubtotalCheckout } from '../../../components/customer/myCart/subtotalCheckout';
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
  useEffect(() => {}, [bookings]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInfo>();
  const handleSetSelectedAddress = (address: AddressInfo) => {
    setSelectedAddress(address);
  };
  return (
    <Row>
      <Col sm='9'>
        <BoookingTable
          results={bookings}
          selectBooking={selectBooking}
          deleteBooking={deleteBooking}
          // totalTax={totalTax}
        />
      </Col>
      <Col sm='3' className='pt-4 mt-5'>
        <ShippingAddressSelection
          user={user}
          handleSetSelectedAddress={handleSetSelectedAddress}
          selectedAddress={selectedAddress}
        />
        <br />
        <SubtotalCheckout results={bookings} />
      </Col>
    </Row>
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
      headTitle: 'Bookings',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
