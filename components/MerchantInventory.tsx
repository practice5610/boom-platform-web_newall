import {
  AllOptionalExceptFor,
  BoomUser,
  BoomUserBasic,
  fromMoney,
  InventoryItem,
  InventoryItemType,
  InventoryOrder,
  InventoryOrderType,
  Money,
  Store,
  toMoney,
} from '@boom-platform/globals';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Container, Input, Row } from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { bindActionCreators } from 'redux';

import actionCreators from '../redux/actions';
import { requestInventoryOrders } from '../redux/actions/order';

interface Props {
  user?: AllOptionalExceptFor<BoomUser, 'uid'>;
  store?: Store;
  inventoryItemTypes: InventoryItemType[];
  requestInventoryOrders?: typeof requestInventoryOrders;
}

const MerchantInventory: FC<Props> = ({
  user,
  store,
  inventoryItemTypes,
  requestInventoryOrders,
}) => {
  const [quantities, setQuantities] = useState<object>({});

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const init = React.useCallback(() => {
    const objQuantities = {};
    Object.keys(inventoryItemTypes).map((key) => (objQuantities[key] = 0));
    setQuantities(objQuantities);
    setTotalPrice(0);
  }, [inventoryItemTypes]);

  useEffect(() => {
    init();
  }, [inventoryItemTypes, init]);

  const renderInventoryOrderItem = (key) => {
    const quantity = quantities[key];
    if (quantity === undefined) {
      return null;
    }
    const inventoryItemType = inventoryItemTypes[key];
    const { purchasePrice } = inventoryItemType;

    return (
      <Container key={key} fluid>
        <Row className='mt-3'>
          <Col xs='4' className='d-flex align-items-center'>
            <span>{inventoryItemType.label}</span>
          </Col>
          <Col xs='3' className='d-flex align-items-center'>
            <span>{fromMoney(purchasePrice)}</span>
          </Col>
          <Col xs='3' className='d-flex align-items-center'>
            <Input
              type='number'
              value={quantity}
              onChange={(event) => {
                const newQuantity: number = parseInt(event.target.value);
                if (!(newQuantity >= 0)) {
                  return;
                }

                const tp =
                  totalPrice +
                  (purchasePrice.amount / Math.pow(10, purchasePrice.precision)) *
                    (newQuantity - quantity);

                quantities[key] = newQuantity;
                setQuantities(quantities);
                setTotalPrice(tp);
              }}
            />
          </Col>
          <Col className='d-flex align-items-center'>
            <span>
              {fromMoney({
                ...purchasePrice,
                amount: purchasePrice.amount * quantity,
              } as Money)}
            </span>
          </Col>
        </Row>
      </Container>
    );
  };

  const onSendInventoryOffer = async () => {
    const result = await confirm({
      title: <p>Order Inventories Confirmation</p>,
      message: (
        <>
          <p>These inventories will be ordered</p>
          <p>Are you sure you want to continue?</p>
        </>
      ),
      confirmText: 'Order',
      confirmColor: 'btn text-success',
      cancelColor: 'btn text-danger',
    });

    if (!result) return;

    const inventoryOrders: InventoryOrder[] = [];

    Object.keys(inventoryItemTypes).map((key) => {
      const inventoryItemType = inventoryItemTypes[key];
      let quantity: number = quantities[key];

      while (quantity-- > 0) {
        const inventoryItem: InventoryItem = {
          itemType: inventoryItemType.label,
          itemName: inventoryItemType.name,
        } as InventoryItem;

        const inventoryOrder: InventoryOrder = {
          item: inventoryItem,
          orderType: InventoryOrderType.PURCHASE,
          amount: inventoryItemType.purchasePrice,
          merchant: _.pick(user, 'uid', 'firstName', 'lastName', 'contact') as AllOptionalExceptFor<
            BoomUserBasic,
            'uid' | 'firstName' | 'lastName' | 'contact'
          >,
          store: _.pick(
            store,
            '_id',
            'companyName',
            'number',
            'street1', // TODO: Review if we need to add street2
            'phoneNumber',
            'city',
            'state',
            'zip'
          ),
        } as InventoryOrder;

        inventoryOrders.push(inventoryOrder);
      }
    });

    requestInventoryOrders?.(inventoryOrders);
  };

  return (
    <>
      <div className='bar-grey pl-1'>
        <div className='table-header d-flex align-items-center'>
          <Container fluid>
            <Row>
              <Col xs='4' className='d-flex align-items-center'>
                <h2>Equipment</h2>
              </Col>
              <Col xs='3' className='d-flex align-items-center'>
                <h2>Unit Price</h2>
              </Col>
              <Col xs='3' className='d-flex align-items-center'>
                <h2>Quantity</h2>
              </Col>
              <Col className='d-flex align-items-center'>
                <h2>Total</h2>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <div className='equipment-inventory pl-1 pb-5'>
        {Object.keys(inventoryItemTypes).map((key) => renderInventoryOrderItem(key))}
      </div>

      <div className='bar-red pl-1'>
        <div className='send-header py-3'>
          <Container fluid>
            <Row>
              <Col xs='10'>
                <h2>Total</h2>
              </Col>
              <Col xs='2' className='pl-2'>
                <h2>{fromMoney(toMoney(totalPrice))}</h2>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <div className='send-order-inventory pl-1 pb-5 pt-5'>
        <Container fluid>
          <Row className='mt-3'>
            <Col xs='6'>
              <Button
                className='d-flex align-items-center justify-content-center'
                style={{
                  backgroundColor: '#D42C29',
                  fontSize: 24,
                  width: 346,
                  height: 37,
                  borderWidth: 0,
                  borderRadius: 'unset',
                }}
                color='danger'
                size='lg'
                disabled={!totalPrice}
                onClick={async (event) => {
                  event.preventDefault();
                  await onSendInventoryOffer();
                }}
              >
                Send Inventory Offer
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(null, mapDispatchToProps)(MerchantInventory);
