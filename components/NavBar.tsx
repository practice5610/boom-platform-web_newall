import { AllOptionalExceptFor, Booking, BoomUser } from '@boom-platform/globals';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import { DEFAULT_INIT_URL_FOR_MERCHANTS } from '../constants';
import actionCreators from '../redux/actions';
import { requestLogout } from '../redux/actions/auth';
import { AppState } from '../redux/reducers';
import { getIsMerchant } from '../redux/selectors';
import { base64ToImageSrc } from '../utils/image-utils';
import { formatPhoneForFirebaseAuth } from '../utils/phone';
import Avatar from './Avatar';
import InputProductsSearch from './InputProductsSearch';
import RenderIf from './utils/RenderIf';

type Props = {
  isUserSignedIn?: boolean;
  requestLogout?: typeof requestLogout;
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  isMerchant?: boolean;
  activeTab?: string;
  bookings?: Booking[];
};

const NavBar: FC<Props> = ({
  user,
  isUserSignedIn = false,
  requestLogout,
  isMerchant,
  activeTab,
  bookings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  /**
   * TODO: Improve this to make Moob Web responsive. Right now, the values are calculated only once when the component is mounted
   */
  useEffect(() => {
    if (window && window.innerWidth) setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (bookings) setBookingsCount(bookings.length);
  }, [bookings]);

  const _onBoomLogoClick = () => {
    Router.push('/');
  };

  const _onToggle = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const _getUserLabel = () => {
    if (!user) {
      return '';
    }

    let label = '';

    if (user.firstName) {
      label = `Hello! ${user.firstName}`;
    } else {
      if (user.contact?.emails?.length) {
        label = user.contact.emails[0];
      } else if (user.contact?.phoneNumber && user.contact.phoneNumber !== '') {
        label = formatPhoneForFirebaseAuth(user.contact.phoneNumber) || 'Moob Customer';
      }
    }

    if (label.length > 0) {
      return label;
    }

    return label;
  };

  return (
    <div className='NavBar'>
      <Navbar expand='md' className='nav1'>
        <NavbarBrand>
          <div className='logo' onClick={_onBoomLogoClick}>
            <Image
              width={200}
              height={100}
              alt='Moob Logo'
              src={
                !isUserSignedIn || (isUserSignedIn && !isMerchant)
                  ? '/images/moob-marketplace-logo-white.svg'
                  : '/images/moob-marketplace-logo-white.svg'
              }
            />
          </div>
        </NavbarBrand>
        <InputProductsSearch />

        <div className='nav-right-side justify-content-space-between'>
          <NavbarToggler onClick={_onToggle} className='mr-2'>
            <i className='fa fa-bars' aria-hidden='true' />
          </NavbarToggler>
          <Nav>
            <RenderIf condition={!isUserSignedIn}>
              {width > 768 && (
                <UncontrolledDropdown>
                  <DropdownToggle tag='div' className='nav-link sign-in-dropdown'>
                    Sign In
                    <i className='fa fa-angle-down caret-down' aria-hidden='true' />
                  </DropdownToggle>
                  <DropdownMenu className='logged-out'>
                    <span className='dropdown-menu-arrow'></span>
                    <DropdownItem>
                      <Link href='/account/login'>My Account</Link>
                    </DropdownItem>
                    <hr />
                    <DropdownItem>
                      <Link href='/signup/customer'>Create a Moob Marketplace Account</Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
              {width > 768 && (
                <UncontrolledDropdown>
                  <DropdownToggle tag='div' className='nav-link sell-on-moob-dropdown'>
                    Sell on Moob
                    <i className='fa fa-angle-down caret-down' aria-hidden='true' />
                  </DropdownToggle>
                  <DropdownMenu className='logged-out'>
                    <span className='dropdown-menu-arrow'></span>
                    <DropdownItem>
                      <Link href='/account/login'>My Store</Link>
                    </DropdownItem>
                    <hr />
                    <DropdownItem>
                      <Link href='/signup/merchant'>Become a Moob Merchant</Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
              <NavItem>
                <Link href='/account/customer/bookings'>
                  <div className='nav-link cart'>
                    <img
                      alt='Shopping Cart Icon'
                      className='cart-icon'
                      src='/images/iconcart64-01.svg'
                    ></img>
                    <span className='count badge badge-warning item-count'>
                      {bookingsCount === null ? 0 : bookingsCount}
                    </span>
                  </div>
                </Link>
              </NavItem>
            </RenderIf>
            <RenderIf condition={isUserSignedIn}>
              <div className='link-with-avatar d-none d-md-flex align-items-center'>
                <Avatar
                  className='mr-2'
                  src={
                    user?.profileImg?.previewBase64Data
                      ? base64ToImageSrc(user.profileImg.previewBase64Data) || ''
                      : '/images/profile-icon.png'
                  }
                />
                <UncontrolledDropdown>
                  <DropdownToggle tag='div' className='nav-link dropdown'>
                    {_getUserLabel()}
                    <i className='fa fa-angle-down caret-down' aria-hidden='true' />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <span className='dropdown-menu-arrow'></span>
                    <RenderIf condition={!!isMerchant}>
                      <DropdownItem>
                        {/**
                         * Once we finish the redesign for the merchant account, this will change to the merchant dashboard instead of products
                         */}
                        <Link href={DEFAULT_INIT_URL_FOR_MERCHANTS}>My Account</Link>
                      </DropdownItem>
                      <hr />
                      <DropdownItem>
                        <Link href='/account/merchant/settings'>Settings</Link>
                      </DropdownItem>
                      <hr />
                    </RenderIf>
                    <DropdownItem className='logout' tag='button' onClick={() => requestLogout?.()}>
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <RenderIf condition={!isMerchant}>
                  <NavItem>
                    <Link href='/account/customer/bookings'>
                      <div className='nav-link cart'>
                        <img
                          alt='Shopping Cart Icon'
                          className='cart-icon'
                          src='/images/iconcart64-01.svg'
                        ></img>
                        <span className='count badge badge-warning item-count'>
                          {bookingsCount === null ? 0 : bookingsCount}
                        </span>
                      </div>
                    </Link>
                  </NavItem>
                </RenderIf>
              </div>
              <NavItem className='d-block d-md-none'>
                <button className='nav-link' onClick={() => requestLogout?.()}>
                  Log Out
                </button>
              </NavItem>
            </RenderIf>
          </Nav>
        </div>
      </Navbar>
      <RenderIf condition={!isUserSignedIn}>
        <Navbar expand='md' className='nav2'>
          <Collapse isOpen={isOpen} navbar className='justify-content-center'>
            <Nav navbar className='align-items-end align-items-md-center'>
              <NavItem>
                <Link href='/docs/about'>
                  <div className='nav-link row-2'>What Is Moob Marketplace</div>
                </Link>
              </NavItem>
              <NavItem>
                <Link href='/docs/getApp'>
                  <div className='nav-link row-2'>Get the Moob App</div>
                </Link>
              </NavItem>
              {/**  <NavItem>
                <Link href='/'>
                  <div className='nav-link row-2'>Moob Solutions</div>
                </Link>
              </NavItem>
            /** */}
              <NavItem>
                <UncontrolledDropdown>
                  <DropdownToggle tag='div' className='nav-link dropdown row-2'>
                    Support <i className='fa fa-angle-down caret-down' aria-hidden='true' />
                  </DropdownToggle>
                  <DropdownMenu className='resources-support-menu'>
                    <span className='dropdown-menu-arrow'></span>
                    <DropdownItem>
                      <Link href='/docs/member-faq'>Card Holder</Link>
                    </DropdownItem>
                    <DropdownItem>
                      <Link href='/docs/merchant-faq'>Business</Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                {/* <Link href='/'>
                  <div className='nav-link row-2'>Support</div>
                </Link> */}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </RenderIf>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  isUserSignedIn: state.auth.isUserSignedIn,
  bookings: state.accountMember.bookings,
  user: state.auth.user,
  isMerchant: getIsMerchant(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

NavBar.defaultProps = {
  activeTab: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
