import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import ScopeItem from './ScopeItem';
import propTypes from 'prop-types';
import Spinner from '../../../components/Spinner'

/**
 * @example
 * <ScopeList 
 *  result={[]}
 *  loadMore={() => {}}
 *  onSelect={() => {}}
 *  loading={false}
 *  />
 */
class ScopeList extends React.PureComponent {
  renderEmptyList() {
    return (
      <View styles={styles.container}>
        <Text style={styles.emptyResultText}>No forms</Text>
      </View>
    );
  }

  renderFooter = () => {
    if (this.props.loading) {
      return <Spinner text="Loading checklists" />
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableHighlight onPress={this.props.loadMore} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{padding: 15, fontSize: 16}}>Load More</Text>
        </TouchableHighlight>
      </View>
    )
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
          <View style={{flex: 2}}><Text style={styles.titleText}>Tag</Text></View>
          <View style={{flex: 1}}><Text style={styles.titleText}>Form type</Text></View>
          <View style={{flex: 1}}><Text style={[styles.titleText, {textAlign: 'right'}]}>Responsible</Text></View>
        </View>
        <FlatList
          data={this.props.result}
          initialNumToRender={10}
          ListFooterComponent={this.renderFooter()}
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
  headerTitlesContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },
  titleText: {
    fontSize: 10,
    color: '#243746'
  },
  emptyResultText: {
    fontSize: 16,
    textAlign: 'center'
  }
});

ScopeList.propTypes = {
  result: propTypes.arrayOf(propTypes.shape({
    Id: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    TagDescription: propTypes.string.isRequired,
    Status: propTypes.string.isRequired,
    ProjectDescription: propTypes.string,
    FormularType: propTypes.string.isRequired,
    FormularGroup: propTypes.string.isRequired,
    HasElectronicForm: propTypes.bool.isRequired,
    AttachmentCount: propTypes.number.isRequired
  })),
  onSelect: propTypes.func.isRequired,
  loadMore: propTypes.func.isRequired
};

ScopeList.defaultProps = {
  result: [],
};
export default ScopeList;
