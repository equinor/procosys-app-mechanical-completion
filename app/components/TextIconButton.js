import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import React from 'react';

const styles = {
  width: 30,
  height: 30
};

const TextIconButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        backgroundColor={props.backgroundColor}
        style={[styles, props.style]}
      >
        <Text style={itemStyle.text}>{props.iconText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const itemStyle = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 4,
    fontSize: 16,
    textAlign: 'center'
  }
});

TextIconButton.propTypes = {
  iconText: PropTypes.string.isRequired,
  size: PropTypes.number,
  onPress: PropTypes.func,
  style: PropTypes.object,
  color: PropTypes.string
};

export default TextIconButton;
