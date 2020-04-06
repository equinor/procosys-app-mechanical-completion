import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import EditPunchView from './EditPunchItemView';
import CreatePunchView from './CreatePunchItemView';
import AnalyticsService from '../../../services/AnalyticsService';

class PunchItemDetailsView extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: 'Details',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon
            name="ios-alert"
            size={25}
            color={tintColor}
          />
        );
      },
      headerTitle: 'Punch details'
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.navigation.state.params.punchId) {
      return <EditPunchView punchId={this.props.navigation.state.params.punchId} /> 
    }
    return <CreatePunchView navigation={this.props.navigation} />;
  }
}

export default PunchItemDetailsView;
