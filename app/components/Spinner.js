import React from 'react';
import { PropTypes } from 'prop-types';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
});

const Spinner = ({ size, style, color, text, textColor }) => {
  let textNode = <React.Fragment />;
  if (text) {
    textNode = <Text style={{ color: textColor || '#000' }}>{text}</Text>;
  }
  return (
    <View style={[styles.spinnerStyle, style]}>
      <ActivityIndicator size={size} color={color} />
      {textNode}
    </View>
  );
};
Spinner.propTypes = {
  size: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string
};

Spinner.defaultProps = {
  size: 'large',
  style: {},
  color: 'gray'
};

export default Spinner;
