import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import PurchaseOrderInfoItem from '../../../components/PurchaseOrderInfo';

class PurchaseOrderSearchResultItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={itemStyle.container}
        onPress={this.props.onPress}
      >
        <PurchaseOrderInfoItem item={this.props.item} />
      </TouchableOpacity>
    );
  }
}

const itemStyle = StyleSheet.create({});

PurchaseOrderSearchResultItem.propTypes = {
  item: propTypes.shape({
    CallOffId: propTypes.number.isRequired,
    PurchaseOrderId: propTypes.number,
    IsPurchaseOrder: propTypes.bool,
    Title: propTypes.string,
    Description: propTypes.string,
    ResponsibleCode: propTypes.string
  }).isRequired
};

export default PurchaseOrderSearchResultItem;
