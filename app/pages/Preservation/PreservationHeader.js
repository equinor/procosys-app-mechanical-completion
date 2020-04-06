import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import propTypes from 'prop-types';
import ChecklistStatus from '../../components/ChecklistStatus';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from '../../components/Spinner';

class MCCRHeader extends React.PureComponent {
  render() {
    const { item } = this.props;
    if (!item) {
      return (
        <View style={itemStyle.container}>
          <Spinner />
        </View>
      )
    }
    return (
      <View
        style={itemStyle.container}
      >
        <View style={itemStyle.statusContainer}>
          <ChecklistStatus
            status={item.Status}
            signed={item.SignedAt != null}
            verified={item.VerifiedAt != null}
          />
        </View>
        <View style={itemStyle.infoContainer}>
          <View style={itemStyle.detailsRow}>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemHeader]}>
              {item.McPkgNo}
            </Text>
            <Text style={itemStyle.infoItem}>{item.FormularType}</Text>
            <Text style={[itemStyle.infoItem, itemStyle.infoItemLast]}>
              {item.ResponsibleCode}
            </Text>
          </View>
          <View style={itemStyle.detailsRow}>
            <Text style={[itemStyle.infoItem, itemStyle.subHeaderText]}>
              {item.TagNo}
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
                  style={{ transform: [{ rotate: '-30deg' }], marginLeft: 4 }}
                />
              </View>
          </View>
        </View>
      </View>
    );
  }
}

const itemStyle = StyleSheet.create({
  container: {
    maxHeight: 72,
    minHeight: 72,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 4,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth
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
    flex: 2,
    fontSize: 16,
    color: '#3A85B3'
  },
  descriptionText: {
    fontSize: 10,

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
    marginTop: 4,
    
  },
  subHeaderText: {
    fontSize: 12,
    color: '#243746',
    fontWeight: '500'
  }
});

MCCRHeader.propTypes = {
  item: propTypes.shape({
    Id: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    TagDescription: propTypes.string,
    Status: propTypes.string.isRequired,
    FormularType: propTypes.string,
    FormularGroup: propTypes.string
  })
};

export default MCCRHeader;
