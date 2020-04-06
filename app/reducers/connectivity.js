import {handleActions} from 'redux-actions';
import {CONNECTION_CHANGED, CONNECTIONINFO_UPDATED} from '../actions'

const defaultState = {
  type: null,
  effectiveType: null,
  connected: true
}

export default handleActions(
  {
    [CONNECTIONINFO_UPDATED]: (state, action) => ({
      ...state,
      type: action.payload.type,
      effectiveType: action.payload.effectiveType
    }),
    [CONNECTION_CHANGED]: (state,action) => ({
      ...state,
      connected: action.payload.isConnected
    })
  },
  defaultState
);
