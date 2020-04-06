import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Analytics from '../../../services/AnalyticsService';
import AutoSubmitTextInput from '../../../components/AutoSubmitTextInput/AutoSubmitTextInput';
import colors from '../../../stylesheets/colors';
import TagSearchResultView from './TagSearchResultList';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';
import TagOcr from '../../../components/TagOcr';

class TagSearchView extends Component {
  constructor(props) {
    super(props);
    this._renderResults = this._renderResults.bind(this);
    this._onSubmitSearch = this._onSubmitSearch.bind(this);
    this._onSelectTag = this._onSelectTag.bind(this);
    this.setAndClose = this.setAndClose.bind(this);

    this.state = {
      showAdvanced: false,
      results: [],
      numberOfResults: 0,
      loading: false,
      modalVisible: false,
      modalTagsVisible: false
    };
  }

  componentDidMount() {
    Analytics.SEARCH_LOAD("Tag");
  }

  _onSubmitSearch(text) {
    Analytics.SEARCH_TRIGGERED("Tag", text.length);
    this.setState({ loading: true, tagText: text });
    ApiService.searchForTag(text)
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

  _onSelectTag(tagNo) {
    this.props.navigation.navigate('TagRoute', { item: tagNo });
  }

  _renderResults() {
    if (this.state.loading) {
      return <Spinner text="Searching..." />;
    }
    return (
      <View style={styles.resultContainer}>
        <TagSearchResultView
          result={this.state.results}
          totalResults={this.state.numberOfResults}
          onSelect={this._onSelectTag}
        />
      </View>
    );
  }

  setAndClose(item) {
    if (item !== undefined) {
      this._onSubmitSearch(item);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <TagOcr
            style={styles.ocrmodule}
            setAndClose={this.setAndClose}
          />
          <View style={styles.container}>
            <AutoSubmitTextInput
              style={styles.searchbox}
              onSubmit={this._onSubmitSearch}
              text={this.state.tagText}
              delay={3000}
              placeholder="Type to search tag nr"
              useHistory="TagSearch"
            />
          </View>
        </View>
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
  ocrmodule: {
    height: 50,
    width: 50
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
  }
});

export default TagSearchView;
