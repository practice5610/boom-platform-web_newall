/* eslint-disable @typescript-eslint/no-empty-interface */
import { SearchableGeoLocation } from './search-result-types';
import { SearchFilterQualifier, SearchFilterType, SearchMatchRestriction } from './search-rules';

export interface ChangeSearchMatchRule<S extends SearchQueryType> {
  name: SearchKeys<S>;
  value: ChangeSearchRuleValue<SearchMatchRestriction>;
}

export interface ChangeSearchQualifierRule<S extends SearchQueryType> {
  name: SearchKeys<S>;
  value: ChangeSearchRuleValue<SearchFilterQualifier>;
}

export type SearchUpdateRequestType<S extends SearchQueryType> =
  | ChangeSearchMatchRule<S>
  | ChangeSearchQualifierRule<S>
  | ChangeSearchFilter<S>;

export interface SearchUpdateRequestProps<S extends SearchQueryType> {
  name: SearchKeys<S>;
  value: ChangeSearchFilterValue<S, SearchKeys<S>>;
  match: ChangeSearchRuleValue<SearchMatchRestriction>;
  qualifier: ChangeSearchRuleValue<SearchFilterQualifier>;
}

export type SearchQualifier = SearchMatchRestriction | SearchFilterType | SearchFilterQualifier;

export type SearchableFilterDefinitionObject<
  S extends SearchQueryType | Partial<S>,
  P extends SearchQualifier
> = { [K in keyof S]: P };

export type SearchKeys<S extends SearchQueryType> = keyof S;

export type SearchRulesFilter<S extends SearchQueryType> = [SearchKeys<S> | ''];

export type SearchableFilterDefinition<
  S extends SearchQueryType,
  P extends SearchQualifier
> = SearchableFilterDefinitionObject<S, P>;

export type BasicSearchProps = {
  distance_km: number;
  location: SearchableGeoLocation;
};
export type ProductSearchQuery = BasicSearchProps & {
  name?: string;
  categoryName?: string;
  subCategoryName?: string;
  description?: string;
  brand?: string;
  price?: string;
  distance?: string;
  merchantUID?: string;
};

export type StoreSearchQuery = BasicSearchProps & {
  name?: string;
  city: string;
};

export type SearchQueryType = StoreSearchQuery | ProductSearchQuery;

export type MatchRequirementFilterDefinition<S extends SearchQueryType> =
  SearchableFilterDefinition<S, SearchMatchRestriction>;

export type QualiferRequirementFilterDefinition<S extends SearchQueryType> =
  SearchableFilterDefinition<S, SearchFilterQualifier>;

export type SearchRuleType = SearchMatchRestriction | SearchFilterQualifier;

export type SearchRulesMatch<S extends SearchQueryType | Partial<S>> =
  SearchableFilterDefinitionObject<S, SearchMatchRestriction>;

export type SearchRulesQualifier<S extends SearchQueryType | Partial<S>> =
  SearchableFilterDefinitionObject<S, SearchFilterQualifier>;

export interface SearchRules<S extends SearchQueryType> {
  qualifierRules: SearchRulesQualifier<S>;
  matchRules: SearchRulesMatch<S>;
}
export type SearchRuleActions<S extends SearchQueryType> = {
  filterForMatchRequirement: (
    match: SearchMatchRestriction
  ) => SearchableFilterDefinition<S, SearchMatchRestriction> | any; // TODO !COMMIT tighten
  filterForQualifierRequirement: (
    match: SearchFilterQualifier
  ) => SearchableFilterDefinition<S, SearchFilterQualifier> | any; // TODO !COMMIT tighten
};

export type BaseSearchObject<S extends SearchQueryType> = SearchRules<S> & {
  readonly query: S;
};

export type BaseSearchMultiSelectObject<S extends SearchQueryType> = {
  readonly baseQuery: S;
  readonly query: Partial<S>[];
  qualifierRules: SearchRulesQualifier<Partial<S>>[];
  matchRules: SearchRulesMatch<Partial<S>>[];
};

export type SearchQueryRuleManagement<S extends SearchQueryType> = {
  addRule(
    field: keyof S,
    value: any,
    match: SearchMatchRestriction,
    filter: SearchFilterQualifier
  ): void;
};

export type SearchQuery<S extends SearchQueryType> = SearchRuleActions<S> &
  BaseSearchObject<S> &
  SearchQueryRuleManagement<S> & {
    updateQuery<K extends keyof S>(prop: K, value: S[K]): S;
    updateMatchRule<K extends keyof S>(
      prop: K,
      value: SearchMatchRestriction
    ): MatchRequirementFilterDefinition<S>;
    updateQualifierRule<K extends keyof S>(
      prop: K,
      value: SearchFilterQualifier
    ): QualiferRequirementFilterDefinition<S>;
  };
export type SearchQueryBuilderOptions<S extends SearchQueryType> = {
  queryBuilder(): S;
};

// Reducers
export type ChangeSearchFilterValue<S extends SearchQueryType, K extends keyof S> = S[K];

export type ChangeSearchRuleValue<S extends SearchRuleType> = {
  [P in keyof S]?: S[P];
};

export interface ChangeSearchFilter<S extends SearchQueryType> {
  name: SearchKeys<S>;
  value: ChangeSearchFilterValue<S, SearchKeys<S>>;
}

export type ElasticAggregationResultEntry = {
  name: string;
  count: number;
};

export interface ProductSearchExtras {
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  topCategories?: ElasticAggregationResultEntry[];
}

export type ProductSearchRules = SearchRules<ProductSearchQuery>;

export interface SearchProductQuery {
  query: ProductSearchQuery;
  rules?: ProductSearchRules;
}

export interface SearchProduct {
  query: ProductSearchQuery;
  rules: ProductSearchRules;
}

export interface ElasticError {
  error: {
    type: string;
    reason: string;
  };
}

// Reducers

export type SearchProductFilterControls = SearchQueryRuleManagement<ProductSearchQuery> & {
  // updateSearchQuery: React.Dispatch<ChangeSearchFilter<ProductSearchQuery>>;
  // updateSearchMatchRule: React.Dispatch<ChangeSearchMatchRule<ProductSearchQuery>>;
  // updateQualifierRule: React.Dispatch<ChangeSearchQualifierRule<ProductSearchQuery>>;
};

export type SearchProductQueryControls = {
  updateSearchScrollId: React.Dispatch<string>;
};

export type SearchProductControl = SearchProductQueryControls &
  SearchProductFilterControls & {
    resetRules: (newBaseSearch?: SearchProduct) => void;
    removeRule: (rule: keyof ProductSearchQuery) => void;
  };

export interface SearchProductProps {
  search: SearchProduct;
  searchScrollId?: string;
}

export type SearchProductControls = SearchProductProps & SearchProductControl & {};

export interface ISearchParms {}

export type ElasticSearchAggregationBucket = { key: string; doc_count: number };

export type ElasticSearchAggregationValue = { value: number };

export interface ElasticSearchProductDefaultAggregations {
  max_price: ElasticSearchAggregationValue;
  min_price: ElasticSearchAggregationValue;
  avg_price: ElasticSearchAggregationValue;
  top_category_tags: {
    buckets: ElasticSearchAggregationBucket[];
  };
}
