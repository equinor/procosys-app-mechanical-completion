import React from 'react';
import { View, StyleSheet } from 'react-native';
import IconWithBadge from '../../components/IconWithBadge';
import WorkOrderHeader from '../../components/WorkOrderInfo';
import ApiService from '../../services/api';
import PunchListView from '../../Modules/PunchList/PunchListView';

class WorkOrderPunchList extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarOptions: {adaptive: false},
      tabBarLabel:"Punch List",
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
    this.state = {
      punchItems: [],
      loading: true
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ badgeCount: 0 });
    let MCPackage = this.props.navigation.state.params.item;
    ApiService.getPunchListForWorkOrder(MCPackage.Id).then(punchItems => {
      this.setState({punchItems: punchItems, loading: false});
      this.props.navigation.setParams({ badgeCount: punchItems.length });
    }).catch(err => {
      Alert.alert("Error", "Failed to fetch punch items for WO: " + err.message);
      this.setState({loading: false});
    })
  }

  onSelect(item) {
    this.props.navigation.navigate('PunchItemDetails',{punchId: item.Id, tagId: item.TagId})
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WorkOrderHeader
          item={this.props.navigation.state.params.item}
        />
        <PunchListView items={this.state.punchItems} onSelect={this.onSelect} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

WorkOrderPunchList.propTypes = {};

export default WorkOrderPunchList;
