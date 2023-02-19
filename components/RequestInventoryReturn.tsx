import {
  AllOptionalExceptFor,
  BoomUser,
  BoomUserBasic,
  getComposedAddressFromStore,
  InventoryItem,
  InventoryItemStatus,
  InventoryOrder,
  InventoryOrderBillingType,
  InventoryOrderStatus,
  InventoryOrderType,
  Store,
  StoreBasic,
} from '@boom-platform/globals';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  UncontrolledDropdown,
} from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../redux/actions';
import { requestInventory } from '../redux/actions/account-merchant';
import { requestStore } from '../redux/actions/account-merchant';
import { requestInventoryOrders } from '../redux/actions/order';
import { AppState } from '../redux/reducers';
interface Props {
  requestInventory?: typeof requestInventory;
  requestInventoryOrders?: typeof requestInventoryOrders;
  requestStore?: typeof requestStore;
  inventory?: InventoryItem[];
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  store?: Store;
  toggleModal;
  isReturnModalOpen;
}

enum OrderTypeDescription {
  DEFAULT = 'I would like to...',
  CANCEL = 'Cancel the order',
  RETURN_OTHER = 'Return an item (not defective)',
  RETURN_DEFECTIVE = 'Return a defective item',
}

export const RequestInventoryReturn: FunctionComponent<Props> = ({
  requestInventory,
  requestInventoryOrders,
  requestStore,
  inventory,
  store,
  user,
  toggleModal,
  isReturnModalOpen,
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [returnReason, setReturnReason] = useState<OrderTypeDescription>(
    OrderTypeDescription.DEFAULT
  );
  const [newOrderType, setNewOrderType] = useState<InventoryOrderType>();

  useEffect(() => {
    requestInventory?.();
    requestStore?.();
  }, []);

  // useEffect(() => {
  //   if (inventory === null) return;
  //   setPagesCount(Math.ceil(inventory!.length / pageSize));
  // }, [inventory]);

  const closeModal = () => {
    setSelectedItem(undefined);
    setNewOrderType(undefined);
    setReturnReason(OrderTypeDescription.DEFAULT);
    setErrorMessage('');
    toggleModal();
  };

  const canSubmit = (): boolean => {
    if (!selectedItem || !newOrderType) {
      return false;
    }
    if (
      selectedItem.status === InventoryItemStatus.ACTIVE &&
      newOrderType === InventoryOrderType.CANCEL
    ) {
      return false;
    }
    return true;
  };

  const submitRequest = async () => {
    setErrorMessage('');
    if (!user || !store || !selectedItem) {
      setErrorMessage('There was an error, try again later');
      return;
    }

    const basicStore: StoreBasic = {
      _id: store._id,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      companyName: store.companyName,
      emails: store.emails,
      phoneNumber: store.phoneNumber,
      number: store.number, // TODO: Review if we need to add street2
      street1: store.street1,
      street2: store.street2,
      city: store.city,
      state: store.state,
      zip: store.zip,
      country: store.country,
    } as StoreBasic;

    const merchant: AllOptionalExceptFor<
      BoomUserBasic,
      'uid' | 'firstName' | 'lastName' | 'contact'
    > = {
      uid: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      contact: user.contact,
    } as AllOptionalExceptFor<BoomUserBasic, 'uid' | 'firstName' | 'lastName' | 'contact'>;

    const order: InventoryOrder = {
      createdAt: moment().utc().unix(),
      updatedAt: moment().utc().unix(),
      item: selectedItem,
      status: InventoryOrderStatus.PENDING,
      billingType: InventoryOrderBillingType.ONE_TIME,
      orderType: newOrderType,
      merchant: merchant,
      store: basicStore,
    } as InventoryOrder;
    requestInventoryOrders?.([order]);
    closeModal();
  };

  return (
    <Modal isOpen={isReturnModalOpen} toggle={closeModal} onOpened={requestInventory} size='lg'>
      <ModalHeader toggle={closeModal}>
        Request Inventory Order Cancellation or Item Return
      </ModalHeader>
      <ModalBody>
        <div>Select from your items below:</div>
        <div style={{ height: 400, overflow: 'auto' }}>
          <Table>
            <thead>
              <tr>
                <th>{` `}</th>
                <th>{`Item Name`}</th>
                <th>{`Nickname`}</th>
                <th>{`Store`}</th>
                <th>{`Status`}</th>
              </tr>
            </thead>
            <tbody>
              {inventory ? (
                inventory.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td>
                        <input // When I tried to use a reactstrap Input it would not scroll with its row
                          type='checkbox'
                          checked={selectedItem ? item._id === selectedItem._id : false}
                          onChange={() => {
                            if (selectedItem ? item._id === selectedItem._id : false)
                              setSelectedItem(undefined);
                            else setSelectedItem(item);
                          }}
                        />
                      </td>
                      <td>{item.itemName}</td>
                      <td>{item.nickname}</td>
                      <td>
                        {
                          item.store && getComposedAddressFromStore(item.store) // TODO: Check if this is correct
                        }
                      </td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              ) : (
                <tr></tr>
              )}
            </tbody>
          </Table>
        </div>
        <div>
          <Row style={{ justifyContent: 'right', paddingTop: 20 }}>
            <Col>
              <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle caret>{`${returnReason}`}</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        setReturnReason(OrderTypeDescription.RETURN_DEFECTIVE);
                        setNewOrderType(InventoryOrderType.RETURN_DEFECTIVE);
                      }}
                    >
                      {OrderTypeDescription.RETURN_DEFECTIVE}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setReturnReason(OrderTypeDescription.RETURN_OTHER);
                        setNewOrderType(InventoryOrderType.RETURN_OTHER);
                      }}
                    >
                      {OrderTypeDescription.RETURN_OTHER}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setReturnReason(OrderTypeDescription.CANCEL);
                        setNewOrderType(InventoryOrderType.CANCEL);
                      }}
                    >
                      {OrderTypeDescription.CANCEL}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </FormGroup>
            </Col>
            <Col>{errorMessage}</Col>
          </Row>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={submitRequest} disabled={!canSubmit()}>
          Submit
        </Button>{' '}
        <Button color='secondary' onClick={closeModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state: AppState) => ({
  inventory: state.accountMerchant.inventory,
  store: state.accountMerchant.store,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RequestInventoryReturn);
