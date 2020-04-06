import { handleActions } from 'redux-actions';

import * as actions from '../actions';

const defaultState = {
  loggedIn: false,
  name: ''
};

export default handleActions(
  {
    [actions.USER_UPDATED]: (state, action) => ({
      ...state,
      name: (action.payload && action.payload.name) || ''
    }),
    [actions.USER_LOGGED_IN]: (state, action) => ({
      ...state,
      loggedIn: true
    }),
    [actions.USER_LOGGED_OUT]: (state, action) => ({
      ...state,
      loggedIn: false
    })
  },
  defaultState
);
