import { handleActions } from 'redux-actions';
import { DEVICE_INFO_UPDATED } from '../actions';

export default handleActions(
  {
    [DEVICE_INFO_UPDATED]: (state, action) => ({ ...state, ...action.payload })
  },
  {
    deviceId: null,
    model: null,
    brand: null,
    appVersion: null,
    systemVersion: null,
    system: null,
  }
);
