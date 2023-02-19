import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';

import rootReducers from './reducers';
import rootSagas from './sagas';

export function initializeStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();

  let store = createStore(
    rootReducers,
    initialState,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );

  /**
   * next-redux-saga depends on `sagaTask` being attached to the store.
   * It is used to await the rootSaga task before sending results to the client.
   */

  store.sagaTask = sagaMiddleware.run(rootSagas);

  return store;
}
