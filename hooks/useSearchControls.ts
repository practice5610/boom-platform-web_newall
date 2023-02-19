/* eslint-disable no-fallthrough */
import { Geolocation } from '@boom-platform/globals';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  BasicSearchProps,
  ProductSearchControlsCtx,
  SearchableGeoLocation,
  SearchFilterQualifier,
  SearchMatchRestriction,
  SearchProductControl,
  SearchProductControls,
} from '../components/search';
import { transformGeolocForSearchEngine } from '../components/search';
import { AppState } from '../redux/reducers';

interface SearchParamsState {
  n: string;
  d: string;
  m: string;
  c: string;
  sc: string;
  s: string;
  p: string;
  l: string;
  k: string;
}
interface SearchControlsState {
  filters: {
    name?: string;
    description?: string;
    distance?: 'asc' | 'desc';
    distance_km?: number;
    distance_units?: 'km' | 'miles';
    price?: any;
    category?: string;
    subCategory?: string;
    location?: SearchableGeoLocation;
    merchantUID?: string;
  };
}
export enum SearchControlsAction {
  CHANGE_TEXT = 'CHANGE_TEXT',
  CHANGE_CAT = 'CHANGE_CAT',
  CLEAR = 'CLEAR',
  CHANGE_DISTANCE_SORT = 'CHANGE_DISTANCE_SORT',
  CHANGE_PRICE = 'CHANGE_PRICE',
  CHANGE_DISTANCE = 'CHANGE_DISTANCE',
  CHANGE_DISTANCE_UNITS = 'CHANGE_DISTANCE_UNITS',
  CHANGE_LOCATION = 'CHANGE_LOCATION',
}

interface ChangeTextAction {
  type: SearchControlsAction.CHANGE_TEXT;
  payload: string;
}

interface ChangeCategoryI {
  name: string | null;
  subCat: string | null;
}
export interface ChangeCatAction {
  type: SearchControlsAction.CHANGE_CAT;
  payload: ChangeCategoryI;
}
export interface ClearFilterAction {
  type: SearchControlsAction.CLEAR;
  payload: (
    | keyof BasicSearchProps
    | 'name'
    | 'categoryName'
    | 'subCategoryName'
    | 'description'
    | 'brand'
    | 'price'
    | 'distance'
    | 'merchantUID'
  )[];
}

export interface ChangeDistanceSortAction {
  type: SearchControlsAction.CHANGE_DISTANCE_SORT;
  payload: 'asc' | 'desc' | null;
}
interface ChangePricePayloadI {
  min: number;
  max: number;
}
export interface ChangePriceFilterAction {
  type: SearchControlsAction.CHANGE_PRICE;
  payload: ChangePricePayloadI | null;
}

export interface ChangeMaxDistanceAction {
  type: SearchControlsAction.CHANGE_DISTANCE;
  payload: number;
}
export interface ChangeDistanceUnitsAction {
  type: SearchControlsAction.CHANGE_DISTANCE_UNITS;
  payload: 'km' | 'miles';
}
export interface ChangeLocationAction {
  type: SearchControlsAction.CHANGE_LOCATION;
  payload: SearchableGeoLocation;
}
export type SearchControlActionsType =
  | ChangeTextAction
  | ChangeCatAction
  | ClearFilterAction
  | ChangeDistanceSortAction
  | ChangePriceFilterAction
  | ChangeMaxDistanceAction
  | ChangeDistanceUnitsAction
  | ChangeLocationAction;

