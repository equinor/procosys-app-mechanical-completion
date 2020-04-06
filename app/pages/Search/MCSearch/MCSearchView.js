import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Analytics from '../../../services/AnalyticsService';
import AutoSubmitTextInput from '../../../components/AutoSubmitTextInput/AutoSubmitTextInput';
import colors from '../../../stylesheets/colors';
import MCSearchResultView from './MCSearchResultList';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';

class MCSearchView extends Component {
  constructor(props) {
    super(props);
    this._renderResults = this._renderResults.bind(this);
    this._onSubmitSearch = this._onSubmitSearch.bind(this);
    this._onSelectMcPackage = this._onSelectMcPackage.bind(this);

    this.state = {
      showAdvanced: false,
      results: [],
      numberOfResults: 0,
      loading: false
    };
  }

  componentDidMount() {
    Analytics.SEARCH_LOAD("MechanicalCompletion");
  }

  _onSubmitSearch(text) {
    this.setState({ loading: true });
    Analytics.SEARCH_TRIGGERED("MCSearch", text.length);
    ApiService.searchForMcPackage(text)
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

  _onSelectMcPackage(mcPackageItem) {
    this.props.navigation.navigate('McRoute', { item: mcPackageItem });
  }

  _renderResults() {
    if (this.state.loading) {
      return <Spinner text="Searching..." />;
    }
    return (
      <View style={styles.resultContainer}>
        <MCSearchResultView
          result={this.state.results}
          totalResults={this.state.numberOfResults}
          onSelect={this._onSelectMcPackage}
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
          delay={3000}
          placeholder="Type to search MC"
          useHistory="MCSearch"
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
    height: 48,
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1
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

export default MCSearchView;
