import { takeLatest, select } from 'redux-saga/effects';
import StorageService from '../services/storageService';
import Analytics from '../services/AnalyticsService';

function* updateSettings() {
  let settings = yield StorageService.getData('settings');
  let state = yield select();
  let newSettings = {
    ...settings,
    ...state.Main.appData.settings
  };
  yield StorageService.setData('settings', newSettings);
}

function* trackUpdate() {
  let state = yield select();
  yield Analytics.trackEvent('SETTINGS_AUTOSHOW_UPDATED', {value: state.Main.appData.settings.autoShowSettingsOnLoad ? 'ON' : 'OFF'})
}

function* plantUpdated({payload}) {
  try {
    Analytics.setPlant(payload.plant.Id || '');
  } catch (err) {
    console.log('Failed to set plant for analytics tracking:', err.message)
  }
}

export default [
  takeLatest('SETTINGS/TOGGLE_AUTO_SHOW_SETTINGS_ON_LAUNCH', updateSettings),
  takeLatest('SETTINGS/TOGGLE_AUTO_SHOW_SETTINGS_ON_LAUNCH', trackUpdate),
  takeLatest('SETTINGS/SET_PLANT', plantUpdated)
];
