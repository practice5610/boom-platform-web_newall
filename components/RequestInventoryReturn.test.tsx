import 'jest';

import {
  AllOptionalExceptFor,
  BoomUser,
  InventoryItem,
  InventoryOrder,
  InventoryOrderStatus,
  InventoryOrderType,
  Store,
} from '@boom-platform/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getInventoryItem, getStoreData, getUserData } from '../__helpers__/data';
import { RequestInventoryReturn } from './RequestInventoryReturn';

/**
 *  I thought it would be more readable if I made all the redux props look like the actual state.
 *  I tried to set it up so that it is empty for each test and the test has to fill it with data
 */
interface State {
  auth: {
    user: AllOptionalExceptFor<BoomUser, 'uid'> | undefined;
  };
  accountMerchant: { inventory: InventoryItem[] | undefined; store: Store | undefined };
}
let state: State;
let requestInventory;
let requestInventoryOrders;
let requestStore;

const setState = () => {
  state = {
    auth: {
      user: undefined,
    },
    accountMerchant: {
      inventory: undefined,
      store: undefined,
    },
  };
  state.accountMerchant.inventory = [];
  state.accountMerchant.inventory.push(getInventoryItem());
  state.accountMerchant.inventory.push(getInventoryItem());
  state.accountMerchant.inventory.push(getInventoryItem());
  state.auth.user = getUserData();
  state.accountMerchant.store = getStoreData();
};

const givenRequestInventory = () => {
  requestInventory = jest.fn();
};
const givenRequestInventoryOrders = () => {
  requestInventoryOrders = jest.fn();
};
const givenRequestStore = () => {
  requestStore = jest.fn();
};

beforeEach(setState);
beforeEach(givenRequestInventory);
beforeEach(givenRequestInventoryOrders);
beforeEach(givenRequestStore);

describe('RequestInventoryReturn (unit)', () => {
  it('The modal renders the inventory items', async () => {
    let isModalOpen = true;
    const toggleModal = () => {
      isModalOpen = !isModalOpen;
    };

    const result = render(
      <RequestInventoryReturn
        inventory={state.accountMerchant.inventory}
        toggleModal={toggleModal}
        isReturnModalOpen={isModalOpen}
        store={state.accountMerchant.store}
        user={state.auth.user}
        requestInventory={requestInventory}
        requestInventoryOrders={requestInventoryOrders}
        requestStore={requestStore}
      />
    );

    // All three nicknames are nickname_test so if this appears 3 times, items are rendering
    const items = await screen.findAllByText('nickname_test');

    expect(items).toHaveLength(3);
  });

  it('Modal closes on Cancel', async () => {
    let isModalOpen = true;
    const toggleModal = () => {
      isModalOpen = !isModalOpen;
    };

    const result = render(
      <RequestInventoryReturn
        inventory={state.accountMerchant.inventory}
        toggleModal={toggleModal}
        isReturnModalOpen={isModalOpen}
        store={state.accountMerchant.store}
        user={state.auth.user}
        requestInventory={requestInventory}
        requestInventoryOrders={requestInventoryOrders}
        requestStore={requestStore}
      />
    );

    const button = await screen.getByText('Cancel');
    userEvent.click(button);

    expect(isModalOpen).toBe(false);
  });

  it('New order is created on submit', async () => {
    let isModalOpen = true;
    const toggleModal = () => {
      isModalOpen = !isModalOpen;
    };

    const finalOrder = {
      item: state.accountMerchant.inventory![0],
      status: InventoryOrderStatus.PENDING,
      orderType: InventoryOrderType.RETURN_DEFECTIVE,
      merchant: state.auth.user,
      store: state.accountMerchant.store,
    } as InventoryOrder;

    const result = render(
      <RequestInventoryReturn
        inventory={state.accountMerchant.inventory}
        toggleModal={toggleModal}
        isReturnModalOpen={isModalOpen}
        store={state.accountMerchant.store}
        user={state.auth.user}
        requestInventory={requestInventory}
        requestInventoryOrders={requestInventoryOrders}
        requestStore={requestStore}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');

    userEvent.click(checkboxes[0]);

    const dropdown = screen.getByText('Return a defective item');

    userEvent.click(dropdown);

    const submit = screen.getByText('Submit');

    userEvent.click(submit);

    expect(requestInventoryOrders.mock.calls[0][0][0]).toMatchObject({
      ...finalOrder,
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    });
  });
});
