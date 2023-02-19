import { fromMoney, Geolocation } from '@boom-platform/globals';
import { AxiosError } from 'axios';
import moment from 'moment';
import { NextPage, NextPageContext } from 'next';
import Image from 'next/image';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { InfiniteQueryResult } from 'react-query';
import { connect, useSelector } from 'react-redux';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'reactstrap';

import useSearchControls, {
  SearchControlActions,
  SearchControllerI,
  SearchControlsAction,
} from '../../hooks/useSearchControls';
import useWindowSize, { WindowTypes } from '../../hooks/useWindowSize';
import {
  ElasticError,
  ElasticSearchResult,
  ProductSearchControlsCtx,
  ProductSearchResultsCtx,
  ProductSearchRunner,
  SearchableProduct,
} from '.';
import { ProductSearchResultMetadataCtx } from './search-contexts';
import SearchFilterDropDown from './SearchFilterDropDown';
import SearchFilterLabel from './SearchFilterLabel';
import SearchFilterList from './SearchFilterList';
import SearchFilterMaxDistance from './SearchFilterMaxDistance';
import PriceFilter from './SearchFilterPrice';

const SearchFilters: React.FC<{ toggle?: () => void }> = ({ toggle }) => {
  const controls = useSearchControls();
  const metaData = useContext(ProductSearchResultMetadataCtx);
  const screen = useWindowSize();
  return (
    <div className={screen.type === WindowTypes.DESKTOP ? 'filters-desktop' : 'filters-mobile'}>
      <div className={'row border'}>
        <div className={'flex1'}>Filters</div>
        {screen.type === WindowTypes.MOBILE && <Button onClick={toggle}>{`Search >`}</Button>}
      </div>
      {/* {controls.filters?.category && (
        <SearchFilterLabel
          text={controls.filters.category}
          onClick={() => {
            controls.dispatch(
              SearchControlActions.clearFilter(['subCategoryName', 'categoryName'])
            );
          }}
        />
      )}
      {controls.filters?.category && controls.filters?.subCategory && (
        <div className={'indent'}>
          <SearchFilterLabel
            text={controls.filters.subCategory}
            onClick={() => {
              controls.dispatch(SearchControlActions.clearFilter(['subCategoryName']));
            }}
          />
        </div>
      )} */}
      <div className={'row topSpace'}>
        {controls.filters.merchantUID && (
          <SearchFilterLabel
            text={`Store:\n${controls.filters.merchantUID.slice(24)}`}
            onClick={() => {
              controls.dispatch(SearchControlActions.clearFilter(['merchantUID']));
            }}
          />
        )}
      </div>
      <div className={'row topSpace'}>
        {(controls.filters?.name || controls.filters?.description) && (
          <SearchFilterLabel
            text={`Search:\n${controls.filters.name ?? controls.filters.description}`}
            onClick={() => {
              controls.dispatch(SearchControlActions.clearFilter(['name', 'description']));
            }}
          />
        )}
      </div>
      <div className={'border row topSpace'}>
        {metaData && (
          <SearchFilterList
            data={metaData.prices}
            fn={{
              bucketToAction: metaData.prices.bucketToAction,
              isFilterSet: metaData.prices.isFilterSet,
            }}
            controls={controls}
          />
        )}
      </div>
      <div className={'border row topSpace'}>
        {metaData && (
          <SearchFilterList
            data={metaData.categories}
            fn={{
              bucketToAction: metaData.categories.bucketToAction,
              isFilterSet: metaData.categories.isFilterSet,
            }}
            controls={controls}
          />
        )}
      </div>
      {/* these location based filters need to be updated to work w new search routing */}
      {/* <div className={'border display-flex topSpace'}>
        <div className={'flex1'}>{`Search With\nLocation`}</div>
        <input
          className={'checkbox'}
          type={'checkbox'}
          checked={Boolean(controls.filters.distance_sort?.length)}
          onChange={() => {
            if (!controls?.filters.distance_sort) {
              controls.dispatch(SearchControlActions.changeSort('asc'));
            } else {
              controls.dispatch(SearchControlActions.changeSort(null));
            }
          }}
        />
      </div>
      {controls.filters?.distance_sort && (
        <div>
          <div className={'row topSpace border'}>
            <div className={'flex1'}>Sort by</div>
            <div className={'flex1'}>
              <SearchFilterDropDown
                initial={controls.filters.distance_sort}
                items={['asc', 'desc']}
                onChange={(selected) => {
                  if (selected === 'asc' || selected === 'desc')
                    controls.dispatch(SearchControlActions.changeSort(selected));
                }}
              />
            </div>
          </div>
          <div className={'row topSpace border'}>
            <SearchFilterMaxDistance
              distance={controls.filters.distance?.toString() ?? '10000'}
              units={controls.filters.distance_units}
              onSubmit={(state) => {
                if (
                  controls.filters.distance_units !== state.units &&
                  (state.units === 'km' || state.units === 'miles')
                )
                  controls.dispatch(SearchControlActions.changeDistanceUnits(state.units));
                if (controls.filters.distance?.toString() !== state.distance)
                  controls.dispatch(SearchControlActions.changeMaxDistance(state.distance));
              }}
            />
          </div>

          <div>{`Your location:\n${JSON.stringify(controls.filters.location)}`}</div>
        </div>
      )} */}
    </div>
  );
};

export default SearchFilters;
