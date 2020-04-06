import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from '../reducers';

import createSagaMiddleware from 'redux-saga';
import sagas from '../sagas';

//import { postToLog } from '../services/api';

let _store = null;
export default function store() {
  if (!_store) {
    const sagaMiddleware = createSagaMiddleware();

    const rootReducer = combineReducers(reducer);

    const logger = _store => next => action => {
      //postToLog({ dispatching: action.type }, action.type);
      const result = next(action);
      return result;
    };

    _store = createStore(
      rootReducer,
      composeWithDevTools(
        applyMiddleware(...[sagaMiddleware, logger])
      )
    );
    sagaMiddleware.run(sagas);
    _store.dispatch({ type: '@STORE_INIT' });
  }
  return _store;
}
