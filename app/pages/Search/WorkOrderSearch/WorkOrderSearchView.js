import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AutoSubmitTextInput from '../../../components/AutoSubmitTextInput/AutoSubmitTextInput';
import Analytics from '../../../services/AnalyticsService';
import colors from '../../../stylesheets/colors';
import WorkOrderSearchResultView from './WorkOrderSearchResultList';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';

class WorkOrderSearchView extends Component {
  constructor(props) {
    super(props);
    this._renderResults = this._renderResults.bind(this);
    this._onSubmitSearch = this._onSubmitSearch.bind(this);
    this._onSelectWo = this._onSelectWo.bind(this);

    this.state = {
      showAdvanced: false,
      results: [],
      numberOfResults: 0,
      loading: false
    };
  }

  componentDidMount() {
    Analytics.SEARCH_LOAD("WorkOrder");
  }

  _onSubmitSearch(text) {
    Analytics.SEARCH_TRIGGERED("WorkOrder", text.length);
    this.setState({ loading: true });
    ApiService.searchForWo(text)
      .then(result => {
        this.setState({
          results: result.Items,
          numberOfResults: result.MaxAvailable
        });
      })
      .catch(err => {
        this.setState({
          results: [],
          numberOfResults: 0
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  _onSelectWo(woItem) {
    this.props.navigation.navigate('WorkOrderRoute', { item: woItem });
  }

  _renderResults() {
    if (this.state.loading) {
      return <Spinner text="Searching..." />;
    }
    return (
      <View style={styles.resultContainer}>
        <WorkOrderSearchResultView
          result={this.state.results}
          totalResults={this.state.numberOfResults}
          onSelect={this._onSelectWo}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <AutoSubmitTextInput
          style={styles.searchbox}
          onSubmit={this._onSubmitSearch}
          delay={1000}
          placeholder="Type to search WO nr"
          useHistory="WOSearch"
        />

        {this._renderResults()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 15,
    flex: 1
  },
  container: {
    flex: 1
  },
  searchbox: {
    backgroundColor: '#FFF',
    paddingLeft: 15,
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
    height: 48
  },
  pickerInputbox: {
    backgroundColor: '#FFF',
    paddingLeft: 15,
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1
  },
  filterTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    alignItems: 'center'
  },
  filterText: {
    fontSize: 18,
    marginRight: 10
  },
  filterTextExpanded: {
    color: '#3A85B3'
  },
  advancedViewContainer: {
    marginTop: 15
  },
  inputContainer: {
    marginTop: 15
  },
  inputLabel: {
    marginBottom: 8
  }
});

export default WorkOrderSearchView;
