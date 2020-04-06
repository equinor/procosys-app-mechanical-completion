import { createAction } from 'redux-actions';

/**
 * INIT
 */

export const DEVICE_INFO_UPDATED = createAction(
  'INIT/DEVICE_INFO_UPDATED',
  deviceInfo => deviceInfo
);

export const CONNECTIONINFO_UPDATED = createAction(
  'CONNECTION/UPDATED',
  data => ({
    type: data.type,
    effectiveType: data.effectiveType
  })
);

export const CONNECTION_CHANGED = createAction(
  'CONNECTION/CHANGED',
  data => ({
    isConnected: data.isConnected
  })
);

/**
 * Auth
 */
export const USER_UPDATED = createAction('Auth/USER_UPDATED', userinfo => userinfo);
export const ACCESS_TOKEN_RECEIVED = createAction('Auth/ACCESS_TOKEN_RECEIVED', token => token);
export const USER_LOGGED_IN = createAction('Auth/USER_LOGGED_IN');
export const USER_LOGGED_OUT = createAction('Auth/USER_LOGGED_OUT');
export const USER_EXPIRED = createAction('Auth/USER_EXPIRED');
export const USER_WILL_EXPIRE = createAction('Auth/USER_WILL_EXPIRE');

/**
 * Onboarding
 */

export const setProject = createAction('SETTINGS/SET_PROJECT', project => ({
  project
}));
export const setPlant = createAction('SETTINGS/SET_PLANT', plant => ({
  plant
}));
export const startOnboarding = createAction('ONBOARDING/START');
export const endOnboarding = createAction('ONBOARDING/FINISHED');

export const toggleAutoShowSettingsOnLaunch = createAction(
  'SETTINGS/TOGGLE_AUTO_SHOW_SETTINGS_ON_LAUNCH'
);
export const loadSettings = createAction('SETTINGS/LOAD', settings => ({
  ...settings
}));

export const setChecklistInfo = createAction('MCCR/SET_CHECKLISTINFO', data => ({...data}))
export const unsetChecklistInfo = createAction('MCCR/UNSET_CHECKLISTINFO')

export default {
  startOnboarding,
  endOnboarding,
  setProject,
  setPlant,
  toggleAutoShowSettingsOnLaunch,
  loadSettings,
  setChecklistInfo,
  unsetChecklistInfo,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  ACCESS_TOKEN_RECEIVED,
  USER_UPDATED,
  USER_EXPIRED,
  USER_WILL_EXPIRE
};
