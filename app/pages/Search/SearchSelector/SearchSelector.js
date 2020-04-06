import React, { Component } from 'react';
import { View } from 'react-native';
import SearchButton from './SearchButton';
import propTypes from 'prop-types';

class SearchSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBtn: null
    };

    this.selectionChanged = this.selectionChanged.bind(this);
  }

  selectionChanged(btnKey) {
    if (this.state.activeBtn == btnKey) {
      btnKey = null;
    }
    this.setState({
      activeBtn: btnKey
    });
    this.props.onSelect(btnKey);
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <SearchButton
            onSelect={() => this.selectionChanged('PO')}
            text="PO"
            selected={this.state.activeBtn === "PO"}
          />
        </View>
        <View style={{ flex: 1, marginRight: 10 }}>
          <SearchButton
            onSelect={() => this.selectionChanged('MC')}
            text="MC"
            selected={this.state.activeBtn === "MC"}
          />
        </View>
        <View style={{ flex: 1, marginRight: 10 }}>
          <SearchButton
            onSelect={() => this.selectionChanged('WO')}
            text="WO"
            selected={this.state.activeBtn === "WO"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <SearchButton
            onSelect={() => this.selectionChanged('Tag')}
            text="Tag"
            selected={this.state.activeBtn === "Tag"}
          />
        </View>
      </View>
    );
  }
}

SearchSelector.propTypes = {
  onSelect: propTypes.func.isRequired
};

export default SearchSelector;
