import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableHighlight } from 'react-native';
import PunchListItem from './PunchListItem';
import propTypes from 'prop-types';
import Spinner from '../../../components/Spinner';


/**
 * @example
 * <PunchItemList
 *  items={[]}
 *  onSelect={() => {}}
 */
class PunchItemList extends React.PureComponent {

  constructor(props) {
    super(props);
  }
  renderEmptyList = () => {
    return (
      <View styles={styles.container}>
        <Text style={styles.emptyResultText}>No punch items</Text>
      </View>
    );
  }

  renderFooter = () => {
    if (this.props.loading) {
      return <Spinner text="Loading punch items" />
    }
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableHighlight onPress={this.props.loadMore} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{padding: 15, fontSize: 16}}>Load More</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderItem = ({item}) => {
    return (
      <PunchListItem
        item={item}
        onPress={() => this.props.onSelect(item)}
      />
    );
  }

  render() {
    if (!this.props.loading && this.props.items.length <= 0) {
      return this.renderEmptyList();
    } else if (this.props.loading && this.props.items.length <= 0) {
      return <Spinner text="Loading punch items" />
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Punch items ({this.props.items.length})</Text>
        <FlatList
          data={this.props.items}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          refreshing={this.props.loading}
          ListFooterComponent={this.renderFooter()}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.Id}`}
          extra={this.props.items}
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

PunchItemList.propTypes = {
  items: propTypes.array,
  onSelect: propTypes.func.isRequired,
  totalResults: propTypes.number
};
PunchItemList.defaultProps = {
  items: [],
  onSelect: null,
  totalResults: 0
};
export default PunchItemList;
