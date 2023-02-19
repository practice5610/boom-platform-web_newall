import axios from 'axios';
import {
  BoolQuery,
  FuzzyQuery,
  GeoDistanceQuery,
  GeoPoint,
  MatchPhraseQuery,
  MatchQuery,
  NestedAggregation,
  NestedQuery,
  RangeAggregation,
  RangeQuery,
  RequestBodySearch,
  TermQuery,
  TermsAggregation,
} from 'elastic-builder';

import {
  BaseSearchObject,
  ProductSearchQuery,
  SearchableFilterDefinition,
  SearchableFilterDefinitionObject,
  SearchKeys,
  SearchQualifier,
  SearchQuery,
  SearchQueryType,
  SearchRules,
  SearchRulesFilter,
  SearchRulesMatch,
  SearchRulesQualifier,
} from './search-query-types';
import {
  Searchable,
  SearchableGeoLocation,
  SearchableProduct,
  SearchableProductKeywords,
} from './search-result-types';
import { SearchFilterQualifier, SearchMatchRestriction } from './search-rules';
const esb = require('elastic-builder');

/**
 * initSearch requires props as the intial definition. From that point,
 * the base for the "search" properties is immutable.
 */
export const initSearch: <S extends SearchQueryType>(
  props: Partial<S>,
  rules?: Partial<SearchRules<S>>
) => SearchQuery<S> = <S extends SearchQueryType>(
  props: Partial<S>,
  rules?: Partial<SearchRules<S>>
): SearchQuery<S> => {
  const query = {
    query: props,
    matchRules: rules?.matchRules ?? buildMatchRules<S>(props as S),
    qualifierRules: rules?.qualifierRules ?? buildQualifierRules<S>(props as S),
  } as SearchQuery<S>;

  decorateSearchObject(query, {
    addMatch: (previousMatches) => addSearchMatchRule(previousMatches),
    addQualifier: (previousMatches) => addSearchQualifierRule(previousMatches),
  });

  return query;
};

// type MatchDefinitionFilter<S extends SearchQueryType, P extends SearchQualifier>  = Pick<S, {
//     [Key in keyof S ]: S[Key] extends P ? Key : never
// }[keyof S]>

// type MatchFilterType<S extends SearchQueryType, M extends SearchMatchRestriction> = MatchDefinitionFilter<S,M>
// type ShouldMatchFilters<S extends SearchQueryType> = MatchFilterType<S, SearchMatchRestriction.Should>
// type MustMatchFilters<S extends SearchQueryType> = MatchFilterType<S, SearchMatchRestriction.Must>
// type MustNotMatchFilters<S extends SearchQueryType> = MatchFilterType<S, SearchMatchRestriction.MustNot>

type ReturnAddSearchRule<S extends SearchQueryType, F extends SearchQualifier> = <
  K extends keyof S
>(
  prop: K,
  match: F
) => SearchableFilterDefinition<S, F> & { [x: string]: F };
interface DecorateSearchObjectWithFunctions<S extends SearchQueryType> {
  addMatch: (
    previousMatches: SearchableFilterDefinition<S, SearchMatchRestriction>
  ) => ReturnAddSearchRule<S, SearchMatchRestriction>;
  addQualifier: (
    previousMatches: SearchableFilterDefinition<S, SearchFilterQualifier>
  ) => ReturnAddSearchRule<S, SearchFilterQualifier>;
}

interface Geolocation {
  lat: number | null;
  lng: number | null;
}

export const transformGeolocForSearchEngine = (
  geolocation: Geolocation | null
): SearchableGeoLocation => {
  return {
    lat: geolocation?.lat ?? 0,
    lon: geolocation?.lng ?? 0,
  };
};

export function initSearchHttpClient(baseURL = '/') {
  return axios.create({
    baseURL,
  });
}

export const initQuery = <S extends SearchQueryType>(required: S): S => ({
  ...required,
});

export const initProductSearchQuery = (props?: ProductSearchQuery) => ({
  ...(props ? initQuery<ProductSearchQuery>(props) : {}),
  ...props,
});

