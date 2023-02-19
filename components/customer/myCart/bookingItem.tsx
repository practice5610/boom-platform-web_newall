import { Booking, fromMoney, isOffer, isProduct, Product } from '@boom-platform/globals';
import React, { FC, ReactElement, useState } from 'react';
import { Col, Row } from 'reactstrap';

import { deleteBooking } from '../../../redux/actions/account-member';
import { replaceDomain } from '../../../utils/images';

type Props = {
  item?: Booking;
  deleteBooking?: typeof deleteBooking;
};

export const BoookingItem: FC<Props> = ({ item, deleteBooking }): ReactElement => {
  const [counter, setCounter] = useState(1);

  const _onCounterChange = (op) => {
    let newCount = counter;
    if (op === 'inc') {
      newCount = counter + 1;
    } else if (counter > 1) {
      newCount = counter - 1;
    }
    setCounter(newCount);
  };

  let product: Product | undefined;
  if (isOffer(item?.item)) product = item?.item.product;
  if (isProduct(item?.item)) product = item?.item;
  return (
    <div className='container-fluid border-top px-5 py-2'>
      <Row className='d-flex flex-nowrap'>
        <Col sm='4' className='d-flex flex-wrap'>
          <div className='mw-80 mh-80'>
            <img
              src={replaceDomain(product?.imageUrl) ?? 'https://via.placeholder.com/100'}
              alt='Girl in a jacket'
              width='100%'
              height='100%'
            />
          </div>
        </Col>
        <Col sm='auto' className='d-flex align-items-center flex-nowrap'>
          <div className='cut-text'>
            <h4 className='mt-1'>{product?.name}</h4>
            <h5 className='mt-1'>{fromMoney(product?.price)}</h5>
            <small className='mt-1'>
              {product && product.quantity > 1 ? 'in stock' : 'out of stock'}
            </small>
            <br />
            <small className='mt-1'>
              {product?.shippingPolicy.includes('Free')
                ? 'free shipping available'
                : 'shipping options avaliable'}
            </small>
            {product && product.quantity > 1 && (
              <div className='mt-1'>
                <span>
                  <i
                    className='fa fa-minus-circle bg-black mr-2'
                    aria-hidden='true'
                    onClick={() => _onCounterChange('dec')}
                  />
                  {counter}
                  <i
                    className='fa fa-plus-circle bg-black ml-2'
                    aria-hidden='true'
                    onClick={() => _onCounterChange('inc')}
                  />
                </span>
              </div>
            )}
            <div className='mt-1'>
              <span
                className='text-danger'
                onClick={() => {
                  item?._id && deleteBooking?.(item._id);
                }}
              >
                Remove
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
