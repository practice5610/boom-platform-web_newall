import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { accountMember, accountMerchant, app, auth, errors, publicData } from './app';
import { funds } from './funds';
import { inventory } from './inventory';
import { offers } from './offers';
import { order } from './order';
import { products } from './products';
import { settings } from './settings';
import { shipping } from './shipping';
import { storesConfig } from './stores';
import { tax } from './tax';
import { transactions } from './transactions';

const rootReducer = combineReducers({
  errors,
  app,
  auth,
  accountMember,
  accountMerchant,
  storesConfig,
  form: formReducer, // TODO: remove this once Redux-forms is removed
  publicData,
  transactions,
  offers,
  settings,
  funds,
  products,
  tax,
  inventory,
  order,
  shipping,
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
