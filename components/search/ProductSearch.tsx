import { fromMoney, Money, toMoney } from '@boom-platform/globals';
import { AxiosError } from 'axios';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { QueryCache, useInfiniteQuery } from 'react-query';
import { useSelector } from 'react-redux';

import {
  ChangeCatAction,
  ChangePriceFilterAction,
  SearchControlActions,
  SearchControlActionsType,
  SearchControllerI,
  SearchControlsAction,
} from '../../hooks/useSearchControls';
import { AppState } from '../../redux/reducers';
import {
  ProductSearchControlsCtx,
  ProductSearchResultExtrasCtx,
  ProductSearchResultMetadataCtx,
  ProductSearchResultsCtx,
} from './search-contexts';
import { fetchElasticProductQueryWithScroll } from './search-products';
import {
  BasicSearchProps,
  ElasticError,
  ProductSearchExtras,
  SearchProduct,
  SearchProductControls,
} from './search-query-types';
import { ElasticSearchResult, SearchableProduct } from './search-result-types';

/**
 * This is the top-level search component for products.
 *
 * It connects the context and renders the children provided to it.
 *
 * The children should be passed in by the consuming project and should contain the search input UI and filters UI.
 *
 * Part of the children should be the ProductSearchRunner (defined below), which is the component that handles
 * the actual querying API call to elastic search.
 *
 * Within that component, in order to render the results, you must use the ProductSearchResultsCtx.Consumer tag to get the result data.
 *
 * Example of the hierarchy:
 *
 * <div>
 * <SomeCustomSearchInput />
 * <ProductSearchRunner>
 *  <ProductSearchResults.Consumer>
 *    {results => {
 *      return <SomeCustomResultsComponent results={results}/>
 *    }}
 *  </ProductSearchResults.Consumer>
 * </ProductSearchRunner>
 * </div>
 *
 */
export const ProductSearch: FunctionComponent<{
  cache: QueryCache;
  control: SearchProductControls;
}> = ({ control: initialControls, children }) => {
  // TODO move this if possible, try to pass searchSeedParams and base query
  const [control] = useState(initialControls);
  return (
    <ProductSearchControlsCtx.Provider value={control}>
      {children}
    </ProductSearchControlsCtx.Provider>
  );
};

export interface PriceMetadataBucketI extends FilterMetadataListNodeI {
  from: Money;
  to: Money;
}
export interface FilterState {
  value: string | null;
  child?: FilterState;
}
//this is the base list item
export interface FilterMetadataListNodeI {
  label: string;
  count: number;
}
export interface FilterMetadataListParentI<T> {
  children?: T[];
}
export interface FilterMetadataListHeaderI {
  //if this exists its a header
  title?: MetadataFilterTitlesT;
  filterKey:
    | 'name'
    | 'description'
    | 'distance'
    | 'price'
    | keyof BasicSearchProps
    | 'categoryName'
    | 'subCategoryName'
    | 'brand';
}
export type MetadataProp = FilterMetadataListHeaderI & FilterMetadataListParentI<MetadataPropChild>;
export type MetadataPropChild =
  | (FilterMetadataListNodeI & FilterMetadataListParentI<MetadataProp | undefined>)
  | FilterMetadataListNodeI;

export type FilterMetadataHelpersT<T, A> = {
  bucketToAction?: (bucket: any) => A;
  isFilterSet?: (search: SearchControllerI['filters']) => FilterState;
};

export type MetadataFilterTitlesT = 'Categories' | 'Price';
export type PricesMetadataT<T, A> = FilterMetadataListHeaderI &
  FilterMetadataListParentI<T> &
  FilterMetadataHelpersT<T, A>;
export type CategoryMetadataT<T, A> = FilterMetadataListHeaderI &
  FilterMetadataListParentI<
    T & FilterMetadataListParentI<FilterMetadataListHeaderI & FilterMetadataListParentI<T>>
  > &
  FilterMetadataHelpersT<T, A>;
