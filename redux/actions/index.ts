import * as accountMember from './account-member';
import * as accountMerchant from './account-merchant';
import * as app from './app';
import * as auth from './auth';
import * as errors from './errors';
import * as funds from './funds';
import * as image from './image';
import * as inventory from './inventory';
import * as order from './order';
import * as products from './products';
import * as search from './search';
import * as settings from './settings';
import * as shipping from './shipping';
import * as stores from './stores';
import * as transactions from './transactions';

const actionCreators = Object.assign(
  {},
  errors,
  app,
  stores,
  auth,
  accountMember,
  accountMerchant,
  search,
  transactions,
  image,
  settings,
  funds,
  products,
  inventory,
  order,
  shipping
);

export default actionCreators;
