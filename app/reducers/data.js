// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
  checklistInfo: null
};

export default handleActions(
  {
    [actions.setChecklistInfo]: (state, action) => ({
      ...state,
      checklistInfo: action.payload
    }),
    [actions.unsetChecklistInfo]: (state, action) => ({
      ...state,
      checklistInfo: null
    })
  },
  defaultState
);
