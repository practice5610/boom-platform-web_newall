import {
  InventoryOrder,
  InventoryOrderBillingType,
  InventoryOrderStatus,
  Offer,
} from '@boom-platform/globals';
import React, { FC, ReactElement } from 'react';

import { InputFilter } from '../InputFilter';
import Pagination, { PageData } from '../Pagination';
import { OrderHistory } from './OrderHistory';

type Props = {
  title: string;
  inventoryOrder?: InventoryOrder[];
  onPageChanged?: (data: PageData) => void;
  onFilterChanged?: (filter: string) => void;
};

export const FilterableOrderList: FC<Props> = ({
  title,
  inventoryOrder,
  onPageChanged,
  onFilterChanged,
}): ReactElement => {
  return (
    <div className='filterable-product-table container-fluid border p-5'>
      <div className='filterable-product-table-header'>
        <p className='table-tittle m-3'>{title}</p>
        <Pagination
          totalRecords={10}
          pageLimit={10}
          pageNeighbours={2}
          onPageChanged={onPageChanged}
        />
        <InputFilter onFilterChanged={onFilterChanged} />
      </div>
      <OrderHistory inventoryOrder={inventoryOrder} />
    </div>
  );
};
