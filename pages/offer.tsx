import {
  AllOptionalExceptFor,
  Booking,
  BookingTypes,
  BoomUser,
  isOffer,
  Offer,
  Product,
} from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import OfferProductDetails from '../components/OfferProductDetails';
import { ProductHit } from '../models/product-hit.model';
import actionCreators from '../redux/actions';
import { addBookings } from '../redux/actions/account-member';
import { setBookings } from '../redux/actions/account-member';
import { requestOfferAndStoreOffersDetails } from '../redux/actions/offers';
import { requestProductDetailsAndStoreOffers } from '../redux/actions/products';
import { AppState } from '../redux/reducers';
import { getStoreOffers } from '../redux/selectors';
import { GlobalProps, NextLayoutPage } from '../types';
import { isServer } from '../utils/environment';

interface Props {
  id: string;
  itemType: string;
  offer?: Offer;
  product?: Product;
  offerStatus?: string;
  results?: ProductHit[];
  productStatus?: string;
  isUserSignedIn?: boolean;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  addBookings?: typeof addBookings;
  setBookings?: typeof setBookings;
  bookings?: Booking[];
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({
  id,
  itemType,
  offer,
  results,
  offerStatus,
  isUserSignedIn,
  addBookings,
  bookings,
  product,
  productStatus,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (id === '' && router) {
      router.replace('/');
    }
  }, [id, router]);

  const item: Offer | Product | undefined = itemType === 'offer' ? offer : product;

  const onAddCart = (quantity: number, qstatus: string) => {
    const booking = {} as Booking; //FIXME: Remove the 'as' and review the interface used for bookings interface it should match what the data on the controller is waiting for
    booking.quantity = Number(quantity);

    //const item: Offer | Product | undefined = itemType === 'offer' ? offer : product;

    if (item) {
      // TODO: check why the type guard is not enough here and we need to check for cashBackPerVisit and maxQuantity
      if (isOffer(item) && offer?.cashBackPerVisit && offer?.maxQuantity)
        booking.type = BookingTypes.OFFER;
      else booking.type = BookingTypes.PRODUCT;
      //if (user!.uid !== undefined) booking.memberUID = user!.uid;

      booking.item = item;

      addBookings?.(booking);
    } else {
      throw Error('Item undefined');
    }
  };

  return (
    <>
      {item && (
        <OfferProductDetails
          itemType={itemType}
          itemStatus={itemType === 'offer' ? offerStatus : productStatus}
          item={item}
          storeOffers={results}
          isUserSignedIn={isUserSignedIn}
          bookings={bookings}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    results: getStoreOffers(state, 'offers'),
    offer: state.offers.offerDetails,
    offerStatus: state.offers.offerStatus,
    productStatus: state.products.productStatus,
    categories: state.publicData.categories,
    isUserSignedIn: state.auth.isUserSignedIn,
    user: state.auth.user,
    bookings: state.accountMember.bookings,
    product: state.products.productDetails,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext): Promise<Props> => {
  let id: string = '';
  let itemType: string = '';
  if (reduxContext?.query?.id) {
    id = reduxContext.query.id.toString();
    itemType = reduxContext.query.itemType ? reduxContext.query.itemType?.toString() : 'offer';
    if (itemType === 'offer') {
      reduxContext.store.dispatch(requestOfferAndStoreOffersDetails(id));
    } else if (itemType === 'product') {
      reduxContext.store.dispatch(requestProductDetailsAndStoreOffers(id));
    }
  } else if (isServer && reduxContext?.res) {
    reduxContext.res.writeHead(302, { Location: '/' });
    reduxContext.res.end();
  }
  return {
    id,
    itemType,
    globalProps: {
      headTitle: 'Offer',
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
