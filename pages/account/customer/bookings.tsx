import { AddressInfo, Booking, BoomUser, Order, Transaction } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row, Spinner } from 'reactstrap';
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
  checkoutOrder,
  deleteBooking,
  requestBookings,
  selectBooking,
} from '../../../redux/actions/account-member';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';
import LoadingOverlay from 'react-loading-overlay';
interface Props {
  user?: BoomUser;
  // transactions?: Transaction[];
  bookings?: Booking[];
  selectedBookings?: boolean[];
  selectBooking?: typeof selectBooking;
  deleteBooking?: typeof deleteBooking;
  checkoutBookings?: typeof checkoutBookings;
  checkoutOrder?: typeof checkoutOrder;
  requestBookings?: typeof requestBookings;
  totalTax?: Tax[] | undefined | null;
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  user,
  bookings,
  // transactions,
  deleteBooking,
  selectBooking,
  requestBookings,
  checkoutOrder,
  // selectedBookings,
  checkoutBookings,
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
  console.log('chekcaddress1233', bookings);
  console.log('chekcaddress', user?.uid, user?.addresses && user?.addresses[0]);
  // console.log('chekcaddress12', transactions);
  const [loader, setloader] = useState(false);
  const orderGroups = [
    {
      store: 'newstore',
      bookings: bookings,
      shippable: true,
      rates: 'rates',
      selectedRate: { shippo_id: 'asim56101shipoid' },
    },
  ];
  const order = {
    shipToAddress: user?.addresses && user?.addresses[0],
    customerUID: user?.uid,
    transactions: [],
    orderGroups: orderGroups,
  };
  useEffect(() => {
    if (bookings) {
      setloader(false);
    } else {
      setloader(true);
    }
  }, [bookings, order]);
  const handledCheckout = () => {
    // checkoutBookings?.(bookings);
    checkoutOrder?.(order);
    console.log('yesworking11', order);
    setloader(true);
    // console.log('yesworking', results);
    // router.push('/account/customer/checkout');
  };
  console.log('yesworking11', bookings);
  return (
    <LoadingOverlay
      active={loader}
      spinner={<Spinner color='white' />}
      styles={{
        content: (base: any) => ({
          ...base,
          marginTop: '50vh',
        }),
      }}
      text='Please wait...'
    >
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
          <SubtotalCheckout handleSetSelectedAddress={handledCheckout} results={bookings} />
        </Col>
      </Row>
    </LoadingOverlay>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    // transactions: state.accountMember.transactions,
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
