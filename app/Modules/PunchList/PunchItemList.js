import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PunchListItem from './PunchListItem';
import propTypes from 'prop-types';

class PunchItemList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }
  renderEmptyList() {
    return (
      <View styles={styles.container}>
        <Text style={styles.emptyResultText}>No punch items</Text>
      </View>
    );
  }

  renderItem({item}) {
    return (
      <PunchListItem
        item={item}
        onPress={() => this.props.onSelect(item)}
      />
    );
  }

  render() {
    if (this.props.items.length <= 0) {
      return this.renderEmptyList();
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Punch items ({this.props.totalResults})</Text>
        <FlatList
          data={this.props.items}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
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