export const buildMatchRules = <S extends SearchQueryType>(
  props: S
): SearchableFilterDefinitionObject<S, SearchMatchRestriction> =>
  Object.keys(props).reduce(
    (p, c) => ({
      ...p,
      [c]: null,
    }),
    {}
  ) as SearchRulesMatch<S>;

export const buildQualifierRules = <S extends SearchQueryType>(
  props: S
): SearchableFilterDefinitionObject<S, SearchFilterQualifier> =>
  Object.keys(props).reduce(
    (p, c) => ({
      ...p,
      [c]: null,
    }),
    {}
  ) as SearchRulesQualifier<S>;

// Add/Update Match Rules

export const addSearchQuery =
  <S extends SearchQueryType>(
    previousMatches: SearchableFilterDefinition<S, SearchMatchRestriction>
  ) =>
  <K extends keyof S>(prop: K, value: S[K]) => ({
    ...previousMatches,
    [prop]: value,
  });

export const addSearchMatchRule =
  <S extends SearchQueryType>(
    previousMatches: SearchableFilterDefinition<S, SearchMatchRestriction>
  ): ReturnAddSearchRule<S, SearchMatchRestriction> =>
  <K extends keyof S>(prop: K, match: SearchMatchRestriction) => ({
    ...previousMatches,
    [prop]: match,
  });

// Add/Update Qualifier Rules

export const addSearchQualifierRule =
  <S extends SearchQueryType>(
    previousMatches: SearchableFilterDefinition<S, SearchFilterQualifier>
  ): ReturnAddSearchRule<S, SearchFilterQualifier> =>
  <K extends keyof S>(prop: K, match: SearchFilterQualifier) => ({
    ...previousMatches,
    [prop]: match,
  });

// Filter Rules
type ReturnRuleFilterBuilder = <F extends SearchQualifier, S extends SearchQueryType>(
  match: F,
  rule: SearchableFilterDefinition<S, SearchQualifier>
) => any;

const ruleFilter =
  <S extends SearchQueryType, P extends SearchQualifier>(
    filterInitialValue: Partial<SearchableFilterDefinition<S, P>> | never[] | [keyof S],
    filterFn: ReturnRuleFilterBuilder
  ) =>
  <S extends SearchQueryType>(search: SearchRules<S>) =>
  <K extends keyof SearchRules<S>>(ruleSetName: K) =>
  <F extends SearchQualifier>(match: F) => {
    const rule = search[ruleSetName];
    const reducer = filterFn(match, rule);
    return Object.keys(rule).reduce(reducer, filterInitialValue);
  };
export const filterForRuleToObject = ruleFilter(
  {},
  (match: any, rule: any) =>
    <S extends SearchQueryType, K extends keyof S>(p: S, c: K) =>
      rule[c] === match ? { ...p, [c]: match } : p
);
export const filterForRuleToArray = ruleFilter(
  [],
  (match: any, rule: any) => (p: string[], c: string) => rule[c] === match ? [...p, c] : p
);

type addFnCallable<S extends SearchQueryType, Q extends SearchQualifier> = (
  previousMatches: SearchableFilterDefinitionObject<S, Q>
) => ReturnAddSearchRule<S, Q>;

