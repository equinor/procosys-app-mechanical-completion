import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';

const styles = {
  paddingLeft: 15,
  paddingRight: 15
};

const IconButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Icon
        name={props.icon}
        size={props.size || 15}
        color={props.color || '#000'}
        style={[styles, props.style]}
      />
    </TouchableOpacity>
  );
};
IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object,
  color: PropTypes.string
};

export default IconButton;
