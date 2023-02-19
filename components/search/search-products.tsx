import { AxiosResponse } from 'axios';
import { SearchResponse } from 'elasticsearch';
import { useReducer, useState } from 'react';

import { buildProductSearchNoCategory, initSearchHttpClient } from './search-common';
import {
  BasicSearchProps,
  ChangeSearchMatchRule,
  ChangeSearchQualifierRule,
  ElasticAggregationResultEntry,
  ElasticSearchProductDefaultAggregations,
  ProductSearchExtras,
  ProductSearchQuery,
  SearchableFilterDefinitionObject,
  SearchProduct,
  SearchProductControls,
  SearchQuery,
  SearchUpdateRequestProps,
} from './search-query-types';
import {
  ElasticProductQueryScroll,
  ElasticSearchResult,
  SearchableProduct,
} from './search-result-types';
import { SearchFilterQualifier, SearchMatchRestriction } from './search-rules';
import { setSearchFilterQuery } from './search-service';

export async function fetchElasticProductQueryWithScroll(
  _: string,
  baseUrl: string | undefined,
  search: SearchProduct,
  scrollId?: string
): ElasticProductQueryScroll {
  const elasticQuery =
    !!scrollId && typeof scrollId === 'string'
      ? { scroll: '5m', scroll_id: scrollId }
      : buildProductSearchNoCategory({
          query: search.query,
          matchRules: search.rules.matchRules,
          qualifierRules: search.rules.qualifierRules,
        });

  const url = !!scrollId && typeof scrollId === 'string' ? '/_search/scroll' : '/_search';
  // console.log(`Running elastic query search:
  // ${baseUrl}
  // ${url}
  // ${JSON.stringify(elasticQuery)}`);

  const { data, status, statusText } = await initSearchHttpClient(baseUrl).post<
    object,
    AxiosResponse<SearchResponse<SearchableProduct>>
  >(url, elasticQuery);

  if (status === 200) {
    const { hits: ph, _scroll_id, aggregations } = data;
    const { hits } = ph;

    return {
      scroll_id: _scroll_id,
      data: hits.map(({ _source }) => _source),
      aggregations,
    };
  }

  throw new Error(`search failed: ${statusText}`);
}

function setSearchProductQualifierRule(
  state: SearchableFilterDefinitionObject<ProductSearchQuery, SearchFilterQualifier>,
  { name, value }: ChangeSearchQualifierRule<ProductSearchQuery>
) {
  // debugger
  return { ...state, [name]: value };
}

function setSearchProductMatchRule(
  state: SearchableFilterDefinitionObject<ProductSearchQuery, SearchMatchRestriction>,
  { name, value }: ChangeSearchMatchRule<ProductSearchQuery>
) {
  // debugger
  return { ...state, [name]: value };
}

const initSearchState = (): ProductSearchQuery => ({
  distance_km: 10,
  location: { lat: 0, lon: 1 },
});

const initProductSearchState = (initialState?: ProductSearchQuery): ProductSearchQuery => ({
  ...initSearchState(),
  ...initialState,
});

const initProductSearchMatchRules = (
  initialState: SearchableFilterDefinitionObject<ProductSearchQuery, SearchMatchRestriction>
) => initialState;

const initProductSearchQualifierRules = (
  initialState: SearchableFilterDefinitionObject<ProductSearchQuery, SearchFilterQualifier>
) => initialState;

