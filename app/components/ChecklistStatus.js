import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import propTypes from 'prop-types';

class ChecklistStatus extends React.PureComponent {
  getStatusImage(mcStatus) {
    switch (mcStatus) {
      case 'OK':
        return (
          <Image
            source={require('../../resources/images/status/CL-OK.png')}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      case 'PA':
        return (
          <Image
            source={require('../../resources/images/status/CL-PA.png')}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      case 'PB':
        return (
          <Image
            source={require('../../resources/images/status/CL-PB.png')}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      case 'OS':
        return (
          <Image
            source={require('../../resources/images/status/CL-OS.png')}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getStatusImage(this.props.status)}
        <View style={styles.textContainer}>
          {this.props.signed && (
            <Text style={[styles.handoverStatusText]}>S</Text>
          )}

          {this.props.verified && (
            <Text style={[styles.handoverStatusText]}>V</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  iconStyle: {
    height: 25,
    width: 25
  },
  textContainer: { flexDirection: 'row' },
  handoverStatusText: {
    fontSize: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingLeft: 2,
    paddingRight: 2,
    margin: 2
  },
  bold: {
    fontWeight: 'bold'
  }
});

ChecklistStatus.propTypes = {
  signed: propTypes.bool,
  verified: propTypes.bool,
  status: propTypes.string.isRequired
};

export default ChecklistStatus;
