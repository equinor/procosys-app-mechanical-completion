import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import propTypes from 'prop-types';
import ChecklistStatus from '../../../components/ChecklistStatus';
import Icon from 'react-native-vector-icons/Ionicons';

class ScopeItem extends React.PureComponent {
  render() {
    const { item } = this.props;
    return (
      <TouchableOpacity
        style={itemStyle.container}
        onPress={this.props.onPress}
      >
        <View style={itemStyle.statusContainer}>
          <ChecklistStatus
            status={item.Status}
            signed={item.IsSigned}
            verified={item.IsVerified}
          />
        </View>
        <View style={itemStyle.infoContainer}>
          <View style={itemStyle.detailsRow}>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemHeader]}>
              {item.TagNo}
            </Text>
            <Text style={itemStyle.infoItem}>{item.FormularType}</Text>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemLast]}>
              {item.ResponsibleCode}
            </Text>
          </View>
          <View style={itemStyle.descriptionRow}>
            <Text style={itemStyle.descriptionText}>{item.TagDescription}</Text>
              <View style={itemStyle.attachmentColumn}>
                <Text style={[itemStyle.infoItem, itemStyle.infoItemLast]}>
                  {item.AttachmentCount}{' '}
                </Text>
                <Icon
                  name="ios-attach"
                  size={14}
                  style={{ transform: [{ rotate: '-30deg' }], marginLeft: 2 }}
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
    height: 56,
    maxHeight: 56,
    minHeight: 56,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 4,
    padding: 12
  },
  statusContainer: {
    //flex: 1
    width: 50,
    maxWidth: 50,
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
    flex: 2,
    fontSize: 16,
    color: '#3A85B3'
  },
  descriptionText: {
    fontSize: 12,
    color: '#243746',
    fontWeight: '500'
  },
  descriptionRow: {
    marginTop: 4,
    flexDirection: 'row'
  },
  attachmentColumn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1
  },
  subDescription: {
    marginTop: 4
  },
  subDescriptionText: {
    fontSize: 12
  }
});

ScopeItem.propTypes = {
  item: propTypes.shape({
    Id: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    TagDescription: propTypes.string,
    Status: propTypes.string.isRequired,
    FormularType: propTypes.string,
    FormularGroup: propTypes.string,
    AttachmentCount: propTypes.number.isRequired
  }).isRequired
};

export default ScopeItem;