// decorateSearchObject is a reusable helper used by initSearch to bind fns to the SearchQuery object
const decorateSearchObject = <S extends SearchQueryType>(
  query: SearchQuery<S>,
  decorateWith: DecorateSearchObjectWithFunctions<S>
) => {
  const { addMatch, addQualifier } = decorateWith;

  const swapRule =
    <S extends SearchQueryType, K extends keyof SearchQuery<S>, Q extends SearchQualifier>(
      addFn: addFnCallable<S, Q>,
      replaceProp: K,
      q: SearchQuery<S>
    ) =>
    <T extends keyof S>(p: T, v: any) => {
      const old = q[replaceProp] as SearchableFilterDefinitionObject<S, Q>;
      const rules = addFn(old)(p, v);
      q[replaceProp] = rules as unknown as SearchQuery<S>[K];
      return rules;
    };
  const swapMatchRule = swapRule(addMatch, 'matchRules', query);
  const swapQualifierRule = swapRule(addQualifier, 'qualifierRules', query);

  query.updateQuery = (...args) =>
    swapRule(
      (prev: any) => (k: any, v: any) => {
        return { ...prev, [k]: v };
      },
      'query',
      query
    ).apply(query, args);
  query.updateMatchRule = (...args) => swapMatchRule.apply(query, args);
  query.updateQualifierRule = (...args) => swapQualifierRule.apply(query, args);

  const filterForMatchRequirements = filterForRuleToArray(query)('matchRules');
  const filterForQualifierRequirements = filterForRuleToArray(query)('qualifierRules');
  query.filterForMatchRequirement = filterForMatchRequirements;
  query.filterForQualifierRequirement = filterForQualifierRequirements;

  const addSearchRule =
    (query: SearchQuery<S>) =>
    (
      field: SearchKeys<S>,
      value: any,
      match: SearchMatchRestriction,
      filter: SearchFilterQualifier
    ) => {
      query.updateMatchRule(field, match);
      query.updateQualifierRule(field, filter);
      query.updateQuery(field, value);
    };
  query.addRule = addSearchRule(query);
};

export const extractMatchRules = <S extends SearchQueryType>(
  matchRules: SearchableFilterDefinitionObject<S, SearchMatchRestriction>,
  definition: SearchMatchRestriction
): SearchRulesFilter<S> | null => {
  const results: SearchRulesFilter<S> = [''];
  for (const k in matchRules) {
    if ((k as SearchKeys<S>) && matchRules[k] === definition) {
      results.push(k as SearchKeys<S>);
    }
  }
  results.shift();

  return results.length > 0 ? results : null;
};
export const extractQualifierRules = <S extends SearchQueryType>(
  qualifierRules: SearchableFilterDefinitionObject<S, SearchFilterQualifier>,
  definition: SearchFilterQualifier
): SearchRulesFilter<S> | null => {
  const results: SearchRulesFilter<S> = [''];
  for (const k in qualifierRules) {
    if ((k as SearchKeys<S>) && qualifierRules[k] === definition) {
      results.push(k as SearchKeys<S>);
    }
  }
  results.shift();

  return results.length > 0 ? results : null;
};

type ElasticSearchRenamingMap<S extends SearchQueryType, M extends Searchable> = {
  [P in keyof S]?: keyof M extends string ? keyof M : never;
};

type ElasticSearchProductRenamingMap = ElasticSearchRenamingMap<
  ProductSearchQuery,
  SearchableProduct
>;
type ElasticSearchProductNoEntryCategoryRenamingMap = ElasticSearchRenamingMap<
  ProductSearchQuery,
  SearchableProductKeywords
>;

export const buildElasticProductSearcher = () => {
  const mapping: ElasticSearchProductRenamingMap = {
    categoryName: 'categoryName.keyword',
    subCategoryName: 'subCategory',
    brand: 'attributes.brand_name.keyword',
    price: 'price.amount',
  };
  return buildElasticBoolSearcher<
    ProductSearchQuery,
    SearchableProduct,
    ElasticSearchProductRenamingMap
  >(mapping);
};

