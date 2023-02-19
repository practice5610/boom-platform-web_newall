import { fromMoney, getComposedAddressFromStore, isOffer } from '@boom-platform/globals';
import clsx from 'clsx';
import _ from 'lodash';
import Link from 'next/link';
import React, { FunctionComponent, useState } from 'react';
import { Col, Container, Pagination, PaginationItem, PaginationLink, Row } from 'reactstrap';

import { ProductHit } from '../models/product-hit.model';
import { meterToMiles } from '../utils/common';
import { replaceDomain } from '../utils/images';
import HTMLContent from './HTMLContent';
import RenderIf from './utils/RenderIf';

interface Props {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  results: ProductHit[];
  pageSize?: number;
  /**
   * Limit what results are displayed in total regardless of result count
   */
  limit?: number;
}
const GridProductSearchResults: FunctionComponent<Props> = ({
  sm = 12,
  md = 6,
  lg = 3,
  xl = 3,
  pageSize = 40,
  limit = 0,
  results,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const resultsToGroup = limit > 0 && limit < results.length ? _.slice(results, 0, limit) : results;
  const groupedResults =
    resultsToGroup.length > pageSize ? _.chunk(resultsToGroup, pageSize) : [resultsToGroup];
  const pageResults = groupedResults[currentPage];

  const _requestNextPage = () => {
    const nextPage = currentPage === groupedResults.length - 1 ? 0 : currentPage + 1;
    setCurrentPage(nextPage);
  };
  const _requestPrevPage = () => {
    const prevPage = currentPage === 0 ? groupedResults.length - 1 : currentPage - 1;
    setCurrentPage(prevPage);
  };
  const _requestFirstPage = () => {
    setCurrentPage(0);
  };
  const _requestLastPage = () => {
    setCurrentPage(groupedResults.length - 1);
  };
  return (
    <Container className='SearchResultsGrid d-flex flex-column align-items-center'>
      <Row>
        {pageResults.length > 0 ? (
          pageResults.map((hit: ProductHit, index) =>
            hit.item ? (
              <Col
                sm={sm}
                md={md}
                lg={lg}
                xl={xl}
                key={
                  `${hit.item._id}-${hit.subCategoryName}`
                  // : `${(hit.item as Product).objectID}--${index}` // FIXME: Property 'objectID' does not exist on type 'Offer'
                }
                className='d-flex justify-content-center'
              >
                <Link
                  href={`/${hit.hasOffer ? 'offer' : 'product'}?id=${hit.item ? hit.item._id : ''}`}
                  as={`/${hit.hasOffer ? 'offer' : 'product'}/${hit.item ? hit.item._id : ''}`}
                >
                  <div className='search-results-item'>
                    <img
                      src={`${
                        replaceDomain(hit.imageUrl)
                          ? replaceDomain(hit.imageUrl).indexOf('?') > -1
                            ? `${replaceDomain(hit.imageUrl)}&width=321&height=202`
                            : `${replaceDomain(hit.imageUrl)}?width=321&height=202`
                          : 'https://via.placeholder.com/321x202.jpg'
                      }`}
                      alt='Product'
                    />
                    <div className='box-container'>
                      <RenderIf condition={!!hit.item || !!hit.price}>
                        <div className={clsx('box1', 'w-50', { 'w-100': !hit.hasOffer })}>
                          <span className='price-text d-flex justify-content-center mb-1'>
                            Price
                          </span>
                          <span className='price-number d-flex justify-content-center'>
                            {fromMoney(hit.price)}
                          </span>
                        </div>
                      </RenderIf>
                      <RenderIf condition={!!hit.hasOffer}>
                        <div className='box2 w-50 cashback-box'>
                          <span className='cashback-text d-flex justify-content-center mb-1'>
                            Cashback Amount
                          </span>
                          <span className='cashback-number d-flex justify-content-center align-items-baseline'>
                            <span className='smaller pr-2'>up to</span>
                            {isOffer(hit.item) && fromMoney(hit.item.cashBackPerVisit)}
                          </span>
                        </div>
                      </RenderIf>
                    </div>
                    <div className='search-results-item-description'>
                      <div className='search-results-item-name'>
                        <HTMLContent content={hit.name ?? ''} tag={'h3'} />
                      </div>
                      <div className='product-description d-flex justify-content-start'>
                        <HTMLContent
                          content={_.truncate(hit.item!.description, {
                            length: 129,
                            separator: ' ',
                          })}
                          tag={'span'}
                        />
                      </div>
                      <span className='product-location d-flex justify-content-start pt-3 pb-5'>
                        {hit.store
                          ? `Address ${getComposedAddressFromStore(
                              hit.store
                            )} // TODO: Check if this is correct
                          ${
                            hit._rankingInfo
                              ? // @ts-ignore
                                `- ${meterToMiles(hit._rankingInfo?.geoDistance)}mi` // FIXME: Property 'geoDistance' does not exist on type 'object'
                              : ''
                          }`
                          : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              </Col>
            ) : null
          )
        ) : (
          <Col sm={12}>
            <h2>Sorry, no results could be found.</h2>
          </Col>
        )}
      </Row>
      <RenderIf condition={groupedResults.length > 1}>
        <Pagination size='sm' aria-label='Offers Search Results'>
          <PaginationItem>
            <PaginationLink first onClick={_requestFirstPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink previous onClick={_requestPrevPage} />
          </PaginationItem>
          {groupedResults.map((item, index) => (
            <PaginationItem key={index} active={currentPage === index}>
              <PaginationLink onClick={() => setCurrentPage(index)}>{index + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationLink next onClick={_requestNextPage} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink last onClick={_requestLastPage} />
          </PaginationItem>
        </Pagination>
      </RenderIf>
    </Container>
  );
};
export default GridProductSearchResults;
