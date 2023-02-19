import { Offer } from '@boom-platform/globals';
import { NextPageContext } from 'next';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getLayout } from '../../../components/LayoutAccount';
import { FilterableOffersTable } from '../../../components/merchant/offers/FilterableOffersTable';
import { PageData } from '../../../components/merchant/Pagination';
import { LayoutTabs } from '../../../constants';
import actionCreators from '../../../redux/actions';
import { requestFilteredOffers } from '../../../redux/actions/account-merchant';
import { AppState } from '../../../redux/reducers';
import { GlobalProps, LayoutAccountProps, NextLayoutPage } from '../../../types';

interface Props {
  requestFilteredOffers?: typeof requestFilteredOffers;
  offers?: { offers: Offer[]; count: number };
  layoutProps: LayoutAccountProps;
  globalProps: GlobalProps;
}

const Page: NextLayoutPage<Props> = ({ requestFilteredOffers, offers }) => {
  const [filterState, setFilterState] = useState<string>('');
  const offersList = offers ?? { offers: [], count: 0 };

  /**
   * This function dispatch the action to fetch offers depends on page selected on Pagination.
   * @param data
   */
  const onPageChanged = (data: PageData) => {
    const { currentPage } = data;
    requestFilteredOffers?.(filterState, 10, currentPage * 10 - 10);
  };

  /**
   * This function set the filter state and dispatch an action to fetch offer by that filter.
   * @param filter
   */
  const onFilterChanged = (filter: string) => {
    setFilterState(filter);
    requestFilteredOffers?.(filter, 10, 0);
  };
  return (
    <>
      <FilterableOffersTable
        title='Your offer list'
        offers={offersList}
        onPageChanged={onPageChanged}
        onFilterChanged={onFilterChanged}
      />
      {/* <HeaderAccount title='Current Offers' />
      <MerchantActiveOffers /> */}
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  offers: state.accountMerchant.offers,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

type PageContext = NextJSContext & NextPageContext;

Page.getInitialProps = async (reduxContext: PageContext) => {
  return {
    layoutProps: {
      activeTab: LayoutTabs.TAB_MERCHANT_OFFERS,
    },
    globalProps: {
      headTitle: 'Merchant Offers',
    },
  };
};

Page.getLayout = getLayout;

export default connect(mapStateToProps, mapDispatchToProps)(Page);
