import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import IconWithBadge from '../../../components/IconWithBadge';
import {connect} from 'react-redux';
import PunchListView from '../../../Modules/PunchList/PunchListView';
import ApiService from '../../../services/api';
import PreservationHeader from '../PreservationHeader';
import NavigationHeader from '../../../components/NavigationHeader';

class MCCRPunchlistView extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarOptions: {adaptive: false},
      tabBarLabel: 'Punch list',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <IconWithBadge
            name="ios-alert"
            size={25}
            badgeCount={navigation.state.params.badgeCount}
            color={tintColor}
          />
        );
      }
    };
  };
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.subs = [];
    this.state = {
      punchItems: [],
      loading: true
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ badgeCount: 0 });
    this.subs = [
      this.props.navigation.addListener('didFocus', this.updatePunchlist)
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  componentDidUpdate(prevProps) {
    if (!Object.is(prevProps.checklistInfo,this.props.checklistInfo)) {
      this.updatePunchlist();
    }
  }

  updatePunchlist = () => {
    let checklistId = this.props.checklistInfo.Id;
    ApiService.getPunchListForChecklist(checklistId).then(punchItems => {
      this.setState({punchItems: punchItems, loading: false});
      this.props.navigation.setParams({ badgeCount: punchItems.length });
    }).catch(err => {
      Alert.alert("Error", "Failed to fetch punch items for Checklist: " + err.message);
      this.setState({loading: false});
    })
  }

  onSelect(item) {
    this.props.navigation.navigate('PunchItemDetails',{punchId: item.Id, tagId: item.TagId})
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationHeader navigation={this.props.navigation} title="Punch list" />
        <PreservationHeader item={this.props.checklistInfo} />
        <PunchListView items={this.state.punchItems} onSelect={this.onSelect} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

MCCRPunchlistView.propTypes = {};

const mapStateToProps = state => ({
  checklistInfo: state.Data.checklistInfo,
});
MCCRPunchlistView.defaultProps = {
  checklistInfo: {}
}

export default connect(
  mapStateToProps,
  null
)(MCCRPunchlistView);
