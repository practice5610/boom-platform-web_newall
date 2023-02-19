import {
  AllOptionalExceptFor,
  BoomUser,
  BoomUserBasic,
  ContactInfo,
  InventoryItem,
  Money,
  Store,
} from '@boom-platform/globals';
import { nanoid } from 'nanoid';

export function getInventoryItem(data?: Partial<InventoryItem>): InventoryItem {
  return {
    _id: nanoid(),
    createdAt: 1596828669,
    updatedAt: 1601403280,
    friendlyID: 'd3sOLt6LKS',
    itemID: '123',
    itemType: 'ItemType',
    itemName: 'ItemName',
    nickname: 'nickname_test',
    merchant: { uid: nanoid() } as AllOptionalExceptFor<BoomUserBasic, 'uid'>,
    store: {} as Store,
    status: 'Active',
    purchasePrice: { amount: 20000, precision: 2, currency: 'USD', symbol: '$' } as Money,
    inactiveReason: undefined,
    ...data,
  } as InventoryItem;
}

export function getUserData(data?: BoomUser): AllOptionalExceptFor<BoomUser, 'uid'> {
  return {
    uid: nanoid(),
    firstName: 'FirstName',
    lastName: 'LastName',
    contact: {
      emails: ['test@email.com'],
      phoneNumber: '650 555 1234',
    } as ContactInfo,
    ...data,
  } as AllOptionalExceptFor<BoomUser, 'uid'>;
}

export function getStoreData(data?: Partial<Store>): Store {
  return {
    _id: nanoid(),
    createdAt: 100,
    updatedAt: 200,
    companyName: 'Company Name LLC',
    emails: ['email@website.com'],
    phoneNumber: '123 456 7890',
    number: '123',
    street1: 'test road', //TODO: Review if we need to add street2
    city: 'city',
    state: 'state',
    country: 'US',
    zip: '12345',
    ...data,
  } as Store;
}
