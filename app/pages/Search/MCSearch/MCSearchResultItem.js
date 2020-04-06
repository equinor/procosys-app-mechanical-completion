import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import MCPackageInfoItem from '../../../components/MCPackageInfo';

class MCSearchResultItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={itemStyle.container}
        onPress={this.props.onPress}
      >
        <MCPackageInfoItem item={this.props.item} />
      </TouchableOpacity>
    );
  }
}

const itemStyle = StyleSheet.create({});

MCSearchResultItem.propTypes = {
  item: propTypes.shape({
    CommissioningHandoverStatus: propTypes.string.isRequired,
    Description: propTypes.string,
    Id: propTypes.number.isRequired,
    McPkgNo: propTypes.string.isRequired,
    CommPkgNo: propTypes.string,
    OperationHandoverStatus: propTypes.string.isRequired,
    PhaseCode: propTypes.string,
    PhaseDescription: propTypes.string,
    ResponsibleCode: propTypes.string,
    ResponsibleDescription: propTypes.string,
    Status: propTypes.string.isRequired
  }).isRequired
};

export default MCSearchResultItem;
