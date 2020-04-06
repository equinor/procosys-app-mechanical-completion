import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import MCCRHeader from '../MCCRHeader'
import {connect} from 'react-redux';
import TagInfoModule from '../../../Modules/TagInfoView'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationHeader from '../../../components/NavigationHeader';

class TagInfoView extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarLabel: 'Tag Info',
      tabBarOptions: {adaptive: false},
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon
            name="ios-alert"
            size={25}
            color={tintColor}
          />
        );
      },
    };
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader navigation={this.props.navigation} title="Tag info" />
        <MCCRHeader item={this.props.checklistInfo} />
        <ScrollView style={{
          flex: 1
        }}>
          {this.props.checklistInfo && (<TagInfoModule tagId={this.props.checklistInfo.TagId} />)}
        </ScrollView>
        
      </SafeAreaView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const mapStateToProps = state => ({
  checklistInfo: state.Data.checklistInfo,
});
TagInfoView.defaultProps = {
  checklistInfo: {}
}

export default connect(
  mapStateToProps,
  null
)(TagInfoView);
