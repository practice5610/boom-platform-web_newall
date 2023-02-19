import { fromMoney, Geolocation } from '@boom-platform/globals';
import { AxiosError } from 'axios';
import moment from 'moment';
import { NextPage, NextPageContext } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NextJSContext } from 'next-redux-wrapper';
import React, { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect, useSelector } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import {
  ElasticError,
  ElasticSearchResult,
  ProductSearchControlsCtx,
  ProductSearchResultsCtx,
  ProductSearchRunner,
  SearchableProduct,
  SearchFilterQualifier,
  SearchMatchRestriction,
} from '../components/search';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import useSearchControls, { SearchControlActions } from '../hooks/useSearchControls';
import useWindowSize, { WindowTypes } from '../hooks/useWindowSize';
import actionCreators from '../redux/actions';
import { AppState } from '../redux/reducers';
import { fetchCategories } from '../redux/sagas/search';

interface Props {
  geoLocation?: Geolocation;
  ipAddress?: string;
}

const SearchPage: NextPage<Props> = () => {
  const searchControl = useContext(ProductSearchControlsCtx);

  const [debug, setDebug] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const screen = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    console.log('HI');
    //searchControl?.resetRules();
    //control?.dispatch(SearchControlActions.clearFilter([]));
    //const { n, d, m, c, sc, s, p, l, k } = router.query;
    const q = router.query;

    ['name', 'description', 'price', 'category', 'subCategory', 'merchantUID'].forEach((key) => {
      switch (key) {
        case 'name':
          if (!q.n) {
            searchControl?.addRule(
              'name',
              '',
              SearchMatchRestriction.None,
              SearchFilterQualifier.None
            );
            //searchControl?.removeRule('name');
          }
          break;
        case 'description':
          if (!q.d) {
            searchControl?.addRule(
              'description',
              '',
              SearchMatchRestriction.None,
              SearchFilterQualifier.None
            );
            //searchControl?.removeRule('description');
          }
          break;
        // case 'distance_sort':
        //   if (!q.s) {
        //     rulesToClear.push('distance');
        //   }
        //   break;
        // case 'distance_km':
        //   if (!q.k) {
        //     rulesToClear.push('distance_km');
        //   }
        //   break;
        case 'price':
          if (!q.p) {
            searchControl?.removeRule('price');
          }
          break;
        case 'subCategory':
          if (!q.sc) {
            searchControl?.removeRule('subCategoryName');
          }
          break;
        case 'category':
          if (!q.c) {
            searchControl?.removeRule('subCategoryName');
            searchControl?.removeRule('categoryName');
          }
          break;
        case 'merchantUID':
          if (!q.m) {
            searchControl?.removeRule('merchantUID');
          }
          break;
      }
    });

    Object.keys(q).forEach((key) => {
      const value = q[key];
      switch (key) {
        //name
        case 'n':
          if (value) {
            searchControl?.addRule(
              'name',
              `*${value}*`,
              SearchMatchRestriction.Should,
              SearchFilterQualifier.Wildcard
            );
          } else {
            searchControl?.removeRule('name');
          }
          break;
        //description
        case 'd':
          if (value) {
            searchControl?.addRule(
              'description',
              `*${value}*`,
              SearchMatchRestriction.Should,
              SearchFilterQualifier.Wildcard
            );
          } else {
            searchControl?.removeRule('description');
          }
          break;
        //merchantUID
        case 'm':
          if (value) {
            searchControl?.addRule(
              'merchantUID',
              `${value.slice(0, 24)}`,
              SearchMatchRestriction.Must,
              SearchFilterQualifier.Exact
            );
          } else {
            searchControl?.removeRule('merchantUID');
          }
          break;
        //category
        case 'c':
          if (value) {
            searchControl?.addRule(
              'categoryName',
              `${value}`,
              SearchMatchRestriction.Must,
              SearchFilterQualifier.Exact
            );
          } else {
            searchControl?.removeRule('categoryName');
          }
          break;
        //subcategory
        case 'sc':
          if (value) {
            searchControl?.addRule(
              'subCategoryName',
              `${value}`,
              SearchMatchRestriction.Must,
              SearchFilterQualifier.Exact
            );
          } else {
            searchControl?.removeRule('subCategoryName');
          }
          break;
        //sort
        case 's':
          break;
        //price
        case 'p':
          if (value) {
            searchControl?.addRule(
              'price',
              value,
              SearchMatchRestriction.Nested,
              SearchFilterQualifier.Exact
            );
          } else {
            searchControl?.removeRule('price');
          }

          break;
        //location
        case 'l':
          break;
        //distance_km
        case 'k':
          break;

        default:
          break;
      }
    });
  }, [
    router.query?.s,
    router.query?.p,
    router.query?.l,
    router.query?.k,
    router.query?.n,
    router.query?.d,
    router.query?.m,
    router.query?.c,
    router.query?.sc,
  ]);
  return (
    <div className={'searchPage'}>
      {/* <div>{JSON.stringify(router.query)}</div> */}
      {searchControl?.search && (
        <ProductSearchRunner enabled={true} search={searchControl?.search} useType='scroll'>
          {(screen.type === WindowTypes.DESKTOP || showFilters) && (
            <SearchFilters toggle={() => setShowFilters(!showFilters)} />
          )}
          <div className={'results'}>
            <>
              <div>
                <div className={'display-flex border'}>
                  <div className={'flex1'}></div>
                  <div>debug</div>
                  <input
                    type={'checkbox'}
                    id={'debug'}
                    checked={debug}
                    onChange={() => setDebug(!debug)}
                  />
                </div>
                {screen.type === WindowTypes.MOBILE && (
                  <div className={'display-flex border'}>
                    <Button onClick={() => setShowFilters(!showFilters)}>Filters</Button>
                  </div>
                )}
              </div>
              <ProductSearchResultsCtx.Consumer>
                {(results) => {
                  return (
                    <div>
                      {debug && (
                        <div>
                          {Object.keys(searchControl?.search.query)?.map((key) => {
                            return (
                              <div
                                key={key}
                                className={'display-flex border width100 justify-content-start'}
                              >
                                <div className={'flex1 border'}>{`${key}: ${JSON.stringify(
                                  searchControl.search.query[key]
                                )}`}</div>
                                <div className={'flex1'}>
                                  <div className={''}>{`matchRules: ${JSON.stringify(
                                    searchControl.search.rules.matchRules[key]
                                  )}`}</div>
                                  <div className={''}>{`qualifierRules: ${JSON.stringify(
                                    searchControl.search.rules.qualifierRules[key]
                                  )}`}</div>
                                </div>
                              </div>
                            );
                          })}
                          <div>{JSON.stringify({ ...results, data: results?.data?.length })}</div>
                        </div>
                      )}
                      {!searchControl?.search.query.categoryName &&
                      !searchControl?.search.query?.description &&
                      !searchControl?.search.query?.name &&
                      !searchControl.search.query.merchantUID ? (
                        <>Search for a product or select a category</>
                      ) : (
                        <SearchResults results={results} />
                      )}
                    </div>
                  );
                }}
              </ProductSearchResultsCtx.Consumer>
            </>
          </div>
        </ProductSearchRunner>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

const mapStateToProps = (state: AppState) => {
  return {
    geoLocation: state.app.geolocation,
    ipAddress: state.app.ipAddress,
  };
};

type PageContext = NextJSContext & NextPageContext;

export async function getStaticProps(ctx: PageContext) {
  if (ctx.isServer) {
    const { data: categories } = await fetchCategories();
    return { props: { categories } };
  }
  return { props: {} };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
