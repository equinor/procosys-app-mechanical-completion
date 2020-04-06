import React, { Component } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../actions';
import { ApiVersion as ApplicationApiVersion, ApiResourceIdentifier } from '../settings';
import Analytics from '../services/AnalyticsService';
import Icon from 'react-native-vector-icons/Ionicons'

import storageService from '../services/storageService';
import ApiService from '../services/api';
import { ReactNativeAD, ADLoginView } from 'react-native-azure-ad';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Temporary screen showing a loading screen while verifying the data, and loading userdata.
 * Automatically redirects to onboarding or mainapplication depending on missing values.
 *
 * @class IntegrityCheckScreen
 * @extends {Component}
 */
class IntegrityCheckScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'Verifying data',
      fetchingPlant: true,
      fetchingProject: true,
      fetchingSettings: true,
      fetchingApiVersions: true,
      reduxStateValidated: false,
      AppApiValidated: false,
      supportsAppApi: false
    };
  }

  componentDidMount() {
    // Start setup
    this.validateData();
  }

  componentDidUpdate(prevProps) {
    // Make sure we set some tracking info for the user, in case of bugreports. 
    if (!this.state.reduxStateValidated) this.validateReduxState();
    this.navigateUserToOnboarding();
  }

  /**
   * Checks to see if data has been loaded into redux. 
   * 
   */
  validateReduxState = () => {
    if (
      this.props.appData.plant &&
      this.props.appData.project &&
      this.props.appData.settings.hasOwnProperty('autoShowSettingsOnLoad')
    ) {
      this.setState({ reduxStateValidated: true });
    }
  }

  /**
   * Handling new routing actions that should be performed as the user
   * goes trough onboarding and setup. 
   * Triggered on every component update for revalidation of state and properties. 
   */
  navigateUserToOnboarding = () => {
    if (
      this.state.fetchingApiVersions ||
      this.state.fetchingProject ||
      this.state.fetchingPlant ||
      this.state.fetchingSettings ||
      this.props.appData.isOnboarding
    ) {
      // Still loading data, wait
      return;
    } else if (
      !this.props.appData.isOnboarding &&
      this.state.reduxStateValidated
    ) {
      //User is done with onboarding, and redux is happy with the information it got
      this.props.navigation.navigate('MainRoute');
    } else if (!this.props.appData.isOnboarding) {
      // Go to onboarding
      this.props.startOnboarding();
      this.props.navigation.navigate('SelectPlant', {
        onFinish: this.onPlantSelected
      });
    }
  }

  /**
   * Triggered by SelectPlant screen during onboarding.
   */
  onPlantSelected = () => {
    this.props.navigation.navigate('SelectProject', {
      onFinish: this.onProjectSelected
    });
  }

  /**
   * Triggered on the last step on onboarding
   * sent as a parameter for `onPlantSelected`
   */
  onProjectSelected = () => {
    this.props.endOnboarding();
  }

  /**
   * Logout user
   */
  logout = () => {
    // TODO: Logout user from AD
    AsyncStorage.removeItem(ApiResourceIdentifier);
    this.props.logoutUser();
  }

  /**
   * Validate application data
   * 
   */
  validateData = async () => {
    //Validate API
    this.setState({status: "Validating API"});
    const supported = await this.checkIfApiVersionIsSupported();
    this.setState({
      AppApiValidated: true,
      supportsAppApi: supported,
      fetchingApiVersions: false
    })
    //Short circuit if future API calls will fail anyway. 
    if (!supported) { return; }

    //Plant
    this.setState({ status: 'Loading plant' });
    const plant = await storageService.getData('plant');
    plant != null && this.props.setPlant(plant);
    this.setState({ fetchingPlant: false });

    //Project
    this.setState({ status: 'Loading project' });
    const project = await storageService.getData('project');
    project != null && this.props.setProject(project);
    this.setState({ fetchingProject: false });

    //Settings
    this.setState({ status: 'Loading settings' });
    const settings = await storageService.getData('settings');
    this.props.loadSettings(settings);
    this.setState({ fetchingSettings: false, status: 'Finished loading settings' });
  }

  /**
   * Check if API version is supported by the application
   * 
   * @returns Promise<boolean>  Boolean indicating if API is supported or not
   */
  checkIfApiVersionIsSupported = async () => {
    this.setState({ status: 'Validating ProCoSys API' });
    let supported = true;
    try {
      const versions = await ApiService.getSupportedApiVersions();
      if (versions.indexOf(ApplicationApiVersion) == -1) {
        supported = false;
        Analytics.trackEvent('APPLAUNCH_API_VALIDATION_FAILED');
      }
    } catch (err) {
      supported = false;
      Analytics.trackEvent('APPLAUNCH_API_VALIDATION_ERROR');
    }

    return supported;
  }
  

  render() {
    // If API is not supported (Running old app)
    if (!this.state.supportsAppApi && this.state.AppApiValidated) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 20 }}>Unsupported version</Text>
          <Text style={{ padding: 20, textAlign: 'center' }}>
            You are running on a unsupported version of this application.
          </Text>
          <Text style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            Please update the app for continued use.
          </Text>
          <Text style={{ fontSize: 12 }}>
            Api: {ApplicationApiVersion} - App:{' '}
            {this.props.deviceInfo.appVersion}
          </Text>
          <Button title="Logout" onPress={this.logout} />
        </View>
      );
    }

    const {fetchingApiVersions, fetchingPlant, fetchingProject, fetchingSettings} = this.state;
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
            {(fetchingApiVersions) && (<ActivityIndicator />) || (<Icon name="ios-checkmark" size={20} />)}
            <Text style={{marginLeft: 10}}>Validate application version</Text>
          </View>
          <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
            {(fetchingPlant) && (<ActivityIndicator />) || (<Icon name="ios-checkmark" size={20} />)}
            <Text style={{marginLeft: 10}}>Loading plant information</Text>
          </View>
          <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
            {(fetchingProject) && (<ActivityIndicator />) || (<Icon name="ios-checkmark" size={20} />)}
            <Text style={{marginLeft: 10}}>Loading project information</Text>
          </View>
          <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
            {(fetchingSettings) && (<ActivityIndicator />) || (<Icon name="ios-checkmark" size={20} />)}
            <Text style={{marginLeft: 10}}>Loading personal settings</Text>
          </View>
        </View>
      </View>
    )

  }
}

mapDispatchToProps = dispatch => ({
  setPlant: plant => dispatch(actions.setPlant(plant || null)),
  setProject: project => dispatch(actions.setProject(project || null)),
  loadSettings: settings => dispatch(actions.loadSettings(settings || null)),
  startOnboarding: () => dispatch(actions.startOnboarding()),
  endOnboarding: () => dispatch(actions.endOnboarding()),
  logoutUser: () => dispatch(actions.USER_LOGGED_OUT())
});

mapStateToProps = reduxState => ({
  appData: reduxState.Main.appData,
  deviceInfo: reduxState.Main.deviceInfo
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntegrityCheckScreen);
