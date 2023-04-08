import {
  fromMoney,
  isOffer,
  isProduct,
  isStore,
  Money,
  Transaction,
  TransactionType,
} from '@boom-platform/globals';
import Dinero from 'dinero.js';
import moment from 'moment';
import React, { FunctionComponent, useState } from 'react';
import { FormGroup, Input, Table } from 'reactstrap';

import { PopperPlacement } from '../constants';
import { replaceDomain } from '../utils/images';
import DateFilter from './DateFilter';

type Props = {
  transactions?: Transaction[];
  requestSearch?: (type: TransactionType, filters?: any) => void;
  balance?: Money;
};

const defaultDate = moment().local().toDate();

const TableMemberTransactionHistory: FunctionComponent<Props> = ({
  balance,
  requestSearch,
  transactions,
}) => {
  const [dateFilterValue, setDateFilterValue] = useState<Date>(defaultDate);
  const [searchFilterValue, setSearchFilterValue] = useState<string>('');
  console.log('checktrans', transactions);
  const filterTransactionsByDate = (value) => {
    let filter;
    if (value) {
      setDateFilterValue(value);
      const time = moment(value).startOf('day').unix();
      filter = {
        or: [
          {
            createdAt: { gte: time },
          },
        ],
      };
    }
    requestSearch?.(TransactionType.PURCHASE, filter);
  };

  const filterTransactions = (value) => {
    let filter;
    if (searchFilterValue && searchFilterValue !== '') {
      filter = {
        or: [
          /**
           * Once AddressInfo interface is implemented, add search filter option for address here
           */
          {
            'purchaseItem.product.name': { like: `.*${searchFilterValue}.*`, options: 'i' },
          },
          {
            'purchaseItem.product.description': {
              like: `.*${searchFilterValue}.*`,
              options: 'i',
            },
          },
          {
            status: { like: `.*${searchFilterValue}.*`, options: 'i' },
          },
          {
            'receiver.companyName': {
              like: `.*${searchFilterValue}.*`,
              options: 'i',
            },
          },
        ],
      };
    }
    requestSearch?.(TransactionType.PURCHASE, filter);
  };

  if (transactions?.length) {
    const transactions_list = transactions.map((transaction: Transaction) => {
      const isValidTransactionType =
        transaction.type === TransactionType.FUNDING ||
        transaction.type === TransactionType.TRANSFER ||
        transaction.type === TransactionType.RETURN;

      return true ? (
        <tr key={transaction._id}>
          <td>
            {isValidTransactionType ? (
              <i id='calendar' className='fa fa-calendar'></i>
            ) : isOffer(transaction.purchaseItem) ? (
              transaction.purchaseItem.product?.imageUrl && (
                <img
                  src={replaceDomain(transaction.purchaseItem.product.imageUrl)}
                  height='100'
                  width='100'
                  alt={
                    transaction.purchaseItem.product.description ??
                    'Product description unavailable'
                  }
                />
              )
            ) : isProduct(transaction.purchaseItem) ? (
              transaction.purchaseItem.imageUrl && (
                <img
                  src={replaceDomain(transaction.purchaseItem.imageUrl)}
                  height='100'
                  width='100'
                  alt={transaction.purchaseItem.description ?? 'Product description unavailable'}
                />
              )
            ) : (
              'No image available'
            )}
          </td>
          <td className='transaction-id'>
            <b>{transaction._id}</b>
          </td>
          <td className='company-name'>{transaction.receiver?.companyName || 'usman ali'}</td>
          <td>
            {
              // TODO:
              // Need to implement the new AddressInfo Interface here
              // transaction.receiver.address}, {transaction.receiver.city
            }
          </td>
          <td>{transaction.amount && fromMoney(transaction.amount)}</td>
          <td>
            {transaction?.amount && transaction?.cashback
              ? fromMoney(
                  Dinero(transaction?.amount)
                    .subtract(Dinero(transaction?.cashback))
                    .toObject() as Money
                )
              : '-'}
          </td>
          <td>{fromMoney(transaction?.cashback)}</td>
          <td>
            {/**
             * TODO:
             * This will need to be updated to call the API for tracking information
             */}
            {transaction.shippingOrderId ?? 'Tracking Not Available'}
          </td>
          <td>{transaction.status}</td>
          <td>
            {transaction.createdAt &&
              moment.unix(transaction.createdAt).local().format('MM/DD/YYYY')}
          </td>
        </tr>
      ) : null;
    });

    return (
      <div className='CustomerTransactions w-100'>
        <div className='customer-transactions'>
          <div className='search-bar d-flex'>
            <div className='row'>
              <div className='column left'>
                <h2>Recent Transactions</h2>
              </div>
              <div className='column right d-flex'>
                <Input
                  type='search'
                  placeholder='Search'
                  onChange={(e) => {
                    setSearchFilterValue(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      filterTransactions(e);
                    }
                  }}
                />
                <FormGroup className='d-flex'>
                  <DateFilter
                    selected={dateFilterValue}
                    onChange={(event) => filterTransactionsByDate(event)}
                    popperPlacement={PopperPlacement.BOTTOM_END}
                  />
                  <span className='date-string'>
                    {moment(dateFilterValue).local().format('MM/DD/YYYY')}
                  </span>
                </FormGroup>
              </div>
            </div>
          </div>
          <div className='recent-transactions'>
            <Table>
              <thead>
                <tr>
                  <th className='id-image'></th>
                  <th className='id-header'>Transaction Id</th>
                  <th className='company-header'>Company Name</th>
                  <th className='address-header'>Address</th>
                  <th className='value-header'>Value</th>
                  <th className='balance-header'>Balance</th>
                  <th className='cashback-header'>Cashback</th>
                  <th className='tracking-header'>Tracking Link</th>
                  <th className='status-header'>Status</th>
                  <th className='status-header'>Date</th>
                </tr>
              </thead>
              <tbody>{transactions_list}</tbody>
            </Table>
          </div>
          <div className='customer-account-balance d-flex align-items-center justify-content-end'>
            <span className='balance-string'>
              Available Balance:&nbsp;<b>{fromMoney(balance)}</b>{' '}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='CustomerTransactions w-100'>
        <div className='customer-transactions'>
          <div className='search-bar d-flex'>
            <div className='row'>
              <div className='column left'>
                <h2>Recent Transactions</h2>
              </div>
              <div className='column right d-flex'>
                <Input
                  type='search'
                  placeholder='Search'
                  onChange={(event) => filterTransactions(event.target.value)}
                />
                <FormGroup className='d-flex'>
                  <DateFilter
                    selected={dateFilterValue}
                    onChange={(event) => filterTransactionsByDate(event)}
                  />
                  <span className='date-string'>
                    {moment(dateFilterValue).local().format('MM/DD/YYYY')}
                  </span>
                </FormGroup>
              </div>
            </div>
          </div>
          <div className='no-transactions'>
            <span>There are no transactions found matching the given search criteria.</span>
          </div>
          <div className='customer-account-balance d-flex align-items-center justify-content-end'>
            <span className='balance-string'>
              Available Balance:&nbsp;<b>{fromMoney(balance)}</b>{' '}
            </span>
          </div>
        </div>
      </div>
    );
  }
};
export default TableMemberTransactionHistory;
