import { combineReducers } from 'redux';
import user from './user';
import deviceInfo from './deviceInfo';
import connectivity from './connectivity';
import appData from './appData';
import data from './data';

const mainReducers = combineReducers({
  user,
  deviceInfo,
  connectivity,
  appData,
});

export default {
  Main: mainReducers,
  Data: data
};
