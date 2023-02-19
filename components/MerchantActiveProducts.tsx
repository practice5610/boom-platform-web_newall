import { fromMoney, Product } from '@boom-platform/globals';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { deleteProduct, requestProducts } from '../redux/actions/account-merchant';
import { AppState } from '../redux/reducers';
import { replaceDomain } from '../utils/images';
import HTMLContent from './HTMLContent';
import RenderIf from './utils/RenderIf';

interface Props {
  requestProducts?: typeof requestProducts;
  products?: Product[];
  deleteProduct?: typeof deleteProduct;
}
const pageSize = 50;

const MerchantActiveProducts: FunctionComponent<Props> = ({
  requestProducts,
  products,
  deleteProduct,
}) => {
  const [curPage, setCurPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);

  useEffect(() => {
    requestProducts!();
  }, []);

  useEffect(() => {
    if (products === null) return;
    setPagesCount(Math.ceil(products!.length / pageSize));
  }, [products]);

  const onPaginationClick = (e, ind) => {
    e.preventDefault();
    setCurPage(ind);
  };

  const onCancel = (id) => {
    deleteProduct!(id);
    requestProducts!();
  };

  const Item = (item) => {
    return (
      <div key={item._id} className='active-offers-box d-flex align-items-center pt-3 pb-3'>
        <div className='active-box'></div>
        <div className='d-flex'>
          {replaceDomain(item.imageUrl) && (
            <img width='154' height='157' src={replaceDomain(item.imageUrl)} alt='Product' />
          )}
          <div>
            <div className='original-price-box pl-2 pt-1' style={{ height: 157 }}>
              <span className='cashback-text'>Price</span>
              <br />
              <span className='original-price'>{fromMoney(item?.price)}</span>{' '}
            </div>
          </div>
        </div>
        <div className=' active-results pl-3'>
          <HTMLContent content={item?.name ?? ''} tag={'h2'} />
          <div className='d-flex'>
            <div className='visit-left pr-5'>
              <div>
                <HTMLContent content={item!.description} tag={'span'} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='button-container'>
            <button
              type='button'
              className='cancel-btn d-flex align-items-center justify-content-center'
              style={{ backgroundColor: '#D42C29' }}
              onClick={() => onCancel(item!._id)}
            >
              Cancel
            </button>
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
          {/* {[...Array(pagesCount)].map((page, i) => (
            <PaginationItem active={i === curPage} key={i}>
              <PaginationLink onClick={e => onPaginationClick(e, i)}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))} */}
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
          {products
            ? products
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
  products: state.accountMerchant.products,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MerchantActiveProducts);