export interface SearchResultMetadataI {
  prices: PricesMetadataT<PriceMetadataBucketI, ChangePriceFilterAction>;
  categories: CategoryMetadataT<FilterMetadataListNodeI, ChangeCatAction>;
}
const mapSearchAggregationsFromData = (
  data: ElasticSearchResult<SearchableProduct>[],
  categories: AppState['publicData']['categories'],
  subCategoriesToCategoryIndex: { [key: string]: number }
) => {
  const agg: SearchResultMetadataI = {
    prices: {
      title: 'Price',
      filterKey: 'price',
      children: [],
      bucketToAction: (bucket: PriceMetadataBucketI) => {
        console.log(bucket);
        return SearchControlActions.changePrice(bucket.from.amount, bucket.to.amount ?? 100000000);
      },
      isFilterSet: (search: SearchControllerI['filters']) => ({
        value: search.price
          ?.split('-')
          .map((p) => `$${(p / 100).toFixed(0)}`)
          .join('-'),
      }),
    },
    categories: {
      title: 'Categories',
      filterKey: 'categoryName',
      children: [],
      bucketToAction: (bucket: FilterMetadataListNodeI & { filterKey: string }) => {
        if (bucket?.filterKey === 'categoryName') {
          return SearchControlActions.changeCategory(bucket.label, undefined);
        }
        return SearchControlActions.changeCategory(
          categories[subCategoriesToCategoryIndex[bucket.label]].name,
          bucket.label
        );
      },
      isFilterSet: (search: SearchControllerI['filters']) => ({
        value: search.category ?? null,
        child: { value: search.subCategory ?? null },
      }),
    },
  };
  const priceBuckets = data[0].aggregations?.nested_price?.price_ranges?.buckets ?? null;
  const categoryBuckets = data[0].aggregations?.categories?.buckets ?? null;
  const subCatBuckets = data[0].aggregations?.subCategories?.buckets ?? null;
  if (!data?.length) return agg;
  if (priceBuckets) {
    agg.prices.children = Object.keys(priceBuckets)
      .map((key) => {
        const min = priceBuckets[key]?.from ?? 0;
        const max = priceBuckets[key].to ?? 0;
        return {
          from: toMoney(min / 100),
          to: toMoney(max / 100),
          count: priceBuckets[key].doc_count,
          label: `${fromMoney(toMoney(min / 100)).split('.')[0]} ${
            max > 0 ? `- ${fromMoney(toMoney(max / 100)).split('.')[0]}` : '+'
          }`,
        };
      })
      .filter((item) => item !== undefined);
  }

  const categoriesWithIndex: {
    [key: number]: FilterMetadataListNodeI &
      FilterMetadataListParentI<
        FilterMetadataListHeaderI & FilterMetadataListParentI<FilterMetadataListNodeI>
      >;
  } = {};

  if (categoryBuckets?.length) {
    categoryBuckets.forEach((b) => {
      categoriesWithIndex[categories.findIndex((c) => c.name === b.key)] = {
        label: b.key,
        count: b.doc_count,

        children: [{ filterKey: 'subCategoryName', children: [] }],
      };
    });
  }
  if (subCatBuckets?.length) {
    subCatBuckets.forEach((b) => {
      if (
        subCategoriesToCategoryIndex[b.key] &&
        categoriesWithIndex[subCategoriesToCategoryIndex[b.key]]
      ) {
        categoriesWithIndex[subCategoriesToCategoryIndex[b.key]].children?.[0].children?.push({
          label: b.key,
          count: b.doc_count,
        });
      }
    });
  }
  agg.categories = {
    ...agg.categories,
    children: Object.values(categoriesWithIndex),
  };

  return agg;
};

/**
 * The component in charge of making the search query. This will render children you provide with the
 * ProductSearchResultsCtx, ProductSearchResultExtrasCtx context providers to give your children
 * access to the results data using the ProductSearchResultsCtx consumer. See the ProductSearch example hierarchy above
 * for an example of how it should be set up in the consuming project.
 *
 * This uses the useElasticQueryWithScroll custom hook that configures react-query and fetch function.
 */
