import clsx from 'clsx';
import Link from 'next/link';
import Router from 'next/router';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import { DEFAULT_INIT_URL_FOR_CUSTOMERS, LayoutTabs } from '../constants';

interface Props {
  activeTab: string;
}

const NavAccount: FunctionComponent<Props> = ({ activeTab }) => {
  const [currentTabName, setCurrentTabName] = useState<
    | LayoutTabs.TAB_TRANSACTIONS
    | LayoutTabs.TAB_OFFERS
    | LayoutTabs.TAB_SETTINGS
    | LayoutTabs.TAB_FUNDING
    | LayoutTabs.TAB_RETURNS_AND_ORDERS
    | ''
  >('');

  const reviewRouterPath = useCallback((url) => {
    switch (url) {
      case DEFAULT_INIT_URL_FOR_CUSTOMERS:
        setCurrentTabName(LayoutTabs.TAB_TRANSACTIONS);
        break;
      case '/account/customer/bookings':
        setCurrentTabName(LayoutTabs.TAB_OFFERS);
        break;
      case '/account/customer/settings':
        setCurrentTabName(LayoutTabs.TAB_SETTINGS);
        break;
      case '/account/customer/funds':
        setCurrentTabName(LayoutTabs.TAB_FUNDING);
        break;
      case '/account/customer/returns_and_orders':
        setCurrentTabName(LayoutTabs.TAB_RETURNS_AND_ORDERS);
        break;
      default:
        setCurrentTabName('');
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      reviewRouterPath(url);
    };

    Router.events.on('routeChangeStart', handleRouteChange);
    reviewRouterPath(Router.pathname);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      Router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [reviewRouterPath]);

  return (
    <nav className='NavAccount d-flex w-100'>
      <Link href={DEFAULT_INIT_URL_FOR_CUSTOMERS}>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_TRANSACTIONS,
          })}
        >
          ACCOUNT
        </Button>
      </Link>
      <Link href='/account/customer/bookings'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_OFFERS,
          })}
        >
          BOOKED OFFERS
        </Button>
      </Link>
      <Link href='/account/customer/settings'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_SETTINGS,
          })}
        >
          SETTINGS
        </Button>
      </Link>
      <Link href='/account/customer/funds'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_FUNDING,
          })}
        >
          FUNDING
        </Button>
      </Link>
      <Link href='/account/customer/returns_and_orders'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_RETURNS_AND_ORDERS,
          })}
        >
          RETURNS & ORDERS
        </Button>
      </Link>
      <Link href='/'>
        <Button>ALL PRODUCTS</Button>
      </Link>
    </nav>
  );
};

export default NavAccount;
