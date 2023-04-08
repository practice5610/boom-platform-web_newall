import { AddressInfo, Booking, BoomUser } from '@boom-platform/globals';
import React, { FC, ReactElement, useState } from 'react';
import { Row } from 'reactstrap';

import { deleteBooking, selectBooking } from '../../../redux/actions/account-member';
import { BoookingItem } from './bookingItem';

type Props = {
  results?: Booking[];
  deleteBooking?: typeof deleteBooking;
  selectBooking?: typeof selectBooking;
  //   totalTax?: Tax[] | null | undefined;
  //   pageSize?: number;
  /**
   * Limit what results are displayed in total regardless of result count
   */
  //   limit?: number;
};

export const BoookingTable: FC<Props> = ({
  results,
  deleteBooking,
  selectBooking,
}): ReactElement => {
  return (
    <div className='container-fluid p-5'>
      <Row>
        <h3 className='table-tittle m-3'>My Cart</h3>
      </Row>
      <Row>
        {results?.map((value, index) => (
          <BoookingItem item={value} key={index} deleteBooking={deleteBooking} />
        ))}
      </Row>
    </div>
  );
};
