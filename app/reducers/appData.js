// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
  plant: null,
  project: null,
  isOnboarding: false,
  settings: {
    autoShowSettingsOnLoad: true
  }
};

export default handleActions(
  {
    [actions.setPlant]: (state, action) => ({
      ...state,
      plant: action.payload.plant
    }),
    [actions.setProject]: (state, action) => ({
      ...state,
      project: action.payload.project
    }),
    [actions.startOnboarding]: state => ({
      ...state,
      isOnboarding: true
    }),
    [actions.endOnboarding]: state => ({
      ...state,
      isOnboarding: false
    }),
    [actions.toggleAutoShowSettingsOnLaunch]: state => ({
      ...state,
      settings: {
        ...state.settings,
        autoShowSettingsOnLoad: !state.settings.autoShowSettingsOnLoad
      }
    }),
    [actions.loadSettings]: (state, action) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    }
    // [actions.loadSettings]: (state, action) => ({
    //   ...state,
    //   settings: {
    //     ...state.settings,
    //     ...action.payload
    //   }
    // })
  },
  defaultState
);
