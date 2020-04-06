import { all } from 'redux-saga/effects';
import authSagas from './authSagas';
import apiSagas from './apiSagas';
import settingsSagas from './settingsSagas';

export default function* rootSaga() {
  yield all([...authSagas, ...apiSagas, ...settingsSagas]);
}
