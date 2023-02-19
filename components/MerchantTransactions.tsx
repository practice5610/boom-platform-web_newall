import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-community';

import {
  fromMoney,
  getComposedAddressFromStore,
  Money,
  toMoney,
  Transaction,
  TransactionType,
} from '@boom-platform/globals';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Dinero from 'dinero.js';
import _ from 'lodash';
import moment from 'moment';
import React, { Fragment, FunctionComponent, useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  Label,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';

import us_states from '../constants/states';
import { addTaxableStates, requestMerchantTransactions } from '../redux/actions/account-merchant';
import { AppState } from '../redux/reducers';
import { duplicateObject } from '../utils/common';

const MerchantTransactions: FunctionComponent<{}> = () => {
  const dispatch = useDispatch();
  const [states, setStates] = useState<any[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [dateFilter, setDateFilter] = useState('');
  const transactions = useSelector((state: AppState) => state?.accountMerchant?.transactions ?? []);
  const { user, isUserSignedIn } = useSelector(
    (state: AppState) => state?.auth ?? { user: undefined, isUserSignedIn: false }
  );
  const [isTaxReportModalOpen, setIsTaxReportModalOpen] = useState<boolean>(false);
  const stableDispatch = useCallback(dispatch, []);

  useEffect(() => {
    stableDispatch(requestMerchantTransactions(TransactionType.PURCHASE, null, 10));
  }, [stableDispatch, isUserSignedIn]);

  useEffect(() => {
    if (user) {
      const taxableStates: any = {};
      const merchantStates: any[] = [];
      if (user.taxableNexus?.length) {
        user.taxableNexus.forEach((e) => {
          taxableStates[e.state] = e.state;
        });
      }
      us_states.forEach((element) => {
        merchantStates.push({
          ...element,
          isChecked: taxableStates[element.value] != null ? true : false,
        });
      });
      setStates(merchantStates);
    }
  }, [user]);

  const getTransactions = () => {
    if (transactions?.length) {
      const data: any[] = [];
      transactions.forEach((transaction) => {
        data.push({
          id: transaction._id ? transaction._id : '',
          /**
           * TODO: Need to implement new AddressInfo Interface here, We can use getComposedAddressFromStore
           */
          // address: `${transaction?.receiver?.['address'] ? transaction.receiver['address'] : ''}`,
          value: fromMoney(transaction?.amount),
          balance:
            transaction.amount &&
            transaction.cashback &&
            fromMoney(
              Dinero(transaction.amount).subtract(Dinero(transaction.cashback)).toObject() as Money
            ),
          cashback: fromMoney(transaction.cashback) ?? toMoney(0),
          salestax: fromMoney(transaction.salestax) ?? toMoney(0),
          company_name: transaction?.receiver?.['companyName'] ?? '',
          status: transaction.status,
          action: '...',
        });
      });
      return data;
    } else return [];
  };

  const handleSelectAll = () => {
    const tmpStates = duplicateObject(states);
    const status = isSelectAll ? false : true;
    tmpStates.forEach((s) => {
      s['isChecked'] = status;
    });
    setIsSelectAll((oldvalue) => !oldvalue);
    setStates(tmpStates);
  };

  const handleSelectState = (index) => {
    setStates((oldvalue) => {
      const newValue = [...oldvalue];
      newValue[index]['isChecked'] = !newValue[index]['isChecked'];
      return newValue;
    });
  };

  const handleSubmitState = () => {
    const data: any[] = [];
    states.forEach((state) => {
      if (state['isChecked']) {
        data.push({
          state: state.value,
          country: 'US',
        });
      }
    });
    dispatch(addTaxableStates(data));
  };

  const filterTransactionsByDate = (value) => {
    let filter;
    if (value !== '') {
      setDateFilter(moment(value).format('MM/DD/YYYY'));
      const time = moment(value).unix();
      filter = {
        or: [
          {
            createdAt: { gte: time },
          },
        ],
      };
    }
    dispatch(requestMerchantTransactions(TransactionType.PURCHASE, filter));
  };

  const filterTransactions = _.debounce((value) => {
    let filter;
    if (value !== '') {
      filter = {
        or: [
          {
            'receiver.companyName': {
              like: `.*${value}.*`,
              options: 'i',
            },
          },
          {
            // TODO: Need to implement the new AddressInfo Interface here
            /*'receiver.address': {
              like: `.*${value}.*`,
              options: 'i',
            },*/
          },
          {
            'receiver.city': {
              like: `.*${value}.*`,
              options: 'i',
            },
          },
          {
            'purchaseItem.description': {
              like: `.*${value}.*`,
              options: 'i',
            },
          },
        ],
      };
    }
    dispatch(requestMerchantTransactions(TransactionType.PURCHASE, filter));
  }, 1000);

  const toggleModal = () => {
    setIsTaxReportModalOpen((isTaxReportModalOpen) => !isTaxReportModalOpen);
  };

  const getTotalTaxes = useCallback(() => {
    let total = toMoney(0);
    transactions?.map((taxes) => {
      if (taxes.taxcode?.state) {
        total = toMoney(Dinero(total).add(Dinero(taxes.salestax)).toUnit());
      }
    });
    return fromMoney(total);
  }, [transactions]);

  const getTaxTable = useCallback(() => {
    /**
     * The function provided in the reduce() method is called on each element within the transactions array.
     *
     * If there is no state provided or the state is undefined, the first value in the array is returned.
     *
     * If the first value (acc) matches the second value (current), then add the sales tax values and return
     * the new sales tax amount as the total for that state.
     *
     * In the return, we are mapping through the new array created to display only the company name,
     * the sales tax states, and the totals owed to each state.
     */
    const combined = transactions?.reduce((acc, current): Transaction[] => {
      if (!current.taxcode?.state) {
        return acc;
      }
      const prevState = acc.find(
        (item) => current.taxcode && item.taxcode?.state === current.taxcode.state
      );
      if (prevState) {
        const newTotal: Money = Dinero(prevState.salestax)
          .add(Dinero(current.salestax))
          .toObject() as Money;
        return acc.map((item) => {
          if (item.taxcode?.state === current.taxcode?.state) {
            return { ...item, salestax: newTotal };
          }
          return item;
        });
      }
      return [...acc, current];
    }, [] as Transaction[]);
    return (
      <Container fluid>
        <Row>
          <Col>
            {combined?.map((states) => {
              if (states.taxcode?.state !== '' || states.taxcode?.state !== null) {
                return (
                  <Fragment key={states._id}>
                    <div>
                      <b>Company Name: </b>
                      {states.receiver ? states.receiver['companyName'] : ''}
                    </div>
                    <div className='border' />
                    <br />
                    <Table size='sm' responsive bordered>
                      <thead>
                        <tr>
                          <td>
                            <b>Taxes Owed</b>
                          </td>
                          <td>
                            <b>State</b>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{fromMoney(states.salestax)}</td>
                          <td>{states.taxcode?.state}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Fragment>
                );
              }
            })}
          </Col>
        </Row>
      </Container>
    );
  }, [transactions]);

  return (
    <div className='Merchant-Transactions container-fluid'>
      <Modal isOpen={isTaxReportModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
          Tax Breakdown Per State
        </ModalHeader>
        <ModalBody>{getTaxTable()}</ModalBody>
        <ModalFooter>
          <Button
            color='secondary'
            onClick={toggleModal}
            style={{ borderRadius: '5px', marginRight: '1rem' }}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>
      <div className='TableTransaction-acc'>
        <div className='table-container'>
          <div className='row col-md-12'>
            <div className='col-md-9'>
              <div className='row col-md-12'>
                <div className='col-md-8'>
                  <h4>Transactions</h4>
                </div>
                <div className='col-md-4'>
                  <InputGroup>
                    <div className='Search-field d-flex justify-content-between align-items-center'>
                      <Input
                        placeholder='Search'
                        onChange={(event) => filterTransactions(event.target.value)}
                        value={dateFilter}
                      />
                      <DatePicker
                        popperPlacement='top-end'
                        onChange={(event) => filterTransactionsByDate(event)}
                        customInput={
                          <Button className='calendar-button'>
                            <i id='calendar' className='fa fa-calendar'></i>
                          </Button>
                        }
                      />
                    </div>
                  </InputGroup>
                </div>
              </div>
              <div
                className='ag-theme-material col-md-12 mt-3'
                style={{ height: 600, width: '100%' }}
              >
                <AgGridReact
                  rowData={getTransactions()}
                  pagination={true}
                  paginationPageSize={10}
                  paginationNumberFormatter={function (params) {
                    return '[' + params.value.toLocaleString() + ']';
                  }}
                  defaultColDef={{
                    width: 150,
                    editable: false,
                    filter: true,
                    resizable: true,
                    sortable: true,
                  }}
                >
                  <AgGridColumn field='id' headerName='ID'></AgGridColumn>
                  <AgGridColumn field='company_name' headerName='Company Name'></AgGridColumn>
                  {/**
                   * TODO: Need to implement the new AddressInfo Interface Here
                   */}
                  <AgGridColumn field='address' headerName='Address'></AgGridColumn>
                  <AgGridColumn field='value' headerName='Value'></AgGridColumn>
                  <AgGridColumn field='balance' headerName='Balance'></AgGridColumn>
                  <AgGridColumn field='cashback' headerName='Cashback'></AgGridColumn>
                  <AgGridColumn field='salestax' headerName='Sales Tax'></AgGridColumn>
                  <AgGridColumn
                    field='status'
                    headerName='Status'
                    cellRenderer={(params) => {
                      return `<div class="alert alert-success status-wrapper" role="alert"><center><h6>${params.value}</h6></center></div>`;
                    }}
                  ></AgGridColumn>
                  <AgGridColumn field='action' headerName=''></AgGridColumn>
                </AgGridReact>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='row col-md-12'>
                <div className='col-md-6'>
                  <h4>Revenue</h4>
                </div>
              </div>
              <div className='row col-md-12 mt-4'>
                <div className='col-md-6'>
                  <p>Gross Income</p>
                  <p className='revenue-price'>$90,000</p>
                </div>
                <div className='col-md-6'>
                  <p>Net Income</p>
                  <p className='revenue-price'>$74,000</p>
                </div>
              </div>
              <div className='row col-md-12 mt-2'>
                <div className='col-md-6'>
                  <p>Total Tax</p>
                  <p className='revenue-price'>{getTotalTaxes()}</p>
                </div>
                <div className='col-md-6'>
                  <p>Total Cash Back</p>
                  <p className='revenue-price'>$7,000</p>
                </div>
              </div>
              <div className='row col-md-12'>
                <Button onClick={toggleModal} color='link'>
                  Track Taxes per State
                </Button>
              </div>
              <div className='row col-md-12 mt-5'>
                <div className='col-md-12'>
                  <h4>Update Taxable State</h4>
                  <p className='subtitle'>Select the US states they are to collect taxes for.</p>
                </div>
              </div>
              <div className='col-md-12'>
                <div
                  className='TableTransaction-acc m-2'
                  style={{ maxHeight: 200, width: 'auto', overflowY: 'scroll' }}
                >
                  <ListGroup className='pl-2 pr-2 pt-2 borderless' style={{ border: 'none' }}>
                    {states.map((state, index) => {
                      return (
                        <ListGroupItem style={{ border: 'none', paddingBottom: 0 }} key={index}>
                          {' '}
                          <Label className='ml-2' style={{ border: 'none' }} check>
                            <Input
                              type='checkbox'
                              onChange={() => handleSelectState(index)}
                              checked={
                                state['isChecked'] !== undefined ? state['isChecked'] : false
                              }
                            />{' '}
                            {state.label}
                          </Label>
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                </div>
              </div>
              <div className='row col-md-12 mt-4 mb-4'>
                <div className='col-md-6'>
                  <Button
                    className='bg-dark w-100'
                    onClick={handleSelectAll}
                    style={{ marginBottom: '10px' }}
                  >
                    {isSelectAll ? 'De-Select All' : 'Select All'}
                  </Button>
                </div>
                <div className='col-md-6'>
                  <Button className='bg-dark w-100' onClick={() => handleSubmitState()}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantTransactions;
