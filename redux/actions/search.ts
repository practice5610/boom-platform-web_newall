import { Category } from '@boom-platform/globals';
import { Action } from 'redux';

import { CategoriesActionTypes } from '../actionTypes';

export type SearchAction = RequestCategories | SetCategories;

export interface RequestCategories extends Action {
  type: CategoriesActionTypes.CATEGORIES_REQUEST;
  payload: { filter: string | undefined };
}

export interface SetCategories extends Action {
  type: CategoriesActionTypes.CATEGORIES_SET;
  payload: Category[];
}

export const requestCategories = (filter?: string): RequestCategories => {
  return {
    type: CategoriesActionTypes.CATEGORIES_REQUEST,
    payload: { filter },
  };
};

export const setCategories = (categories: Category[]): SetCategories => {
  return {
    type: CategoriesActionTypes.CATEGORIES_SET,
    payload: categories,
  };
};
