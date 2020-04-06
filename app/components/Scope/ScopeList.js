import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ScopeItem from './ScopeItem';
import propTypes from 'prop-types';

/**
 * @example
 * <ScopeList 
 *  result={[]}
 *  onSelect={() => {}}
 * />
 */
class ScopeList extends React.PureComponent {
  renderEmptyList() {
    return (
      <View styles={styles.container}>
        <Text style={styles.emptyResultText}>No forms</Text>
      </View>
    );
  }

  render() {
    if (!this.props.result) {
      return this.renderEmptyList();
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Forms ({this.props.result.length})</Text>
        <View style={styles.headerTitlesContainer}>
          <View style={{width: 60, maxWidth: 60}}><Text style={styles.titleText}>Status</Text></View>
          <View style={{flex: 3}}><Text style={styles.titleText}>Tag</Text></View>
          <View style={{flex: 1}}><Text style={styles.titleText}>Form type</Text></View>
          <View style={{flex: 1}}><Text style={[styles.titleText, {textAlign: 'right'}]}>Responsible</Text></View>
        </View>
        <FlatList
          data={this.props.result}
          initialNumToRender={10}
          renderItem={({ item }) => {
            return (
              <ScopeItem
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
  },
  headerTitlesContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },
  titleText: {
    fontSize: 10,
    color: '#243746'
  },
});

ScopeList.propTypes = {
  result: propTypes.array,
  onSelect: propTypes.func.isRequired,
};
ScopeList.defaultProps = {
  result: [],
  onSelect: null,
};
export default ScopeList;
