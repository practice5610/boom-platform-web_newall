import { all } from 'redux-saga/effects';

import accountMember from './account-member';
import accountMerchant from './account-merchant';
import app from './app';
import auth from './auth';
import funds from './funds';
import image from './image';
import inventory from './inventory';
import offers from './offers';
import order from './order';
import products from './products';
import search from './search';
import settings from './settings';
import stores from './stores';
import transactions from './transactions';

export default function* root() {
  yield all([
    auth(),
    app(),
    accountMember(),
    accountMerchant(),
    search(),
    transactions(),
    offers(),
    stores(),
    image(),
    offers(),
    settings(),
    funds(),
    products(),
    inventory(),
    order(),
  ]);
}
