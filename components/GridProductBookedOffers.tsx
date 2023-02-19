import { Booking, fromMoney, isOffer, Product, toMoney } from '@boom-platform/globals';
import _ from 'lodash';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Container, Modal, ModalBody, ModalFooter } from 'reactstrap';

import { Tax } from '../models/tax.model';
import { deleteBooking, selectBooking } from '../redux/actions/account-member';
import { replaceDomain } from '../utils/images';
import BlankThing from './BlankThing';
import RenderIf from './utils/RenderIf';

interface Props {
  results: Booking[] | null | undefined;
  deleteBooking?: typeof deleteBooking; // TODO: do these two need to be optional?
  selectBooking?: typeof selectBooking;
  totalTax?: Tax[] | null | undefined;
  pageSize?: number;
  /**
   * Limit what results are displayed in total regardless of result count
   */
  limit?: number;
}
const GridProductBookedOffers: FunctionComponent<Props> = ({
  pageSize = 20,
  limit = 0,
  results,
  selectBooking,
  deleteBooking,
  totalTax,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookingIdDeleted, setBookingIdDeleted] = useState<string | undefined>(undefined);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [resultsToGroup, setResultsToGroup] = useState<Booking[] | boolean[]>([]);
  const [groupedResults, setGroupedResults] = useState<Booking[][] | boolean[][]>([]);
  const [pageResults, setPageResults] = useState<Booking[] | boolean[]>([]);
  const [selectedBookings, setSelectedBookings] = useState<Booking[] | boolean[]>([]);

  useEffect(() => {
    if (results) {
      const newSelectedBookings: Booking[] | boolean[] = new Array(results.length).fill(false);
      setSelectedBookings(newSelectedBookings);
      const newResultsToGroup =
        limit > 0 && limit < results.length ? _.slice(results, 0, limit) : results;
      setResultsToGroup(newResultsToGroup);
      const newGroupedResults: Booking[][] | boolean[][] =
        newResultsToGroup.length > pageSize
          ? _.chunk(newResultsToGroup, pageSize)
          : [newResultsToGroup];
      setGroupedResults(
        newResultsToGroup.length > pageSize
          ? _.chunk(newResultsToGroup, pageSize)
          : [newResultsToGroup]
      );
      setPageResults(newGroupedResults[currentPage]);
    }
  }, [results, currentPage]);
  const _requestNextPage = () => {
    const nextPage = (currentPage + 1) % groupedResults.length;
    setCurrentPage(nextPage);
  };
  const _requestPrevPage = () => {
    const prevPage = (currentPage - 1 + groupedResults.length) % groupedResults.length;
    setCurrentPage(prevPage);
  };
  const _requestFirstPage = () => {
    setCurrentPage(0);
  };
  const _requestLastPage = () => {
    setCurrentPage(groupedResults.length - 1);
  };

  const getDiffDay = (itemDate) => {
    const futureDate = moment.unix(itemDate).format('MM-DD-YYYY');
    return moment().utc().diff(futureDate, 'days');
  };

  const bookedClicked = (index) => {
    const _selectedBookings: boolean[] = (selectedBookings as any).map(
      (current, id, array: Booking[] | boolean[]) => (id === index ? !current : current)
    );
    setSelectedBookings(_selectedBookings);
    selectBooking?.(_selectedBookings);
  };

  const getTotalTaxes = (id) => {
    if (totalTax && totalTax.length > 0) {
      let tax;
      totalTax.map(function (data) {
        if (data.id == id) {
          tax = toMoney(data.tax.toString());
        }
      });
      return tax;
    }
  };

  if (results === undefined || results === null || results.length <= 0) {
    return <BlankThing message='You have no booked offers.' />;
  }

  return (
    <Container className='ProductBookedOffers d-flex flex-column '>
      <Modal isOpen={isOpenModal}>
        <ModalBody>Do you really want to delete this Booked offer?</ModalBody>
        <ModalFooter>
          <Button
            color='primary'
            onClick={() => {
              setIsOpenModal(false);
              bookingIdDeleted && deleteBooking?.(bookingIdDeleted);
            }}
          >
            Yes
          </Button>{' '}
          <Button color='secondary' onClick={() => setIsOpenModal(false)}>
            No
          </Button>
        </ModalFooter>
      </Modal>

      <div className='row px-2'>
        {pageResults.length > 0 ? (
          (pageResults as any).map((booking: Booking, index) => (
            <div
              className='col-sm-6 col-md-6 col-lg-4 px-2 py- 2 product-booked-offer-card'
              key={`booking_offer_${index}`}
              onClick={() => bookedClicked(index)}
            >
              <div
                className={`product-booking-content
                ${selectedBookings[index] === true ? ' selected-product-booked-offer' : ''}`}
              >
                <div className='row title-container'>
                  {' '}
                  {isOffer(booking.item) ? booking.item.title : (booking.item as Product).name}
                </div>
                <div className='d-flex flex-row booking-container' style={{ width: '100%' }}>
                  <div className='booked-offer-card-image' style={{ width: '40%' }}>
                    <img
                      src={
                        isOffer(booking.item)
                          ? booking.item.product
                            ? `${replaceDomain(
                                booking.item.product.imageUrl
                              )}?width=${166}&height=${144}`
                            : ''
                          : `${replaceDomain(
                              (booking.item as Product).imageUrl
                            )}?width=${166}&height=${144}`
                      }
                      className='card-img'
                      alt='...'
                    />
                    <div className='booked-offer-actions'>
                      <input
                        type='image'
                        width='22px'
                        height='22px'
                        src='/images/trash-with-bg.svg'
                        alt='Trash'
                        onClick={() => {
                          setBookingIdDeleted(booking._id);
                          setIsOpenModal(true);
                        }}
                      />
                      <span>&#160;</span>
                      <input
                        type='image'
                        width='22px'
                        height='22px'
                        src='/images/calendar-with-bg.svg'
                        alt='Calendar'
                        onClick={() => console.log('clicked calendar')}
                      />
                    </div>
                  </div>

                  <div className='booked-offer-card-description' style={{ width: '60%' }}>
                    <div className='card-body'>
                      <RenderIf condition={isOffer(booking.item)}>
                        <div className='booked-card-description'>
                          <p className='card-title product-name'>
                            {
                              // booking.item.productName // FIXME: Property 'productName' does not exist on type 'Offer'
                            }
                          </p>
                          <div className='progress'>
                            <div
                              className='progress-bar '
                              role='progressbar'
                              style={
                                {
                                  // FIXME: Property 'maxVisits' does not exist on type 'Offer'
                                  //width: (booking.visits / booking.item.maxVisits) * 100 + '%',
                                }
                              }
                              aria-valuenow={20}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>

                          <p className='card-text'>
                            Visit {booking.visits} of{' '}
                            {
                              // FIXME: Property 'maxVisits' does not exist on type 'Offer'
                              // booking.item.maxVisits
                            }
                          </p>
                        </div>
                      </RenderIf>
                      {/* <RenderIf
                        condition={
                          isOffer(booking.item) && booking.visits >= booking.item.maxVisits
                        }
                      >
                        <div className="booked-card-description">
                          <p className="card-title product-name">
                            {
                              booking.item.productName
                            }
                          </p>
                          <div className="progress">
                            <div
                              className="progress-bar "
                              role="progressbar"
                              style={{ width: "100%" }}
                              aria-valuenow={20}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>

                          <p className="card-text">Visit {booking.visits}</p>
                        </div>
                      </RenderIf> */}

                      <RenderIf
                        condition={
                          isOffer(booking.item) && booking.item.cashBackPerVisit !== undefined
                        }
                      >
                        <div className='cashback-amount'>
                          {isOffer(booking.item) ? fromMoney(booking.item.cashBackPerVisit) : null}{' '}
                          Cash Back
                        </div>
                      </RenderIf>

                      <div className='original-price'>
                        Original Price{' '}
                        {fromMoney(
                          isOffer(booking.item)
                            ? booking.item?.product?.price
                            : (booking.item as Product)?.price
                        )}
                      </div>
                      <RenderIf
                        condition={
                          isOffer(booking.item) && getDiffDay(booking.item.expiration) <= 0
                        }
                      >
                        <div className='expires-date'>
                          Expires{' '}
                          {isOffer(booking.item) && booking.item.expiration
                            ? moment.unix(booking.item.expiration).local().format('MM-DD-YYYY')
                            : ''}
                        </div>
                      </RenderIf>
                      <RenderIf
                        condition={isOffer(booking.item) && getDiffDay(booking.item.expiration) > 0}
                      >
                        <div className='expires-date expired'>
                          Expires{' '}
                          {isOffer(booking.item) && booking.item.expiration
                            ? moment.unix(booking.item.expiration).local().format('MM-DD-YYYY')
                            : ''}
                        </div>
                      </RenderIf>

                      <div className='expires-date expired'>
                        Total Tax{' '}
                        {fromMoney(
                          getTotalTaxes(
                            isOffer(booking.item)
                              ? booking.item.product
                                ? booking.item.product._id
                                : null
                              : booking.item._id
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='col-sm-6 col-md-4 col-lg-4'>
            <BlankThing message='No Booked offers on this page.' />
          </div>
        )}
      </div>
    </Container>
  );
};
export default GridProductBookedOffers;
