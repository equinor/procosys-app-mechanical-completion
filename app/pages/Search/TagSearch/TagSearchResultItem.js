import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import TagInfoItem from '../../../components/TagInfo';

class TagSearchResultItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={itemStyle.container}
        onPress={this.props.onPress}
      >
        <TagInfoItem item={this.props.item} />
      </TouchableOpacity>
    );
  }
}

const itemStyle = StyleSheet.create({});

TagSearchResultItem.propTypes = {
  item: propTypes.shape({
    Id: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    Description: propTypes.string,
  }).isRequired
};

export default TagSearchResultItem;
