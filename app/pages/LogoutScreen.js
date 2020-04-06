import React, { Component } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import StorageService from '../services/storageService';

import { connect } from 'react-redux';

import {USER_UPDATED, USER_LOGGED_OUT} from './../actions';
import {AzureADClientId, ApiResourceIdentifier} from '../settings';
import {ADLoginView, ReactNativeAD} from 'react-native-azure-ad';
import CookieManager from '@react-native-community/cookies';


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
    backgroundColor: '#FF1243',
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
  closeButton: {
    padding: 10,
    backgroundColor: '#FF1243',
    paddingHorizontal: 30
  }
});

class LogoutScreen extends Component {
  constructor(props) {
    super(props);
    StorageService.setPrefix(null);
    props.clearUser();
    // props.logout();
  }

  componentDidUpdate() {
    if (!this.props.user.loggedIn) {
      this.props.navigation.navigate('LoginRoute');
    }
  }

  onADURLChanged = async (webview) => {
    console.log('URL Changed: ', webview);
    if (webview.url.toLowerCase().indexOf('logout') <= -1) {
      try {
        await CookieManager.clearAll(true);
        const ctx = ReactNativeAD.getContext(AzureADClientId)
        await ctx.deleteCredentials(ApiResourceIdentifier);
        ReactNativeAD.removeContext(AzureADClientId);
      } catch (err) {
        console.log('Error while logging out: ', err.message);
      } finally {
        this.props.logout();
      }
      
    }
  }

  render() {
    return (
        <SafeAreaView style={styles.wrapper}>
          <View style={{flex: 1}}>
            <ADLoginView onSuccess={() => {}} context={ReactNativeAD.getContext(AzureADClientId)} hideAfterLogin={true} needLogout={true} onURLChange={this.onADURLChanged} />
          </View>
          <TouchableOpacity onPress={this.onCloseWebviewClick}>
            <View style={{justifyContent: 'center', alignItems: 'center', minHeight: 60}}>
              <Text style={[{color: '#FFF'}, styles.closeButton]}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(USER_LOGGED_OUT()),
  clearUser: () => dispatch(USER_UPDATED(null))
});

const mapStateToProps = state => ({
  user: state.Main.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutScreen);
