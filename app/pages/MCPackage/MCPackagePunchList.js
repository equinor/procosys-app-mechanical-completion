import React from 'react';
import { View, StyleSheet } from 'react-native';
import IconWithBadge from '../../components/IconWithBadge';
import MCPackageHeader from '../../components/MCPackageInfo';
import PunchListView from '../../Modules/PunchList/PunchListView';
import ApiService from '../../services/api';

class PunchList extends React.PureComponent {
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
    this.subs = [];
    this.state = {
      punchItems: [],
      loading: true
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ badgeCount: 0 });
    this.subs = [
      this.props.navigation.addListener('didFocus', this.updateData)
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  updateData = () => {
    let MCPackage = this.props.navigation.state.params.item;
    ApiService.getPunchListForMcPackage(MCPackage.Id).then(punchItems => {
      this.setState({punchItems: punchItems, loading: false});
      this.props.navigation.setParams({ badgeCount: punchItems.length });
    }).catch(err => {
      Alert.alert("Error", "Failed to fetch punch items for MC: " + err.message);
      this.setState({loading: false});
    })
  }

  onSelect = (item) => {
    this.props.navigation.navigate('PunchItemDetails',{punchId: item.Id, tagId: item.TagId})
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MCPackageHeader
          item={this.props.navigation.state.params.item}
        />
        <PunchListView items={this.state.punchItems} onSelect={this.onSelect} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

PunchList.propTypes = {};

export default PunchList;