export const SearchControlActions: {
  changeText: (name: string) => ChangeTextAction;
  changeCategory: (catName: string, subCatName?: string) => ChangeCatAction;
  clearFilter: (items: ClearFilterAction['payload']) => ClearFilterAction;
  changeSort: (sort: 'asc' | 'desc' | null) => ChangeDistanceSortAction;
  changePrice: (min?: number, max?: number) => ChangePriceFilterAction;
  changeMaxDistance: (distance: number | string) => ChangeMaxDistanceAction;
  changeDistanceUnits: (distanceUnits: 'km' | 'miles') => ChangeDistanceUnitsAction;
  changeLocation: (location: SearchableGeoLocation) => ChangeLocationAction;
} = {
  changeText: (text: string) => ({ type: SearchControlsAction.CHANGE_TEXT, payload: text }),
  changeCategory: (catName: string, subCatName?: string) => ({
    type: SearchControlsAction.CHANGE_CAT,
    payload: { name: catName, subCat: subCatName ?? null },
  }),
  clearFilter: (items: ClearFilterAction['payload']) => ({
    type: SearchControlsAction.CLEAR,
    payload: items,
  }),
  changeSort: (sort: 'asc' | 'desc' | null) => ({
    type: SearchControlsAction.CHANGE_DISTANCE_SORT,
    payload: sort,
  }),
  changePrice: (min?: number, max?: number) => ({
    type: SearchControlsAction.CHANGE_PRICE,
    payload: !min && !max ? null : { min: min ?? 0, max: max ?? 0 },
  }),
  changeMaxDistance: (distance: number | string) => ({
    type: SearchControlsAction.CHANGE_DISTANCE,
    payload: typeof distance === 'string' ? parseInt(distance) : distance,
  }),
  changeDistanceUnits: (distanceUnits: 'km' | 'miles') => ({
    type: SearchControlsAction.CHANGE_DISTANCE_UNITS,
    payload: distanceUnits,
  }),
  changeLocation: (location: SearchableGeoLocation | null) => ({
    type: SearchControlsAction.CHANGE_LOCATION,
    payload: location ?? { lat: 0, lon: 0 },
  }),
};

