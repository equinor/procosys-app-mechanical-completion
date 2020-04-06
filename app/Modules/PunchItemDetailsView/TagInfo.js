import React from 'react';
import {View, ScrollView} from 'react-native';
import TagInfoView from '../TagInfoView';
import Icon from 'react-native-vector-icons/Ionicons'

class TagInfo extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: 'Tag Info',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon
            name="ios-information-circle"
            size={25}
            color={tintColor}
          />
        );
      }
    };
  };

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <TagInfoView tagId={this.props.navigation.state.params.tagId} />
        </View>
      </ScrollView>
    )
  }
}

export default TagInfo;
