import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, Linking } from 'react-native';
import Color from '../stylesheets/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from '../components/FancyCheckbox';
import Actions from '../actions';

import { connect } from 'react-redux';

import IconButton from '../components/IconButton';
import AnalyticsService from '../services/AnalyticsService';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout() {
    AnalyticsService.BUTTON_CLICKED('SETTINGS_LOGOUT');
    //TODO: Logout from Azure AD
    this.props.logout();
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 12
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
          backgroundColor: Color.HEADER_BACKGROUND
        }}
      >
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            paddingTop: 10,
            paddingLeft: 10,
            backgroundColor: '#fff'
          }}
        >
          <IconButton
            icon="md-close"
            onPress={this.props.closeSettings}
            size={24}
            style={{ width: 40, paddingLeft: 10 }}
          />
          <Text
            style={{
              justifyContent: 'center',
              flex: 1,
              fontSize: 18,
              textAlign: 'center',
              fontFamily: 'Equinor-Regular',
              fontWeight: 'bold',
              color: Color.TEXT_COLOR
            }}
          >
            Welcome
          </Text>
        </View>
        <View
          style={{
            paddingLeft: 16,
            paddingBottom: 16,
            borderBottomWidth: StyleSheet.hairlineWidth
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: Color.TEXT_COLOR
            }}
          >
            Signed in as
          </Text>
          <Text style={{ color: Color.TEXT_COLOR }}>
            {this.props.user.name}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: Color.BUTTON_BACKGROUND_SECONDARY,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-start',
              padding: 8,
              marginTop: 16,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: Color.BUTTON_BORDER
            }}
            onPress={this.logout}
          >
            <Text
              style={{
                lineHeight: 24,
                fontSize: 14,
                fontWeight: 'bold',                
                color: Color.TEXT_COLOR
              }}
            >
              Sign out
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 6, backgroundColor: Color.PAGE_BACKGROUND }}>
          <View style={{ flex: 1, margin: 15 }}>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              Selected plant
            </Text>
            <TouchableOpacity
              style={{
                fontSize: 14,
                marginBottom: 16,
                backgroundColor: '#fff',
                padding: 16,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Color.BORDER_COLOR,
                color: Color.TEXT_COLOR,
                flexDirection: 'row'
              }}
              onPress={() => {
                AnalyticsService.trackEvent('SETTINGS_SWITCH_PLANT');
                this.props.navigation.navigate('SelectPlant', {
                  onFinish: () => this.props.navigation.navigate('SelectProject', {
                    onFinish: this.props.navigation.popToTop
                  })
                });
              }}
            >
              <Text style={{ flex: 1 }}>{this.props.plant.Title}</Text>
              <View
                style={{
                  alignItems: 'flex-end',
                  flex: 1
                }}
              >
                <Icon name="ios-arrow-forward" size={14} />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, marginBottom: 8 }}>
              Selected project
            </Text>
            <TouchableOpacity
              style={{
                fontSize: 14,
                marginBottom: 16,
                backgroundColor: '#fff',
                padding: 16,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: Color.BORDER_COLOR,
                color: Color.TEXT_COLOR,
                flexDirection: 'row'
              }}
              onPress={() => {
                AnalyticsService.trackEvent('SETTINGS_SWITCH_PROJECT');
                this.props.navigation.navigate('SelectProject', {
                  onFinish: this.props.navigation.popToTop
                });
              }}
            >
              <Text style={{ flex: 1 }}>{this.props.project.Title}</Text>
              <View
                style={{
                  alignItems: 'flex-end',
                  flex: 1
                }}
              >
                <Icon name="ios-arrow-forward" size={14} />
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View style={{ flex: 3 }}>
                <Text style={{ marginLeft: 15, fontSize: 12, lineHeight: 18 }}>
                  Do you want to see this menu when starting the app?
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Checkbox
                  checked={this.props.autoShowSettingsOnLoad}
                  onPress={this.props.toggleAutoShowSettingsOnLaunch}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 3, backgroundColor: '#fff' }}>
          <TouchableOpacity
            onPress={() => {
              AnalyticsService.LINK_CLICKED("https://equinor.service-now.com/selfservice?id=sc_cat_item&sys_id=67053df4dbe82b008a0f9407db9619d1");
              Linking.openURL("https://equinor.service-now.com/selfservice?id=sc_cat_item&sys_id=67053df4dbe82b008a0f9407db9619d1");
            }}
            style={{
              flex: 1,
              borderTopWidth: StyleSheet.hairlineWidth,
              justifyContent: 'center'
            }}
          >
            <Text style={{ paddingLeft: 16, color: Color.TEXT_COLOR }}>
              Feedback
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('About')}
            style={{
              flex: 1,
              borderTopWidth: StyleSheet.hairlineWidth,
              justifyContent: 'center'
            }}
          >
            <Text style={{ paddingLeft: 16, color: Color.TEXT_COLOR }}>
              About application
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              AnalyticsService.LINK_CLICKED("https://fusion.equinor.com/");
              Linking.openURL("https://fusion.equinor.com/");
            }}
            style={{
              flex: 1,
              borderTopWidth: StyleSheet.hairlineWidth,
              justifyContent: 'center'
            }}
          >
            <Text style={{ paddingLeft: 16, color: Color.TEXT_COLOR }}>
              Open Fusion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              AnalyticsService.LINK_CLICKED("https://app.powerbi.com/home");
              Linking.openURL("https://app.powerbi.com/home");
            }}
            style={{
              flex: 1,
              borderTopWidth: StyleSheet.hairlineWidth,
              justifyContent: 'center'
            }}
          >
            <Text style={{ paddingLeft: 16, color: Color.TEXT_COLOR }}>
              Open PowerBI
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              borderTopWidth: StyleSheet.hairlineWidth,
              justifyContent: 'center'
            }}
          >
            <Text style={{ paddingLeft: 16, color: Color.TEXT_COLOR }}>
              
            </Text>
          </View>
        </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Main.user,
  plant: state.Main.appData.plant,
  project: state.Main.appData.project,
  autoShowSettingsOnLoad: state.Main.appData.settings.autoShowSettingsOnLoad
});

const mapDispatchToProps = dispatch => ({
  toggleAutoShowSettingsOnLaunch: () =>
    dispatch(Actions.toggleAutoShowSettingsOnLaunch()),
    logout: () => dispatch(Actions.USER_EXPIRED())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
