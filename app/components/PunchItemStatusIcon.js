import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import propTypes from 'prop-types';

/**
 * Punch Item Status Icon
 * 
 * @example
 * <PunchItemStatusIcon type="PA" cleared={false} verified={false} />
 */
class PunchItemStatusIcon extends React.PureComponent {
  getIcon(PunchType) {
    switch (PunchType) {
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
      default:
        return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.getIcon(this.props.type)}
        <View style={styles.textContainer}>
          {this.props.cleared && (
            <Text style={[styles.statusText]}>C</Text>
          )}

          {this.props.verified && (
            <Text style={[styles.statusText]}>V</Text>
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
  statusText: {
    fontSize: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 2,
    margin: 2
  },
  bold: {
    fontWeight: 'bold'
  }
});

PunchItemStatusIcon.propTypes = {
  type: propTypes.string.isRequired,
  cleared: propTypes.bool,
  verified: propTypes.bool
};

PunchItemStatusIcon.defaultProps = {
  cleared: false,
  verified: false
}

export default PunchItemStatusIcon;
