import React from 'react';
import { View, StyleSheet } from 'react-native';
import IconWithBadge from '../../components/IconWithBadge';
import TagHeader from '../../components/TagInfo';
import ApiService from '../../services/api';
import PunchListView from '../../Modules/PunchList/PunchListView';
import Spinner from '../../components/Spinner';

class TagPunchList extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarOptions: {adaptive: false},
      tabBarLabel: 'Punch List',
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
    this.state = {
      punchItems: [],
      loading: true
    }
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ badgeCount: 0 });
    let tag = this.props.navigation.state.params.item;
    ApiService.getPunchListForTag(tag.Id).then(punchItems => {
      this.setState({punchItems: punchItems, loading: false});
      this.props.navigation.setParams({ badgeCount: punchItems.length });
    }).catch(err => {
      Alert.alert("Error", "Failed to fetch punch items for Tag: " + err.message);
      this.setState({loading: false})
    })
  }

  onSelect(item) {
    this.props.navigation.navigate('PunchItemDetails',{punchId: item.Id, tagId: item.TagId})
  }

  render() {
    if (this.state.loading) {
      return <Spinner text="Loading punch items..."/>
    }
    return (
      <View style={{ flex: 1 }}>
        <TagHeader
          item={this.props.navigation.state.params.item}/>

        <PunchListView items={this.state.punchItems} onSelect={this.onSelect} />
      </View>
    );
  }
  
}

const styles = StyleSheet.create({});

TagPunchList.propTypes = {};

export default TagPunchList;
