import { fromMoney, Offer } from '@boom-platform/globals';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { deleteOffer, requestOffers, setOffers } from '../redux/actions/account-merchant';
import { AppState } from '../redux/reducers';
import { replaceDomain } from '../utils/images';
import HTMLContent from './HTMLContent';
import RenderIf from './utils/RenderIf';

interface Props {
  requestOffers?: typeof requestOffers;
  deleteOffer?: typeof deleteOffer;
  setOffers?: typeof setOffers;
  offers?: Offer[];
}

const pageSize = 100;
let pagesCount = 0;

const MerchantActiveOffers: FunctionComponent<Props> = ({ requestOffers, offers, deleteOffer }) => {
  const [curPage, setCurPage] = useState(0);

  useEffect(() => {
    requestOffers?.();
  }, [requestOffers]);

  useEffect(() => {
    if (offers?.length) {
      pagesCount = Math.ceil(offers.length / pageSize);
    }
  }, [offers]);

  const onPaginationClick = (e, ind) => {
    e.preventDefault();
    setCurPage(ind);
  };

  const onCancel = (id) => {
    deleteOffer?.(id);
    requestOffers?.();
  };

  const Item = (item) => {
    const curtime = moment(new Date()).unix();
    return (
      <div key={item._id} className='active-offers-box d-flex align-items-center pt-3 pb-3'>
        <div className='active-box'></div>
        <div className='d-flex'>
          <img
            width='154'
            height='157'
            src={replaceDomain(item?.product?.imageUrl)}
            alt='Product'
          />
          <div>
            <div className='original-price-box pl-2 pt-1'>
              <span className='original-text'>Original Price</span>
              <br />
              <span className='original-price'>{fromMoney(item?.product?.price)}</span>{' '}
            </div>
            <div className='cashback-box pl-2 pt-1'>
              <span className='cashback-text'>Cash Back Up To</span>
              <br />
              <span className='cashback-price'>{fromMoney(item?.cashBackPerVisit)}</span>{' '}
            </div>
          </div>
        </div>
        <div className=' active-results pl-3'>
          <h2>{item?.title}</h2>
          <div className='d-flex'>
            <div className='visit-left pr-5'>
              <div>
                <HTMLContent content={item?.description} tag={'span'} />
              </div>
            </div>
          </div>
        </div>
        <div className='ml-auto'>
          <div className='button-container'>
            {curtime > item?.expiration ? (
              <div>
                <span style={{ fontSize: '1.5rem' }}>
                  <b>Expired</b>
                </span>
                <button
                  type='button'
                  className='expired-btn d-flex align-items-center justify-content-center'
                >
                  Reactivate
                </button>
              </div>
            ) : (
              <button
                type='button'
                className='cancel-btn d-flex align-items-center justify-content-center'
                onClick={() => onCancel(item?._id)}
              >
                Cancel
              </button>
            )}
            <div className='activate-expire-text d-flex align-items-center justify-content-center'>
              <span style={{ fontSize: '1rem' }}>
                Activated: {moment.unix(item?.createdAt).format('MM/DDYYYY')}
                <br />
                Expires: {moment.unix(item?.expiration).format('MM/DD/YYYY')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <RenderIf condition={pagesCount > 1}>
        <Pagination size='sm' aria-label='Products'>
          <PaginationItem>
            <PaginationLink first onClick={(e) => onPaginationClick(e, 0)} />
          </PaginationItem>
          <PaginationItem disabled={curPage <= 0}>
            <PaginationLink previous onClick={(e) => onPaginationClick(e, curPage - 1)} />
          </PaginationItem>
          {[...Array(pagesCount)].map((page, i) => (
            <PaginationItem active={i === curPage} key={i}>
              <PaginationLink onClick={(e) => onPaginationClick(e, i)}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem disabled={curPage >= pagesCount - 1}>
            <PaginationLink next onClick={(e) => onPaginationClick(e, curPage + 1)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink last onClick={(e) => onPaginationClick(e, pagesCount - 1)} />
          </PaginationItem>
        </Pagination>
      </RenderIf>

      <div className=' container-active p-0'>
        <div className='merchant-active-offers'>
          {offers
            ? offers
                .slice(curPage * pageSize, (curPage + 1) * pageSize)
                .map((item, index) => Item(item))
            : null}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
  offers: state.accountMerchant.offers,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MerchantActiveOffers);
