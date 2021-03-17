import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Image, SafeAreaView, TouchableOpacity, AppState } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {ReactNativeAD, ADLoginView} from 'react-native-azure-ad';
import {
  AzureADClientId,
  AzureADRedirectUrl,
  BuildNumber,
  ApiResourceIdentifier,
  AzureADTenantId
} from '../settings';

import { connect } from 'react-redux';

var logo = require('./mc_app_ikon_transparent.png');
var statoilLogo = require('./Equinor_logo.png');
import { ACCESS_TOKEN_RECEIVED } from '../actions';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column'
  },
  splashTop: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  splashBottom: {
    flex: 3,
    backgroundColor: '#FFECF0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashAppLogo: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashAction: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  version: {
    position: 'absolute',
    zIndex: 10000,
    bottom: 0,
    right: 0,
    marginRight: 10,
    backgroundColor: 'transparent',
    fontSize: 10
  },
  loginButton: {
    padding: 10,
    backgroundColor: '#FF1243',
    paddingHorizontal: 30
  }
});

const loginButtonText = 'Login';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewLogin: false,
      isValidating: false,
      appState: AppState.currentState
    };

    const ctxConfig = {
      client_id: AzureADClientId,
      redirectUrl: AzureADRedirectUrl,
      tenant: AzureADTenantId,
      resources: [
        ApiResourceIdentifier,
      ]
    }

    this.adContext = new ReactNativeAD(ctxConfig);
  }

  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
    appVersion: PropTypes.string,
  };

  componentDidUpdate() {
    if (this.state.isValidating===false && this.props.user.loggedIn) {
      this.props.navigation.navigate('IntegrityCheck');
      return;
    }
  }

  validateLogin = async () => {
    console.log('Validate login');
    if (this.state.isValidating) {
      return;
    }
    try {
      this.setState({
        isValidating: true
      });
      let access_token = await ReactNativeAD.getContext(AzureADClientId).assureToken(ApiResourceIdentifier);
      if (access_token) {
        console.log('User is logged in: ', access_token);
        this.props.loginUser(access_token);
      }
    } catch (err) {
      console.log('Failed to get user session: ', err);
    } finally {
      this.setState({
        isValidating: false
      });
    }
    
  }

  onLoginButtonClick = () => {
    this.setState({
      viewLogin: true
    })
  }

  onCloseWebviewClick = () => {
    this.setState({viewLogin: false});
  }

  onAdLoginSuccess = (creds) => {
    console.log('Ad Login successfull: ', creds)
    this.setState({
      viewLogin: false
    });
    this.validateLogin();
  }

  renderLogin = () => {

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ADLoginView onSuccess={this.onAdLoginSuccess.bind(this)} context={ReactNativeAD.getContext(AzureADClientId)} />
        </View>
        <TouchableOpacity onPress={this.onCloseWebviewClick}>
          <View style={{justifyContent: 'center', alignItems: 'center', minHeight: 60}}>
            <Text style={[{color: '#FFF'}, styles.loginButton]}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
      );
  }

  render() {

    if (this.state.viewLogin) {
      return this.renderLogin();
    }
    let splashAction = (
      <TouchableOpacity
        style={styles.loginButton}
        onPress={this.onLoginButtonClick}
        disabled={false /* !hasConnectivity*/}
      >
        <Text style={{color: '#FFF', fontWeight: '500'}}>{loginButtonText}</Text>
      </TouchableOpacity>
    );

    // if (this.props.OIDC.isLoadingUser) {
    //   splashAction = <Spinner />;
    // }

    return (
        <SafeAreaView style={styles.wrapper}>
        
          <View style={styles.splashTop}>
            <Image source={statoilLogo} />
          </View>
          <View style={styles.splashBottom}>
            <View style={styles.splashAppLogo}>
              <Image source={logo} style={{ height: 150 }} resizeMode="contain" />
              <View style={{flexDirection: DeviceInfo.isTablet() ? 'row' : 'column', marginTop: 20}}>
                <Text style={{ fontWeight: '400', color: 'rgb(134,0,29)', fontSize: 32 }}>
                  Mechanical 
                </Text>
                <Text style={{ fontWeight: '500', color: 'rgb(134,0,29)', fontSize: 32, marginLeft: DeviceInfo.isTablet() ? 20 : 0}}>
                  Completion
                </Text>
              </View>
            </View>
            <View style={styles.splashAction}>{splashAction}</View>
          </View>
          <View>
            <Text style={styles.version}>v. {this.props.appVersion} ({BuildNumber})</Text>
          </View>

        </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: (access_token) => dispatch(ACCESS_TOKEN_RECEIVED(access_token))
});

const mapStateToProps = state => ({
  appVersion: state.Main.deviceInfo.appVersion,
  user: state.Main.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
