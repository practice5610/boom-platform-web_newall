import clsx from 'clsx';
import Link from 'next/link';
import Router from 'next/router';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Button } from 'reactstrap';

import { DEFAULT_INIT_URL_FOR_MERCHANTS, LayoutTabs } from '../constants';

interface Props {
  activeTab: string;
}

const NavMerchant: FunctionComponent<Props> = ({ activeTab }) => {
  const [currentTabName, setCurrentTabName] = useState<
    | LayoutTabs.TAB_MERCHANT_INVENTORY
    | LayoutTabs.TAB_MERCHANT_OFFERS
    | LayoutTabs.TAB_MERCHANT_PRODUCTS
    | LayoutTabs.TAB_MERCHANT_WITHDRAWALS
    | LayoutTabs.TAB_MERCHANT_TRANSACTIONS
    | ''
  >('');

  const reviewRouterPath = useCallback((url) => {
    switch (url) {
      case '/account/merchant/inventory':
        setCurrentTabName(LayoutTabs.TAB_MERCHANT_INVENTORY);
        break;
      case '/account/merchant/offers':
        setCurrentTabName(LayoutTabs.TAB_MERCHANT_OFFERS);
        break;
      case DEFAULT_INIT_URL_FOR_MERCHANTS:
        setCurrentTabName(LayoutTabs.TAB_MERCHANT_PRODUCTS);
        break;
      case '/account/merchant/withdrawals':
        setCurrentTabName(LayoutTabs.TAB_MERCHANT_WITHDRAWALS);
        break;
      case '/account/merchant/transactions':
        setCurrentTabName(LayoutTabs.TAB_MERCHANT_TRANSACTIONS);
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
      <Link href='/account/merchant/inventory'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_MERCHANT_INVENTORY,
          })}
        >
          MY EQUIPMENT
        </Button>
      </Link>
      <Link href='/account/merchant/offers'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_MERCHANT_OFFERS,
          })}
        >
          OFFERS
        </Button>
      </Link>
      <Link href={DEFAULT_INIT_URL_FOR_MERCHANTS}>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_MERCHANT_PRODUCTS,
          })}
        >
          PRODUCTS
        </Button>
      </Link>
      <Link href='/account/merchant/withdrawals'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_MERCHANT_WITHDRAWALS,
          })}
        >
          WITHDRAWALS
        </Button>
      </Link>
      <Link href='/account/merchant/transactions'>
        <Button
          className={clsx({
            active: currentTabName === LayoutTabs.TAB_MERCHANT_TRANSACTIONS,
          })}
        >
          TRANSACTIONS
        </Button>
      </Link>
    </nav>
  );
};

export default NavMerchant;
