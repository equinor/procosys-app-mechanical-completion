import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Analytics from '../../../services/AnalyticsService';
import AutoSubmitTextInput from '../../../components/AutoSubmitTextInput/AutoSubmitTextInput';
import colors from '../../../stylesheets/colors';
import PurchaseOrderSearchResultView from './PurchaseOrderSearchResultList';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';

class PurchaseOrderSearchView extends Component {
  constructor(props) {
    super(props);
    this._renderResults = this._renderResults.bind(this);
    this._onSubmitSearch = this._onSubmitSearch.bind(this);
    this._onSubmitSearchPo = this._onSubmitSearchPo.bind(this);
    this._onSubmitSearchCalloff = this._onSubmitSearchCalloff.bind(this);
    this._onSelectPo = this._onSelectPo.bind(this);
    this._onClearPoSearch = this._onClearPoSearch.bind(this);
    this._onclearCallOffSearch = this._onclearCallOffSearch.bind(this);

    this.state = {
      showAdvanced: false,
      results: [],
      numberOfResults: 0,
      loading: false,
      calloffSearchTerm: null,
      poSearchTerm: null
    };
  }

  componentDidMount() {
    Analytics.SEARCH_LOAD("PurchaseOrder");
  }

  _onSubmitSearchCalloff(calloff) {
    Analytics.SEARCH_TRIGGERED("PurchaseOrderUsingCallOff", calloff.length);
    this.setState({calloffSearchTerm: calloff}, this._onSubmitSearch);
  }

  _onSubmitSearchPo(po) {
    Analytics.SEARCH_TRIGGERED("PurchaseOrder", po.length);
    this.setState({poSearchTerm: po}, this._onSubmitSearch);
  }    

  _onclearCallOffSearch() {
    this.setState({calloffSearchTerm: null}, () => {
    if (this.state.poSearchTerm!=null)
      this._onSubmitSearch();
    });
  }    

  _onClearPoSearch() {
    this.setState({poSearchTerm: null}, () => {
      if (this.state.calloffSearchTerm!=null)
        this._onSubmitSearch();
      });
    }

  _onSubmitSearch() {
    this.setState({ loading: true });
    ApiService.searchForPo(this.state.poSearchTerm, this.state.calloffSearchTerm)
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

  _onSelectPo(poItem) {
    this.props.navigation.navigate('PurchaseOrderRoute', { item: poItem });
  }

  _renderResults() {
    if (this.state.loading) {
      return <Spinner text="Searching..." />;
    }
    return (
      <View style={styles.resultContainer}>
        <PurchaseOrderSearchResultView
          result={this.state.results}
          totalResults={this.state.numberOfResults}
          onSelect={this._onSelectPo}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <AutoSubmitTextInput
          style={styles.searchbox}
          onSubmit={this._onSubmitSearchPo}
          onClear={this._onClearPoSearch}
          delay={1000}
          placeholder="Type to search PO"
          useHistory="POSearch"
        />
        <AutoSubmitTextInput
          style={styles.searchbox}
          onSubmit={this._onSubmitSearchCalloff}
          delay={1000}
          onClear={this._onclearCallOffSearch}
          placeholder="Type to search call off"
          useHistory="POSearchCallOf"
        />
        {this._renderResults()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1
  },
  container: {
    flex: 1
  },
  searchbox: {
    backgroundColor: '#FFF',
    paddingLeft: 15,
    marginBottom: 16,
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

export default PurchaseOrderSearchView;
