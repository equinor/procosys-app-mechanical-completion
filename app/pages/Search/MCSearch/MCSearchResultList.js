import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import MCSearchResultItem from './MCSearchResultItem';
import propTypes from 'prop-types';

class MCSearchResultList extends React.PureComponent {
  renderEmptyList() {
    return (
      <View styles={styles.container}>
        <Text style={styles.emptyResultText}>No results</Text>
      </View>
    );
  }

  render() {
    if (!this.props.result) {
      return this.renderEmptyList();
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Search result ({this.props.totalResults})
        </Text>
        <FlatList
          data={this.props.result}
          initialNumToRender={10}
          renderItem={({ item }) => {
            return (
              <MCSearchResultItem
                item={item}
                onPress={() => this.props.onSelect(item)}
              />
            );
          }}
          keyExtractor={item => `${item.Id}`}
          extra={this.props.result}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    marginBottom: 15,
    fontWeight: '700'
  },
  emptyResultText: {
    fontSize: 16,
    textAlign: 'center'
  }
});

MCSearchResultList.propTypes = {
  result: propTypes.array,
  onSelect: propTypes.func.isRequired
};
MCSearchResultList.defaultProps = {
  result: [],
  onSelect: null
};
export default MCSearchResultList;
