import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import propTypes from 'prop-types';
import images from 'resources/images';

class MCStatus extends React.PureComponent {
  getStatusImage(mcStatus) {
    switch (mcStatus) {
      case 'OK':
        return (
          <Image
            source={images.Ok}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      case 'PA':
        return (
          <Image
            source={require('../../resources/images/status/PA.png')}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      case 'PB':
        return (
          <Image
            source={require('../../resources/images/status/PB.png')}
            style={styles.iconStyle}
            resizeMode="contain"
          />
        );
      case 'OS':
        return (
          <Image
            source={require('../../resources/images/status/OS.png')}
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
        {this.getStatusImage(this.props.mcStatus)}
        <Text style={styles.textContainer}>
          <Text
            style={[
              styles.handoverStatusText,
              this.props.commissioningHandoverStatus == 'ACCEPTED' &&
                styles.bold
            ]}
          >
            {this.props.commissioningHandoverStatus != 'NOCERTIFICATE' && 'C'}
          </Text>
          <Text
            style={[
              styles.handoverStatusText,
              this.props.operationHandoverStatus == 'ACCEPTED' && styles.bold
            ]}
          >
            {this.props.operationHandoverStatus != 'NOCERTIFICATE' && 'O'}
          </Text>
        </Text>
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
  textContainer: {},
  handoverStatusText: {
    fontSize: 16
  },
  bold: {
    fontWeight: 'bold'
  }
});

MCStatus.propTypes = {
  operationHandoverStatus: propTypes.string,
  commissioningHandoverStatus: propTypes.string,
  mcStatus: propTypes.string.isRequired
};

export default MCStatus;
