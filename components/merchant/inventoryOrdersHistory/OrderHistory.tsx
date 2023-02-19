import { InventoryOrder } from '@boom-platform/globals';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { bindActionCreators } from 'redux';

import actionCreators from '../../../redux/actions';
import { OrderTableItem } from './OrderTableItem';

interface Props {
  inventoryOrder?: InventoryOrder[];
}

export const OrderHistory: FC<Props> = ({ inventoryOrder }) => {
  const [orderState, setOrderState] = useState<InventoryOrder[] | undefined>(undefined);

  useEffect(() => {
    setOrderState(inventoryOrder);
  }, [inventoryOrder]);

  const _sortByColumn = (column: string) => {
    const sortedOrders: InventoryOrder[] = _.sortBy(orderState, [column]);
    setOrderState(sortedOrders);
  };

  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th
            onClick={() => {
              _sortByColumn('product.store._id');
            }}
          >
            Store Id
          </th>
          <th
            onClick={() => {
              _sortByColumn('status');
            }}
          >
            Status
          </th>
          <th
            onClick={() => {
              _sortByColumn('createdAt');
            }}
          >
            Ordered
          </th>
          <th
            onClick={() => {
              _sortByColumn('item.itemType');
            }}
          >
            Item
          </th>
          <th
            onClick={() => {
              _sortByColumn('amount');
            }}
          >
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {orderState?.map((inventoryOrders: InventoryOrder) => (
          <OrderTableItem key={inventoryOrders._id} inventoryOrder={inventoryOrders} />
        ))}
        {console.log('Orderstate', orderState)}
      </tbody>
    </Table>
  );
};
