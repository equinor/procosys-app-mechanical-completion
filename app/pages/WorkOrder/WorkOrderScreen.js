import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import propTypes from 'prop-types';
import IconWithBadge from '../../components/IconWithBadge';
import WorkOrderHeader from '../../components/WorkOrderInfo';
import colors from '../../stylesheets/colors';
import ScopeView from '../../components/Scope/ScopeView';
import ApiService from '../../services/api';
import Spinner from '../../components/Spinner';

class WorkOrderScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      tabBarOptions: {adaptive: false},
      tabBarLabel:"Scope",
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <IconWithBadge
            name="ios-checkmark-circle"
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
      result: [],
      loading: false,
      availableStatusList: [],
      availableFormTypes: [],
      availableResponsibleCodes: []
    };
  }

  componentDidMount() {
    this.updateData();
    this.subs = [
      this.props.navigation.addListener('didFocus', this.updateData)
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  updateData = () => {
    this.setState({
      loading: true
    });

    callOffId = this.props.navigation.state.params.item.Id;
    ApiService.getChecklistsForWorkOrder(callOffId)
      .then(items => {
        let uniqueStatusItems = [];
        let uniqueResponsibleCodes = [];
        let uniqueFormTypes = [];
        items.map(item => {
          if (uniqueStatusItems.indexOf(item.Status) == -1) {
            uniqueStatusItems.push(item.Status);
          }
          if (
            item.ResponsibleCode &&
            uniqueResponsibleCodes.indexOf(item.ResponsibleCode) == -1
          ) {
            uniqueResponsibleCodes.push(item.ResponsibleCode);
          }
          if (
            item.FormularType &&
            uniqueFormTypes.indexOf(item.FormularType) == -1
          ) {
            uniqueFormTypes.push(item.FormularType);
          }
        });

        this.setState(
          {
            result: items,
            availableStatusList: uniqueStatusItems,
            availableResponsibleCodes: uniqueResponsibleCodes,
            availableFormTypes: uniqueFormTypes
          }
        );
        this.props.navigation.setParams({ badgeCount: items.length });
      })
      .finally(() =>
        this.setState({
          loading: false
        })
      );
  }

  onSelectChecklist = (item) => {
    this.props.navigation.navigate('MCCRRoute', { checklist: item });
  }

  _renderScope = () => {
    if (this.state.loading) {
      return <Spinner text="Fetching..." />;
    }
    return (
      <View style={styles.resultContainer}>
        <ScopeView
          result={this.state.result}
          availableFormTypes={this.state.availableFormTypes}
          availableResponsibleCodes={this.state.availableResponsibleCodes}
          availableStatusList={this.state.availableStatusList}
          onSelect={this.onSelectChecklist}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <WorkOrderHeader
          item={this.props.navigation.state.params.item}
          style={styles.header}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.content}>{this._renderScope()}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  resultContainer: {
    marginTop: 15,
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: colors.PAGE_BACKGROUND
  },
  content: {
    flex: 1,
    padding: 15
  }
});

WorkOrderScreen.propTypes = {
  navigation: propTypes.shape({
    state: propTypes.shape({
      params: propTypes.shape({
        item: propTypes.object.isRequired
      })
    })
  })
};

export default WorkOrderScreen;
