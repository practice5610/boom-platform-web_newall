/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import { fromMoney } from '@boom-platform/globals';
import { AxiosError } from 'axios';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { InfiniteQueryResult } from 'react-query';
import { Col, Row } from 'reactstrap';

import { ElasticError, ElasticSearchResult, SearchableProduct } from '.';
import SearchResultItem from './SearchResultItem';

const SearchResults: React.FC<{
  results:
    | InfiniteQueryResult<
        ElasticSearchResult<SearchableProduct | undefined>,
        AxiosError<ElasticError>
      >
    | undefined;
}> = ({ results }) => {
  if (!results) return <></>;
  const [now, setNow] = useState(moment.utc().unix());
  const router = useRouter();

  useEffect(() => {
    if (!results.isLoading) {
      setNow(moment.utc().unix());
    }
  }, [results.isLoading]);

  const handleSelect = (item) => {
    router.push(`/product/${item.id}`);
  };

  const getData = () => {
    const data: any = [];
    if (!results.data) return data;
    for (const d of results?.data) {
      data.push(...d.data);
    }
    return data;
  };

  if (results?.isError) {
    return <>Error: {results?.error?.message}</>;
  }
  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => {
          if (!results.isLoading)
            results.fetchMore(results.data?.[results.data.length - 1].scroll_id);
        }}
        hasMore={results?.canFetchMore && results?.data?.[results?.data.length - 1].data?.length}
        loader={
          <div className='loader' key={0}>
            Loading ...
          </div>
        }
      >
        <Row style={{}} className='width-100 border'>
          {getData()?.map((item) => {
            return (
              <Col
                sm='12'
                md='4'
                lg='3'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <SearchResultItem item={item} now={now} handleSelect={handleSelect} />
              </Col>
            );
          })}
        </Row>
      </InfiniteScroll>
    </>
  );
};
export default SearchResults;