const elasticBoolSearcher = <S extends SearchQueryType, Q extends Searchable, E extends Q>(
  rename: ElasticSearchRenamingMap<S, E>
) => {
  return (search: BaseSearchObject<S>): RequestBodySearch => {
    const elasticSearch = new RequestBodySearch();
    const query = new BoolQuery();
    const { query: search_query, matchRules, qualifierRules } = search;
    // TODO !UPGRADE search[].reduce(extractMatchRules)
    const musts = [
      SearchMatchRestriction.Must,
      extractMatchRules(matchRules, SearchMatchRestriction.Must),
    ];
    const nested = [
      SearchMatchRestriction.Nested,
      extractMatchRules(matchRules, SearchMatchRestriction.Nested),
    ];
    const should = [
      SearchMatchRestriction.Should,
      extractMatchRules(matchRules, SearchMatchRestriction.Should),
    ];
    const should_not = [
      SearchMatchRestriction.MustNot,
      extractMatchRules(matchRules, SearchMatchRestriction.MustNot),
    ];
    // TODO !UPGRADE search[].reduce(extractQualifierRules)
    const exact = extractQualifierRules(qualifierRules, SearchFilterQualifier.Exact);
    const fuzzy = extractQualifierRules(qualifierRules, SearchFilterQualifier.Wildcard);

    for (const [match, list] of [musts, should, should_not, nested]) {
      if (list != null) {
        for (const entry of list) {
          const k = entry as SearchKeys<S>;
          const searchKey = k in rename ? rename[k] : (k as string);
          if (exact && exact.includes(k) && typeof k === 'string') {
            switch (match) {
              case SearchMatchRestriction.Must:
                if (search_query[k]) {
                  if (searchKey === 'merchantUID') {
                    query.must(
                      new NestedQuery(new MatchQuery('store._id', search_query[k] as any), 'store')
                    );
                  } else {
                    query.must(new TermQuery(searchKey, search_query[k] as any));
                  }
                }
                break;
              case SearchMatchRestriction.Nested:
                if (searchKey === 'price.amount') {
                  const result = search_query[k] ? (search_query[k] as any).split('-') : '';
                  query.must(
                    new NestedQuery(
                      new RangeQuery(searchKey).gte(result[0]).lte(result[1]),
                      'price'
                    )
                  );
                } else {
                  if (search_query[k]) {
                    query.must(
                      new NestedQuery(
                        new TermQuery(searchKey, search_query[k] as any),
                        'attributes'
                      )
                    );
                  }
                }
                break;
              case SearchMatchRestriction.MustNot:
                query.mustNot(new MatchPhraseQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.Should:
                query.should(new MatchPhraseQuery(searchKey, search_query[k] as any));
                break;
            }
          } else if (fuzzy && fuzzy.includes(k)) {
            switch (match) {
              case SearchMatchRestriction.Must:
                query.must(new FuzzyQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.Nested:
                if (searchKey === 'price.amount') {
                  const result = (search_query[k] as any).split('-');
                  query.must(
                    new NestedQuery(
                      new RangeQuery(searchKey).gte(result[0]).lte(result[1]),
                      'price'
                    )
                  );
                } else {
                  if (search_query[k]) {
                    query.must(
                      new NestedQuery(
                        new TermQuery(searchKey, search_query[k] as any),
                        'attributes'
                      )
                    );
                  }
                }
                break;
              case SearchMatchRestriction.MustNot:
                query.mustNot(new FuzzyQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.Should:
                query.should(new FuzzyQuery(searchKey, search_query[k] as any));
                break;
            }
          }
        }
      }
    }

    const gp = new GeoPoint();
    gp.object(search_query.location);
    if (
      search_query.location !== null &&
      search_query.location !== undefined &&
      search_query.distance_km > 0 &&
      search_query['distance']
    ) {
      const distance = new GeoDistanceQuery('_geoloc', gp.object(search_query.location));
      query.filter(distance.distance(search_query.distance_km + 'km'));
    }
    elasticSearch.query(query);
    if (search_query['distance']) {
      const order = search_query['distance'] === 'asc' ? 'asc' : 'desc';
      elasticSearch.sort(
        esb.sort('_geoloc').order(order).unit('m').mode('avg').distanceType('plane').geoDistance(gp)
      );
    }

    elasticSearch.sort(esb.sort('hasOffer').order('asc'));
    return elasticSearch;
  };
};

// const queryKeyRename = <S extends SearchQueryType, Q extends Searchable, E extends Q>(map:ElasticSearchRenamingMap<S,E>) => (values:S) => {
//     const rename:ElasticSearchRenamingMap<S,E> = {};
//     for(let k in values) {
//         if(map[k]) {
//             rename[k as string] = map[k];
//         } else {
//             rename[k as string] = k;
//         }
//     }
//     return rename;
// }
const elasticSearchProductNoEntryCategory = (m: ElasticSearchProductNoEntryCategoryRenamingMap) => {
  return elasticBoolSearcher<ProductSearchQuery, SearchableProduct, SearchableProductKeywords>(m);
};

export const buildProductSearchNoCategory = (search: BaseSearchObject<ProductSearchQuery>) => {
  // const keyRenamer = queryKeyRename<ProductSearchQuery, SearchableProduct, SearchableProductKeywords>({
  //     categoryName: "category.keyword",
  // })(search.query)
  const boolSearcher = elasticSearchProductNoEntryCategory({
    categoryName: 'categoryName.keyword',
    subCategoryName: 'subCategoryName.keyword',
    brand: 'attributes.brand_name.keyword',
    price: 'price.amount',
  });

  const productFilter = boolSearcher(search)
    .aggregation(new TermsAggregation('categories', 'categoryName.keyword').size(15))
    .aggregation(new TermsAggregation('subCategories', 'subCategoryName.keyword').size(15))
    .aggregation(
      new NestedAggregation('nested_price', 'nested').path('price').aggregation(
        new RangeAggregation('price_ranges', 'range')
          .field('price.amount')
          .ranges([
            { to: 10000 },
            { from: 10000, to: 20000 },
            { from: 20000, to: 30000 },
            { from: 30000, to: 50000 },
            { from: 50000, to: 70000 },
            { from: 70000, to: 100000 },
            { from: 100000 },
          ])
          .keyed(true)
      )
    )
    .aggregation(
      new NestedAggregation('nested_brand', 'nested')
        .path('attributes')
        .aggregation(new TermsAggregation('brands', 'attributes.brand_name.keyword'))
    );
  // console.log(`Will serialize product filter:
  // ${JSON.stringify(productFilter)}`);
  return productFilter.toJSON();
};

// TODO !RELEASE this is ugly :( travis.. to refactor when there is more time
export const buildElasticBoolSearcher = <
  S extends SearchQueryType,
  Q extends Searchable,
  M extends ElasticSearchRenamingMap<S, Q>
>(
  rename: M
) => {
  const query = new BoolQuery();
  return (search: BaseSearchObject<S>) => {
    const { query: search_query, matchRules, qualifierRules } = search;
    // TODO !UPGRADE search[].reduce(extractMatchRules)
    const musts = [
      SearchMatchRestriction.Must,
      extractMatchRules(matchRules, SearchMatchRestriction.Must),
    ];
    const should = [
      SearchMatchRestriction.Should,
      extractMatchRules(matchRules, SearchMatchRestriction.Should),
    ];
    const should_not = [
      SearchMatchRestriction.MustNot,
      extractMatchRules(matchRules, SearchMatchRestriction.MustNot),
    ];
    // TODO !UPGRADE search[].reduce(extractQualifierRules)
    const exact = extractQualifierRules(qualifierRules, SearchFilterQualifier.Exact);
    const fuzzy = extractQualifierRules(qualifierRules, SearchFilterQualifier.Wildcard);

    for (const [match, list] of [musts, should, should_not]) {
      if (list != null) {
        for (const entry of list) {
          const k = entry as SearchKeys<S>;
          const searchKey = k in rename ? rename[k] : (k as string);
          if (exact && exact.includes(k)) {
            switch (match) {
              case SearchMatchRestriction.Must:
                query.must(new MatchPhraseQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.MustNot:
                query.mustNot(new MatchPhraseQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.Should:
                query.should(new MatchPhraseQuery(searchKey, search_query[k] as any));
                break;
            }
          } else if (fuzzy && fuzzy.includes(k)) {
            switch (match) {
              case SearchMatchRestriction.Must:
                query.must(new FuzzyQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.MustNot:
                query.mustNot(new FuzzyQuery(searchKey, search_query[k] as any));
                break;
              case SearchMatchRestriction.Should:
                query.should(new FuzzyQuery(searchKey, search_query[k] as any));
                break;
            }
          }
        }
      }
    }
    const gp = new GeoPoint();
    gp.object(search_query.location);
    const distance = new GeoDistanceQuery('location', gp);
    distance.distance(search_query.distance_km);
    query.must(distance);
    return query.toJSON();
  };
};
