import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import propTypes from 'prop-types';
import MCStatus from './MCStatus';

class MCPackageInfo extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <View
        style={[itemStyle.container, this.props.style]}
        onPress={this.props.onPress}
      >
        <View style={itemStyle.statusContainer}>
          <MCStatus
            mcStatus={item.Status}
            operationHandoverStatus={item.OperationHandoverStatus}
            commissioningHandoverStatus={item.CommissioningHandoverStatus}
          />
        </View>
        <View style={itemStyle.infoContainer}>
          <View style={itemStyle.detailsRow}>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemHeader]}>
              {item.McPkgNo}
            </Text>
            <Text style={itemStyle.infoItem}>{item.CommPkgNo}</Text>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemLast]}>
              {item.ResponsibleCode}
            </Text>
          </View>
          <View style={itemStyle.descriptionRow}>
            <Text style={itemStyle.descriptionText}>{item.Description}</Text>
          </View>
          <View style={itemStyle.subDescription}>
            <Text style={itemStyle.subDescriptionText}>
              {item.PhaseCode}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const itemStyle = StyleSheet.create({
  container: {
    height: 72,
    maxHeight: 72,
    minHeight: 72,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 4,
    padding: 12
  },
  statusContainer: {
    //flex: 1
    width: 50
  },
  infoContainer: {
    flex: 1
  },
  detailsRow: {
    flexDirection: 'row',
    alignContent: 'space-between'
  },
  infoItem: {
    flex: 1
  },
  infoItemLast: {
    textAlign: 'right'
  },
  infoItemHeader: {
    fontSize: 16,
    color: '#3A85B3'
  },
  descriptionText: {
    fontSize: 12,
    color: '#243746',
    fontWeight: '500'
  },
  descriptionRow: {
    marginTop: 4
  },
  subDescription: {
    marginTop: 4
  },
  subDescriptionText: {
    fontSize: 12
  }
});

MCPackageInfo.propTypes = {
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

export default MCPackageInfo;
