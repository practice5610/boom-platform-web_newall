import { Booking, fromMoney, isOffer, toMoney } from '@boom-platform/globals';
import Dinero from 'dinero.js';
import { useRouter } from 'next/router';
import React, { FC, ReactElement, useState } from 'react';
import { Button } from 'reactstrap';

import { addCheckout } from '../../../redux/actions/account-member';
import { deleteImage, getImage, uploadImage } from '../../../redux/actions/image';

type Props = {
  handleSetSelectedAddress: () => void;
  results?: Booking[];
};

export const SubtotalCheckout: FC<Props> = ({
  results,
  handleSetSelectedAddress,
}): ReactElement => {
  const router = useRouter();
  const calculateSubTotal = () => {
    if (results) {
      let subTotal = 0;
      results.map((value, index) => {
        subTotal +=
          value.quantity *
          (isOffer(value.item)
            ? Dinero(value.item.product.price).toUnit()
            : Dinero(value.item.price).toUnit());
      });
      return fromMoney(toMoney(subTotal));
    }
  };
  const handledCheckout = () => {
    // router.push('/account/customer/checkout');
  };
  return (
    <div className='container-fluid border p-1 m-1'>
      <div className='d-flex justify-content-center m-3'>
        <strong>
          Subtotal ({`${results?.length}`} item{results && results.length > 1 ? 's' : ''}):
          {` ${calculateSubTotal()}`}
        </strong>
      </div>
      <div className='d-flex justify-content-center m-2'>
        <Button onClick={handleSetSelectedAddress}>proceed to checkout</Button>
      </div>
    </div>
  );
};