export interface SearchControllerI {
  dispatch: (action: SearchControlActionsType) => void;
  filters: {
    name?: string;
    description?: string;
    distance?: number;
    distance_sort?: 'asc' | 'desc';
    distance_km?: number;
    distance_units: 'km' | 'miles';
    price?: any;
    category?: string;
    subCategory?: string;
    location?: SearchableGeoLocation;
    merchantUID?: string;
  };
  controlCtx: SearchProductControls | undefined;
}
export default function useSearchControls(): SearchControllerI {
  const control = useContext(ProductSearchControlsCtx);
  const location = useSelector<AppState, Geolocation | null>((state) => state?.app?.geolocation);
  const router = useRouter();
  const [units, setUnits] = useState<'km' | 'miles'>('km');

  useEffect(() => {
    control?.addRule(
      'location',
      transformGeolocForSearchEngine(location),
      SearchMatchRestriction.None,
      SearchFilterQualifier.None
    );
  }, [location]);

  const getControlState = useCallback(() => {
    const state: SearchControlsState = { filters: {} };
    if (router.query?.d) {
      state.filters.description = router.query.d as string;
    }
    if (router.query?.n) {
      state.filters.name = router.query.n as string;
    }
    if (router.query.s === 'a') {
      state.filters.distance = 'asc';
    }
    if (router.query.s === 'd') {
      state.filters.distance = 'desc';
    }
    if (router.query.p) {
      state.filters.price = router.query.p as string;
    }
    if (router.query.c) {
      state.filters.category = router.query.c as string;
    }
    if (router.query.sc) {
      state.filters.subCategory = router.query.sc as string;
    }
    if (router.query.m) {
      state.filters.merchantUID = router.query.m as string;
    }
    if (router.query.k) {
      state.filters.distance_km = parseInt(router.query.k as string);
    } else {
      state.filters.distance_km = 10000;
    }
    if (router.query.l) {
      state.filters.location = JSON.parse(router.query.l as string);
    } else {
      state.filters.location = transformGeolocForSearchEngine(location);
    }
    return state;
  }, [
    location,
    router.query.d,
    router.query.n,
    router.query.s,
    router.query.p,
    router.query.c,
    router.query.sc,
    router.query.k,
    router.query.l,
    router.query.m,
  ]);

  const changeParams = (params?: Partial<SearchParamsState>) => {
    const newParams = { ...(router.pathname === '/search' ? router.query : {}), ...params };
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] === undefined) {
        delete newParams[key];
      }
    });

    router.push({ pathname: '/search', query: { ...(params ? newParams : {}) } }, undefined, {
      shallow: true,
    });
    return params ? newParams : {};
  };
  const dispatch = (action: SearchControlActionsType) => {
    switch (action.type) {
      case SearchControlsAction.CHANGE_TEXT:
        changeParams({ n: action.payload, d: action.payload });
        break;
      // control?.addRule(
      //   'name',
      //   `*${action.payload}*`,
      //   SearchMatchRestriction.Should,
      //   SearchFilterQualifier.Wildcard
      // );
      // control?.addRule(
      //   'description',
      //   `*${action.payload}*`,
      //   SearchMatchRestriction.Should,
      //   SearchFilterQualifier.Wildcard
      // );
      // return getControlState(control);

      case SearchControlsAction.CHANGE_CAT:
        changeParams({
          c: action.payload.name ?? undefined,
          sc: action.payload.subCat ?? undefined,
        });
        break;
      // control?.addRule(
      //   'subCategoryName',
      //   action.payload.subCat,
      //   SearchMatchRestriction.Must,
      //   SearchFilterQualifier.Exact
      // );
      // control?.addRule(
      //   'categoryName',
      //   action.payload.name,
      //   SearchMatchRestriction.Must,
      //   SearchFilterQualifier.Exact
      // );
      // return getControlState(control);
      case SearchControlsAction.CLEAR:
        if (action.payload?.length) {
          const newParams = router.query;
          action.payload.forEach((rule) => {
            switch (rule) {
              case 'name':
                newParams.n = undefined;
                break;
              case 'description':
                newParams.d = undefined;
                break;
              case 'categoryName':
                newParams.c = undefined;
                break;
              case 'subCategoryName':
                newParams.sc = undefined;
                break;
              case 'price':
                newParams.p = undefined;

                break;
              case 'merchantUID':
                newParams.m = undefined;
                break;

              //TODO: finish clear cases
            }
          });
          changeParams(newParams);
        } else {
          changeParams(undefined);
        }
        break;
      case SearchControlsAction.CHANGE_PRICE:
        changeParams({ p: (action.payload?.min ?? 0) + '-' + (action.payload?.max ?? 1000) });
        // control?.addRule(
        //   'price',
        //   (action.payload?.min ?? 0) + '-' + (action.payload?.max ?? 1000),
        //   SearchMatchRestriction.Nested,
        //   SearchFilterQualifier.Exact
        // );
        break;
      case SearchControlsAction.CHANGE_DISTANCE_SORT:
      // control?.addRule(
      //   'distance',
      //   action.payload,
      //   SearchMatchRestriction.None,
      //   SearchFilterQualifier.None
      // );
      // return getControlState(control);

      case SearchControlsAction.CHANGE_DISTANCE:
      // control?.addRule(
      //   'distance_km',
      //   units === 'km' ? action.payload : action.payload * 1.61,
      //   SearchMatchRestriction.Must,
      //   SearchFilterQualifier.Exact
      // );
      // return getControlState(control);
      case SearchControlsAction.CHANGE_DISTANCE_UNITS:
      // setUnits(action.payload);
      // return getControlState(control);
      case SearchControlsAction.CHANGE_LOCATION:
        // control?.addRule(
        //   'location',
        //   action.payload,
        //   SearchMatchRestriction.None,
        //   SearchFilterQualifier.None
        // );
        // return getControlState(control);
        return {} as SearchParamsState;
    }
  };

  const controlSelector = useMemo(() => {
    return getControlState();
  }, [router?.query]);
  return {
    dispatch: dispatch,
    filters: {
      ...controlSelector.filters,
      distance_sort: controlSelector.filters.distance,
      distance_units: units,
      distance:
        units === 'km'
          ? controlSelector.filters.distance_km
          : (controlSelector.filters.distance_km ?? 0) / 1.61,
    },
    controlCtx: control,
  };
}
