import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import WorkOrderInfoItem from '../../../components/WorkOrderInfo';

class WorkOrderSearchResultItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={itemStyle.container}
        onPress={this.props.onPress}
      >
        <WorkOrderInfoItem item={this.props.item} />
      </TouchableOpacity>
    );
  }
}

const itemStyle = StyleSheet.create({});

WorkOrderSearchResultItem.propTypes = {
  item: propTypes.shape({
    Id: propTypes.number.isRequired,
    WorkOrderNo: propTypes.string.isRequired,
    Title: propTypes.string.isRequired,
    Description: propTypes.string,
    DisciplineCode: propTypes.string,
    DisciplineDescription: propTypes.string
  }).isRequired
};

export default WorkOrderSearchResultItem;
