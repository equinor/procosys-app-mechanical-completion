import React, { Component } from 'react';
import { connect } from 'react-redux';
import Color from '../../stylesheets/colors';

import SettingsScreen from '../SettingsScreen';
import SearchSelector from './SearchSelector/SearchSelector';
import SavedSearches from './SavedSearch/SavedSearch';
import MCSearchView from './MCSearch/MCSearchView';
import WorkOrderSearchView from './WorkOrderSearch/WorkOrderSearchView';
import PurchaseOrderSearchView from './PurchaseOrderSearch/PurchaseOrderSearchView';
import TagSearchView from './TagSearch/TagSearchView';

import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback, 
  Linking, 
  Alert
} from 'react-native';
import IconButton from '../../components/IconButton';
import DeepLinkService from '../../services/DeepLinkService';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.PAGE_BACKGROUND }
});

class DefaultScreen extends Component {
  static navigationOptions = () => ({
    header: null
  });

  state = {
    settingsPositionX: new Animated.Value(Dimensions.get('window').width * -1),
    subView: null
  };
  constructor(props) {
    super(props);
  }

  handleUrl = async (event) => {
    try {
      await DeepLinkService.handleUrl(event.url);
    } catch (err) {
      Alert.alert("Failed to navigate", err);
    }
  }

  componentDidMount() {
    Linking.addEventListener("url", this.handleUrl);
    if (this.props.autoShowSettingsOnLoad) {
      this.toggleSettingsDrawer();
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleUrl);
  }

  toggleSettingsDrawer = () => {
    this.startAnimatingSettings();
  }

  onSelect = selection => {
    this.setState({
      subView: selection
    });
  };

  startAnimatingSettings = () => {
    let animationOptions = {
      toValue: 0,
      duration: 300
    };
    // Enables Toggle
    if (
      this.state.settingsPositionX._value !=
      this.state.settingsPositionX._startingValue
    ) {
      animationOptions.toValue = this.state.settingsPositionX._startingValue;
    }

    Animated.timing(this.state.settingsPositionX, animationOptions).start();
  }

  renderSubview = () => {
    switch (this.state.subView) {
      case 'PO':
        return this._renderPurchaseOrderView();
      case 'MC':
        return this._renderMcView();
      case 'WO':
        return this._renderWorkOrderView();
        case 'Tag':
        return this._renderTagView();
      default:
        return this._renderSavedSearches();
    }
  }

  _renderPurchaseOrderView() {
    return <PurchaseOrderSearchView navigation={this.props.navigation} />;
  }

  _renderMcView() {
    return <MCSearchView navigation={this.props.navigation} />;
  }

  _renderWorkOrderView() {
    return <WorkOrderSearchView navigation={this.props.navigation} />;
  }

  _renderTagView() {
    return <TagSearchView navigation={this.props.navigation} />;
  }

  _renderSavedSearches() {
    return <SavedSearches navigation={this.props.navigation} />;
  }

  render() {
    let settings = <React.Fragment />;
    settings = (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%',
          zIndex: 10,
          left: this.state.settingsPositionX,
          flexDirection: 'row'
        }}
      >
        <View style={{ width: '70%'}}>
          <SettingsScreen
            closeSettings={this.toggleSettingsDrawer}
            navigation={this.props.navigation}
          />
        </View>
        <TouchableWithoutFeedback onPress={this.toggleSettingsDrawer}>
          <View style={{ width: '30%', height: '100%' }} />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            maxHeight: 40,
            backgroundColor: Color.HEADER_BACKGROUND,
            borderBottomWidth: StyleSheet.hairlineWidth,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: '#fff'
          }}
        >
          <IconButton
            icon="md-menu"
            onPress={this.toggleSettingsDrawer}
            size={24}
            style={{ justifyContent: 'flex-start', width: 40, paddingLeft: 10 }}
          >
            Left
          </IconButton>
          <Text
            style={{
              justifyContent: 'center',
              flex: 1,
              fontSize: 18,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            Search
          </Text>
        </View>
        <View style={{ flex: 1, padding: 15 }}>
          <Text
            style={{ fontSize: 18, color: Color.TEXT_COLOR, marginBottom: 15 }}
          >
            Search for
          </Text>
          <SearchSelector onSelect={this.onSelect} />
          <View style={{ flex: 1, paddingTop: 15 }}>
            {this.renderSubview()}
          </View>
        </View>
        {settings}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  autoShowSettingsOnLoad: state.Main.appData.settings.autoShowSettingsOnLoad
});

const mapDispatchToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultScreen);