export function useProductSearch(search: SearchQuery<ProductSearchQuery>): SearchProductControls {
  // const [searchQuery, updateSearchQuery]
  const [searchQuery] = useReducer(setSearchFilterQuery, search.query, initProductSearchState);
  // const [matchRules, updateSearchMatchRule]
  const [matchRules] = useReducer(
    setSearchProductMatchRule,
    search.matchRules,
    initProductSearchMatchRules
  );
  // const [qualifierRules, updateQualifierRule]
  const [qualifierRules] = useReducer(
    setSearchProductQualifierRule,
    search.qualifierRules,
    initProductSearchQualifierRules
  );
  const [searchState, updateSearchState] = useReducer(
    (
      state: SearchProduct,
      {
        action,
        update,
        remove,
        newState,
      }: {
        action: 'ADD_RULE' | 'REMOVE_RULE' | 'RESET_RULES';
        update?: SearchUpdateRequestProps<ProductSearchQuery>;
        remove?: keyof ProductSearchQuery;
        newState?: SearchProduct;
      }
    ): SearchProduct => {
      switch (action) {
        case 'ADD_RULE':
          if (!update) return state;
          return {
            ...state,
            query: { ...state.query, [update.name]: update.value },
            rules: {
              ...state.rules,
              matchRules: {
                ...state.rules.matchRules,
                [update.name]: update.match,
              },
              qualifierRules: {
                ...state.rules.qualifierRules,
                [update.name]: update.qualifier,
              },
            },
          };

        // if(update as ChangeSearchFilter<ProductSearchQuery>) {
        //     return {...state, query: { ...state.query, [update.name]:update.value}};
        // } else if (update as ChangeSearchQualifierRule<ProductSearchQuery>) {
        //     return {...state, rules: { ...state.rules,  qualifierRules: { ...state.rules.qualifierRules, [update.name]:update.value}} };
        // } else if(update as ChangeSearchMatchRule<ProductSearchQuery>) {
        //     return {...state, rules: { ...state.rules,  matchRules: { ...state.rules.matchRules, [update.name]:update.value}} };
        // }
        case 'REMOVE_RULE':
          // TODO implement if needed
          if (!remove) return state;
          // return {
          //   ...state,
          //   query: { ...state.query, [remove]: '' },
          //   rules: {
          //     ...state.rules,
          //     matchRules: {
          //       ...state.rules.matchRules,
          //       [remove]: SearchMatchRestriction.None,
          //     },
          //     qualifierRules: {
          //       ...state.rules.qualifierRules,
          //       [remove]: SearchFilterQualifier.None,
          //     },
          //   },
          // };
          delete state.query[remove];
          delete state.rules.matchRules[remove];
          delete state.rules.qualifierRules[remove];
          return { ...state };
        case 'RESET_RULES':
          if (!newState) return baseSearch;
          setBaseSearch(newState);
          return newState;
      }
      return state;
    },
    { query: searchQuery, rules: { matchRules, qualifierRules } }
  );
  const [searchScrollId, updateSearchScrollId] = useState<string | undefined>(undefined);

  const [baseSearch, setBaseSearch] = useState<SearchProduct>({
    query: search.query,
    rules: {
      matchRules: search.matchRules,
      qualifierRules: search.qualifierRules,
    },
  });

  // const searchInterface = { query: searchQuery, rules: { matchRules, qualifierRules } } as SearchProduct
  // debugger;
  // const invalidateCache = () => {
  //     console.log('asked to clear cache');
  //     // const elasticQuery = buildProductSearchNoCategory()({query: searchQuery, matchRules, qualifierRules});
  //     // cache.invalidateQueries([elasticQuery]);
  //     // console.log('finished to clear cache'); //TODO !COMMIT
  // }
  // USE THIS FOR MUTATING REACT-QUERY
  // const [mutateSearchQuery] = useMutation(async (props:ChangeSearchFilter<ProductSearchQuery>) => {
  //     //search.updateQuery(props.name,props.value);
  //     //console.log(`mutateSearchQuery: ${props.name}: ${props.value}`);
  //     updateSearchQuery(props);
  // }, {
  //     //onSuccess: invalidateCache,
  // });
  // const [mutateSearchMatchRules] = useMutation(async (props:ChangeSearchMatchRule<ProductSearchQuery>) => {
  //     //search.updateMatchRule(props.name,props.value);
  //     updateSearchMatchRule(props);
  // }, {
  //     //onSuccess: invalidateCache,
  // });
  // const [mutateSearchQualifierRules] = useMutation(async (props:ChangeSearchQualifierRule<ProductSearchQuery>) => {
  //     //search.updateQualifierRule(props.name,props.value);
  //     updateQualifierRule(props);
  // }, {
  //     //onSuccess: invalidateCache,
  // });

  return {
    // buildSearchQuery,
    // toSearch,
    // search: { query: searchQuery, rules: { matchRules, qualifierRules }},
    search: searchState,
    // updateSearchQuery: mutateSearchQuery,
    // updateQualifierRule: mutateSearchQualifierRules,
    // updateSearchMatchRule: mutateSearchMatchRules,
    searchScrollId,
    updateSearchScrollId,
    addRule<K extends keyof ProductSearchQuery, V extends ProductSearchQuery[K]>(
      name: K,
      value: V,
      match: SearchMatchRestriction,
      qualifier: SearchFilterQualifier
    ) {
      // search.addRule(name, value, match, qualifier);
      // console.log(`addRule: ${name}: ${value} (${match}:${qualifier})`);
      updateSearchState({
        action: 'ADD_RULE',
        update: {
          name,
          value,
          match,
          qualifier,
        },
      });
      // mutateSearchQuery({name, value});
      // mutateSearchMatchRules({name, value: match})
      // mutateSearchQualifierRules({name, value: qualifier})
      // TODO invalidate cache
      // mutateSearchQuery({name, value});
      // this.updateSearchMatchRule({name, value: match})
      // this.updateQualifierRule({name, value: qualifier})
      // this.updateSearchQuery({name, value})
    },
    resetRules(newBaseSearch?: SearchProduct) {
      updateSearchState({ action: 'RESET_RULES', newState: newBaseSearch });
    },
    removeRule<K extends keyof ProductSearchQuery>(rule: K) {
      updateSearchState({ action: 'REMOVE_RULE', remove: rule });
    },
  };
}

export function mapElasticResultToDefaultAggregationResult(
  result: ElasticSearchResult<SearchableProduct>[]
) {
  return result.map<ProductSearchExtras>((n) => {
    const aggregations = n.aggregations as ElasticSearchProductDefaultAggregations;
    if (aggregations) {
      const {
        max_price: { value: maxPrice },
        min_price: { value: minPrice },
        avg_price: { value: avgPrice },
        top_category_tags,
      } = aggregations;
      const cats: ElasticAggregationResultEntry[] = top_category_tags.buckets
        .filter((x) => !!x.key)
        .map((x) => ({ name: x.key, count: x.doc_count }));
      return {
        avgPrice,
        minPrice,
        maxPrice,
        topCategories: cats,
      };
    }
    return {};
  });
}
