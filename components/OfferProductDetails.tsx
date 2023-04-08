import {
  Booking,
  BookingStatus,
  BookingTypes,
  BoomUser,
  fromMoney,
  isOffer,
  isProduct,
  Offer,
  Product,
} from '@boom-platform/globals';
import moment from 'moment';
import Link from 'next/link';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { ProductHit } from '../models/product-hit.model';
import actionCreators from '../redux/actions';
import { addBookings } from '../redux/actions/account-member';
import { AppState } from '../redux/reducers';
import { replaceDomain } from '../utils/images';
import HTMLContent from './HTMLContent';

interface Props {
  user?: BoomUser;
  itemType?: string;
  item?: Offer | Product;
  itemStatus?: string;
  storeOffers?: ProductHit[];
  isUserSignedIn?: boolean;
  bookings?: Booking[];
  addBookings?: typeof addBookings;
}

const OfferProductDetails: React.FunctionComponent<Props> = (props) => {
  const [counter, setCounter] = useState(1);
  const [activeTab, setActiveTab] = useState('1');
  const [productData, setProductData] = useState(props.item);
  console.log('productdata', productData);

  useEffect(() => {
    setProductData(props.item);
  }, [props.item]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const _onCounterChange = (op) => {
    let newCount = counter;
    if (op === 'inc') {
      newCount = counter + 1;
    } else if (counter > 1) {
      newCount = counter - 1;
    }
    setCounter(newCount);
  };
  const onAddCart = () => {
    if (props.item && props.user?.uid && props.addBookings) {
      const newBooking: Booking = {
        type: isOffer(props.item) ? BookingTypes.OFFER : BookingTypes.PRODUCT,
        item: props.item,
        quantity: counter,
        status: BookingStatus.ACTIVE,
        memberUID: props.user.uid,
        visits: 1,
      };
      props.addBookings(newBooking);
    }
  };

  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return productData && Object.keys(productData).length > 0 ? (
    <div className='position-relative'>
      <div className='offer-container container d-flex justify-content-center'>
        <div className='align-items-start offer-image'>
          <div className=''>
            <img
              width='364px'
              height='368px'
              src={
                (isOffer(productData) && replaceDomain(productData.product.imageUrl)) ||
                (isProduct(productData) && replaceDomain(productData.imageUrl)) ||
                'https://via.placeholder.com/314'
              }
              alt=''
            />
          </div>
        </div>
        <div className='align-items-end w-100'>
          <div className='offer-details'>
            <h1>
              {(isOffer(productData) && productData.product.name) ||
                (isProduct(productData) && productData.name) ||
                'Product Name'}
            </h1>
            <Link
              href={`/store/${
                isOffer(productData) ? productData.product.store?._id : productData.store?._id
              }`}
            >
              {isOffer(productData)
                ? productData.product.store?.companyName
                : productData.store?.companyName}
            </Link>

            <div className='d-flex align-items-center'>
              <span>
                {(isOffer(productData) && fromMoney(productData.product.price)) ||
                  (isProduct(productData) && fromMoney(productData.price))}
              </span>
            </div>

            {isOffer(productData) && (
              <React.Fragment>
                <div className='d-flex align-items-center'>
                  <i className='fa fa-arrow-left' aria-hidden='true' />
                  <i className='fa fa-usd fa-usd-green fa-2x' aria-hidden='true' />
                  <span>{`Cashback: ${fromMoney(productData.cashBackPerVisit)}`}</span>
                </div>
                <div className='d-flex align-items-center ml-0'>
                  <i className='fa fa-clock-o fa-2x fa-flip-horizontal' aria-hidden='true' />
                  <span>
                    {productData.expiration &&
                      `End Date: ${moment.unix(productData.expiration).local().format('MM/DD/YY')}`}
                  </span>
                </div>
              </React.Fragment>
            )}
            {/* <!-- Details & Conditions --> */}
            <div>
              <h4 className='pt-3'>Attributes</h4>
              {(isOffer(productData) &&
                productData.product.attributes &&
                Object.entries(productData.product.attributes).map((attr, index) => (
                  <div key={index}>
                    <small>{`${attr[0]}: ${attr[1]}`}</small>
                  </div>
                ))) ||
                (isProduct(productData) &&
                  productData.attributes &&
                  Object.entries(productData.attributes).map((attr, index) => (
                    <div key={index}>
                      <small>{`${capitalize(attr[0].replace('_', ' '))}: ${attr[1]}`}</small>
                    </div>
                  )))}
            </div>
            <br />
            <span>
              <i
                className='fa fa-minus-circle bg-black'
                aria-hidden='true'
                onClick={() => _onCounterChange('dec')}
              />
              {counter}
              <i
                className='fa fa-plus-circle bg-black'
                aria-hidden='true'
                onClick={() => _onCounterChange('inc')}
              />
            </span>
            <br />
            <button className='btn bg-red' onClick={onAddCart}>
              <i className='fa fa-shopping-cart' aria-hidden='true' />
              Add to Cart
            </button>

            <button style={{ marginLeft: '5px' }} className='btn bg-red'>
              <Link href='/'>Back</Link>
            </button>
            <br />
            <br />
            <div>
              <Nav tabs className='nav-justified'>
                <NavItem>
                  <NavLink
                    className={activeTab === '1' ? 'active border-0' : ''}
                    onClick={() => {
                      toggle('1');
                    }}
                  >
                    Description
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === '2' ? 'active border-0' : ''}
                    onClick={() => {
                      toggle('2');
                    }}
                  >
                    Review
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <Row>
                    <Col sm='12'>
                      <div className='tab-content'>
                        <HTMLContent
                          content={
                            (isOffer(productData) && productData.product.description) ||
                            (isProduct(productData) && productData.description) ||
                            ''
                          }
                          tag={'div'}
                          className={'descr'}
                        />
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId='2'>
                  <i className='fa fa-star' />
                  <i className='fa fa-star' />
                  <i className='fa fa-star' />
                  <i className='fa fa-star' />
                  <i className='fa fa-star' />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </div>
      </div>
      <div className='offer-button'>
        <Button className='bg-red' color='red' onClick={() => window.scrollTo(0, 0)}>
          Go back to top
        </Button>
      </div>
    </div>
  ) : (
    <div style={{ minHeight: '400px', textAlign: 'center' }}>
      <div className='loading'>Loading...</div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  // categories: state.storesConfig.storeCategories,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OfferProductDetails);
