import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import propTypes from 'prop-types';
import PunchItemStatusIcon from '../../components/PunchItemStatusIcon';
import Icon from 'react-native-vector-icons/Ionicons';

class PunchListItem extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <TouchableOpacity
        style={itemStyle.container}
        onPress={this.props.onPress}
      >
        <View style={itemStyle.statusContainer}>
          <PunchItemStatusIcon
            type={item.Status}
            verified={item.Verified}
            cleared={item.Cleared}
          />
        </View>
        <View style={itemStyle.infoContainer}>
          <View style={itemStyle.detailsRow}>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemHeader]}>
              {item.Id} {item.CallOffNo && (`/ ${item.CallOffNo}`)}
            </Text>
            
          </View>
          <View style={itemStyle.detailsRow}>
            <Text style={[itemStyle.infoItem, {flex: 2}]}>{item.TagNo}</Text>
            <Text style={[itemStyle.infoItem, {textAlign: 'right'}]}>
              {item.FormularType}
            </Text>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemLast]}>
              {item.ResponsibleCode}
            </Text>
          </View>
          <View style={itemStyle.descriptionRow}>
            <Text style={itemStyle.descriptionText} numberOfLines={1}>{item.TagDescription}</Text>
              <View style={itemStyle.attachmentColumn}>
                <Text style={[]}>
                  {item.AttachmentCount}{' '}
                </Text>
                <Icon
                  name="ios-attach"
                  size={14}
                  style={{ transform: [{ rotate: '-30deg' }] }}
                />
              </View>
          </View>
        </View>
      </TouchableOpacity>
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
    paddingVertical: 12,
    paddingRight: 12
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
    alignContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    fontSize: 14
  },
  infoItemLast: {
    textAlign: 'right'
  },
  infoItemHeader: {
    flex: 2,
    fontSize: 16,
    color: '#3A85B3'
  },
  descriptionText: {
    fontSize: 12,
    color: '#243746',
    marginRight: 12,
    flex: 1
  },
  descriptionRow: {
    marginTop: 4,
    flexDirection: 'row'
  },
  attachmentColumn: {
    flexDirection: 'row',
  },
  subDescription: {
    marginTop: 4
  },
  subDescriptionText: {
    fontSize: 12
  }
});

PunchListItem.propTypes = {
  item: propTypes.shape({
    Id: propTypes.number.isRequired,
    Status: propTypes.string.isRequired,
    Description: propTypes.string.isRequired,
    SystemModule: propTypes.string.isRequired,
    TagDescription: propTypes.string.isRequired,
    TagId: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    IsRestrictedForUser: propTypes.bool.isRequired,
    Cleared: propTypes.bool.isRequired,
    Rejected: propTypes.bool.isRequired,
    Verified: propTypes.bool.isRequired,
    StatusControlledBySwcr: propTypes.bool.isRequired,
    CallOffNo: propTypes.string
    /*AttachmentCount: propTypes.bool.isRequired*/
  }).isRequired
};

export default PunchListItem;
