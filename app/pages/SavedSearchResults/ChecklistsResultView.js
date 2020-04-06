import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text
} from 'react-native';
import propTypes from 'prop-types';
import colors from '../../stylesheets/colors';
import ChecklistScopeList from './ChecklistScope/ScopeList';
import ApiService from '../../services/api';

class ChecklistsResultView extends React.PureComponent {

  static navigationOptions = {
    title: 'Saved checklist search'
  }
  constructor(props) {
    super(props);

    this.subs = [];
    this.state = {
      result: [],
      page: 0,
      loading: true,
      availableStatusList: [],
      availableFormTypes: [],
      availableResponsibleCodes: []
    };
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', this.refreshData)
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  refreshData = () => {
    this.setState({page: 0, result: [] }, this.updateData);
  }

  updateData = () => {
    savedSearchId = this.props.navigation.state.params.data.id;
    this.setState({loading: true});
    ApiService.getChecklistsForSavedSearch(savedSearchId, this.state.page)
      .then(items => {
        let newItemList = [...this.state.result, ...items];
        this.setState(
          {
            result: newItemList
          }
        );
      }).finally(() => {
        this.setState({loading: false})
      })
  }

  onSelectChecklist = (item) => {
    this.props.navigation.navigate('MCCRRoute', { checklist: item });
  }

  loadMore = () => {
    this.setState({page: this.state.page+1}, this.updateData);
  }

  render() {
    const {name} = this.props.navigation.state.params.data;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{name}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.content}>
            <View style={styles.resultContainer}>
              <ChecklistScopeList result={this.state.result} loadMore={this.loadMore} onSelect={this.onSelectChecklist} loading={this.state.loading} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  headerText: {
    fontSize: 14,
    color: '#3A85B3',
    margin: 15
  },
  resultContainer: {
    marginTop: 15,
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: colors.PAGE_BACKGROUND
  },
  scrollContainer: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 15
  }
});

ChecklistsResultView.propTypes = {
  navigation: propTypes.shape({
    state: propTypes.shape({
      params: propTypes.shape({
        data: propTypes.shape({
          name: propTypes.string.isRequired,
          id: propTypes.number.isRequired
        }).isRequired
      })
    })
  })
};

export default ChecklistsResultView;