export const ProductSearchRunner: FunctionComponent<{
  search: SearchProduct;
  enabled: boolean;
  useType: 'scroll' | 'pagination';
  baseUrl?: string;
}> = ({ search, enabled, useType, baseUrl, children }) => {
  const categories = useSelector((state: AppState) => state.publicData.categories);
  const subCategoryToCategoryMap = useRef<{ [key: string]: number }>({});
  const [searchResultMetadata, setSearchResultMetadata] = useState<SearchResultMetadataI>();
  const [searchAggregationResults] = useState<ProductSearchExtras | undefined>();
  // console.log(search);
  // console.log(categories);

  if (useType === 'pagination') {
    throw new Error('Please switch to scroll, pagination is currently just a place holder');
  }

  const searcher = useElasticQueryWithScroll({ search, enabled, baseUrl });
  // const searcher =  useType === "scroll" ? useElasticScrollStyle({ search, enabled }) : useElasticPagination();

  useEffect(() => {
    console.log('categories');

    let index = 0;
    categories?.forEach((cat) => {
      cat?.subCategories?.forEach((subCat) => {
        subCategoryToCategoryMap.current[subCat] = index;
      });
      index++;
    });
  }, [categories]);

  useEffect(() => {
    console.log('searcher1');

    if (searcher.error) {
      if (searcher.error.code === '404') {
        // Cache expired, need to start from the beginning. Resubmit query as a new one
        searcher.fetchMore(search);
      }
    } else if (!searcher.data && !searcher.isFetched && enabled) {
      //             console.log(`searcher instruct initial fetchMore
      // ${JSON.stringify(search)}`);
      console.log('SEARCHMORE TRIGGER');
      searcher.fetchMore(search);
    } /* else if (searcher.data) {
      const mapping = mapElasticResultToDefaultAggregationResult(searcher.data)
      if (mapping && searchAggregationResults !== mapping[mapping.length - 1]) {
        setAggregationResult(mapping[mapping.length - 1])
      }
    } */
  }, [searcher.isFetched, searcher.data, searcher.isPreviousData]);

  useEffect(() => {
    console.log('searcher2');

    if (
      !search.query.categoryName &&
      !search.query?.description &&
      !search.query?.name &&
      !search.query?.merchantUID
    ) {
      setSearchResultMetadata(undefined);
    } else if (searcher.status === 'success' && searcher.data) {
      setSearchResultMetadata(
        mapSearchAggregationsFromData(searcher.data, categories, subCategoryToCategoryMap.current)
      );
    } else if (searcher.status === 'error') {
      setSearchResultMetadata(undefined);
    }
  }, [searcher.status]);
  return (
    <ProductSearchResultsCtx.Provider value={searcher}>
      <ProductSearchResultExtrasCtx.Provider value={searchAggregationResults}>
        <ProductSearchResultMetadataCtx.Provider value={searchResultMetadata}>
          {children}
        </ProductSearchResultMetadataCtx.Provider>
      </ProductSearchResultExtrasCtx.Provider>
    </ProductSearchResultsCtx.Provider>
  );
};

/**
 * A custom hook that configures the useInfiniteQuery from react-query and connects it
 * to the elastic search API fetch function (fetchElasticProductQueryWithScroll)
 *
 * This returns the object from useInfiniteQuery from react-query:
 * https://react-query.tanstack.com/guides/infinite-queries
 */
const useElasticQueryWithScroll = ({
  search,
  enabled,
  baseUrl,
}: {
  search: SearchProduct;
  enabled: boolean;
  baseUrl?: string;
}) => {
  return useInfiniteQuery<ElasticSearchResult<SearchableProduct>, AxiosError<ElasticError>>(
    ['product_search', baseUrl, search],
    fetchElasticProductQueryWithScroll, // 5min cache with elastic
    {
      // cacheTime: 290000,
      refetchInterval: 290000, // used to keep the scroll alive
      refetchIntervalInBackground: true,
      enabled, // enabled:enabled,
      getFetchMore: (result) => result?.scroll_id,
      // keepPreviousData: true
    }
  );
};

// const useElasticPagination = (page:number) => {
//     //Temporary place holder in case we need to switch to pagination for some reason
//     // https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#search-after
//     // https://react-query.tanstack.com/docs/guides/paginated-queries
//     throw new Error("Please use useElasticScrollStyle, this is just a place holder fn");
//     // return usePaginatedQuery<ElasticSearchResult<SearchableProduct>, AxiosError<ElasticError>>(
//     //     ['product_search_page'], elasticProductQueryPage, {
//     //         enabled: false,
//     //         getFetchMore:()
//     //     })

//     // )
// }
