import { AxiosError } from 'axios';
import { createContext } from 'react';
import { InfiniteQueryResult } from 'react-query';

import { SearchResultMetadataI } from './ProductSearch';
import {
  ElasticError,
  ProductSearchExtras,
  ProductSearchQuery,
  SearchProductControls,
  SearchRules,
} from './search-query-types';
import { ElasticSearchResult, SearchableProduct } from './search-result-types';

export const ProductSearchResultsCtx = createContext<
  | InfiniteQueryResult<
      ElasticSearchResult<SearchableProduct | undefined>,
      AxiosError<ElasticError>
    >
  | undefined
>(undefined);

export const ProductSearchTermsCtx = createContext<ProductSearchQuery | undefined>(undefined);

export const ProductSearchRulesCtx = createContext<SearchRules<ProductSearchQuery> | undefined>(
  undefined
);

export const ProductSearchControlsCtx = createContext<SearchProductControls | undefined>(undefined);

export const ProductSearchResultExtrasCtx = createContext<ProductSearchExtras | undefined>(
  undefined
);

export const ProductSearchResultMetadataCtx = createContext<SearchResultMetadataI | undefined>(
  undefined
);
