import { fromMoney, InventoryOrder, InventoryOrderStatus } from '@boom-platform/globals';
import moment from 'moment';
import React, { FC, ReactElement } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../redux/actions';
import { requestInventoryOrderCancel } from '../../../redux/actions/order';
import { AppState } from '../../../redux/reducers';

type Props = {
  inventoryOrder: InventoryOrder;
  requestInventoryOrderCancel?: typeof requestInventoryOrderCancel;
};

export const OrderTableItem: FC<Props> = ({ inventoryOrder, requestInventoryOrderCancel }) => {
  const onCancelInventoryOrder = async (inventoryOrder) => {
    const result = await confirm({
      title: <p>Order Cancellation Confirmation</p>,
      message: (
        <>
          <p>This order will be cancelled</p>
          <p>Are you sure you want to cancel?</p>
        </>
      ),
      confirmText: 'Yes',
      confirmColor: 'btn text-danger',
      cancelColor: 'btn',
    });

    if (!result) return;

    requestInventoryOrderCancel?.(inventoryOrder);
    console.log(inventoryOrder);
  };

  return (
    <tr>
      <td>{inventoryOrder.store && inventoryOrder.store._id}</td>
      <td>
        <span className={`order-status__${inventoryOrder.status}`}>{inventoryOrder.status}</span>
      </td>

      <td>
        {inventoryOrder.createdAt && moment.unix(inventoryOrder.createdAt).format('MM/DD/YYYY')}
      </td>
      <td>
        {inventoryOrder.item && (
          <p>
            {inventoryOrder.item.itemType} - {inventoryOrder.item.itemName}
          </p>
        )}
      </td>
      <td>{fromMoney(inventoryOrder.amount)}</td>

      <td>
        {inventoryOrder.status === InventoryOrderStatus.PENDING && (
          <Button
            className='d-flex align-items-center justify-content-center'
            color='danger'
            size='sm'
            onClick={async (event) => {
              event.preventDefault();
              await onCancelInventoryOrder(inventoryOrder);
            }}
          >
            Cancel Order
          </Button>
        )}
      </td>
    </tr>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderTableItem);
