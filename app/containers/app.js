import React, { Component } from 'react';
import GlobalFont from 'react-native-global-font';
import { Alert, StatusBar, Platform, Linking } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import RNRestart from 'react-native-restart';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import AppNavigator from './navigation';
import store from '../store';
import DeviceInfo from 'react-native-device-info';
import NavigationService from '../services/NavigationService';
import AttachmentService from '../services/AttachmentService';

import { DEVICE_INFO_UPDATED, CONNECTIONINFO_UPDATED, CONNECTION_CHANGED } from './../actions';

import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import AnalyticsService from '../services/AnalyticsService';

setJSExceptionHandler((e, isFatal) => {

  AnalyticsService.trackEvent('JS_ERROR', {
    message: e,
    isFatal: isFatal
  });

  console.log('Error: ', e);
  console.log('Fatal: ', isFatal);
  if (isFatal) {
    const error = e;
    let msg = "The maintenance team is notified and we will need to restart the app";
    let title = `Oh no! An ${isFatal ? 'fatal error' : 'error'} occurred`;

    Alert.alert(title,msg,
      [
        {
          text: 'Restart',
          onPress: () => {
            RNRestart.Restart();
          }
        }
      ]
    );
  }
}, false);

setNativeExceptionHandler(errorString => {
  console.log('Native error: ', errorString);
  AnalyticsService.trackEvent("NATIVE_ERROR", {message: errorString});
});

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

const _store = store();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.netInfoUnsubscriber = null;
    this.store = _store;
    this.handleConnectivityChange = this.handleConnectivityChange.bind(this);
    this.updateDeviceInformation = this.updateDeviceInformation.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#fff');
    }
    StatusBar.setBarStyle('dark-content');
    AttachmentService.listAllFiles();

    netInfoUnsubscriber = NetInfo.addEventListener(this.handleConnectionChanged);

    const fontName = 'Equinor-Regular';
    GlobalFont.applyGlobal(fontName);
    this.updateDeviceInformation();
    SplashScreen.hide();

  }

  updateDeviceInformation() {
    this.store.dispatch(
      DEVICE_INFO_UPDATED({
        deviceId: DeviceInfo.getUniqueID(),
        model: DeviceInfo.getModel(),
        brand: DeviceInfo.getBrand(),
        appVersion: DeviceInfo.getVersion(),
        systemVersion: DeviceInfo.getSystemVersion(),
        system: DeviceInfo.getSystemName()
      })
    );
  }

  handleConnectionChanged = (state) => {
    let data = {
      connectionType: state.type,
      cellularNetwork: "none"
    }
    if (state.type === "cellular" && state.details) {
      data.cellularNetwork = state.details.cellularGeneration;
    }
    AnalyticsService.trackEvent('NETINFO_CONNECTION_CHANGED', data);
    this.store.dispatch(CONNECTIONINFO_UPDATED({
      ...data
    }));
  }

  handleConnectivityChange(data) {
    AnalyticsService.trackEvent('NETINFO_CONNECTIVITY_CHANGE', {isOnline: data});
    this.store.dispatch(CONNECTION_CHANGED({
      isConnected: data
    }));
  }

  componentWillUnmount() {
    this.netInfoUnsubscriber && this.netInfoUnsubscriber();
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppNavigator
          ref={navref => NavigationService.setTopLevelNavigator(navref)}
          style={{ backgroundColor: '#FFF' }}
          onNavigationStateChange={(prevState, currentState, action) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);
      
            if (prevScreen !== currentScreen) {
              AnalyticsService.trackEvent("SCREEN_CHANGED", { currentScreen, prevScreen});
            }
          }}
        />
      </Provider>
    );
  }
}
