import {
  fromMoney,
  isOffer,
  isProduct,
  isStore,
  Money,
  Order,
  Transaction,
  TransactionType,
} from '@boom-platform/globals';
import Dinero from 'dinero.js';
import moment from 'moment';
import React, { FunctionComponent, useState } from 'react';
import { FormGroup, Input, Table } from 'reactstrap';

type Props = {
  orders?: Order[];
};

const defaultDate = moment().local().toDate();

const TableCustomerRetunsAndOrders: FunctionComponent<Props> = ({ orders }) => {
  console.log(orders);
  return (
    <div className='CustomerTransactions w-100'>
      <div className='customer-transactions'>
        <div className='search-bar d-flex'>
          <div className='row'>
            <div className='column left'>
              <h2>Your Orders</h2>
            </div>
          </div>
        </div>
        <div className='recent-transactions'>
          <Table>
            <thead>
              <tr>
                <th className='id-header'>Order#</th>
                <th className='company-header'>Order placed</th>
                <th className='address-header'>Shiping Group(s)</th>
                <th className='value-header'>Ship to</th>
                <th className='balance-header'>Total Item(s)</th>
                <th className='status-header'>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length &&
                orders.map((order: Order) => {
                  return (
                    <tr key={order._id}>
                      <td>
                        <b>{order._id}</b>
                      </td>
                      <td>
                        <b>
                          {order.createdAt &&
                            moment.unix(order.createdAt).local().format('MMMM Do YYYY')}
                        </b>
                      </td>
                      <td>
                        <b>{order.orderGroups.length}</b>
                      </td>
                      <td>
                        <b>{order.shipToAddress.name}</b>
                      </td>
                      <td>
                        <b>{order.transactions?.length}</b>
                      </td>
                      <td>
                        <b>In process</b>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
export default TableCustomerRetunsAndOrders;
