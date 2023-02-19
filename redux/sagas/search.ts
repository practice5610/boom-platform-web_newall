import { Category } from '@boom-platform/globals';
import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { get } from '../../utils/api';
import * as errorActions from '../actions/errors';
import * as searchActions from '../actions/search';
import { CategoriesActionTypes } from '../actionTypes';

export const fetchCategories = (filter?: string) =>
  get<Category[]>(`/categories${filter ? `?${filter}` : ''}`);

export function* getCategories(action: searchActions.RequestCategories) {
  try {
    const results = yield call(fetchCategories, action.payload.filter);
    const categories: Category[] = results.data.data || [];
    yield put(searchActions.setCategories(categories));
  } catch (error: any) {
    console.error(error);
    yield put(errorActions.setSearchError(error.toString()));
  }
}

export function* watchRequests() {
  yield takeLatest(CategoriesActionTypes.CATEGORIES_REQUEST, getCategories);
}

export default function* root() {
  yield fork(watchRequests);
}
