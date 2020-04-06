import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';

const SearchButton = props => {
  return (
    <TouchableOpacity
      style={[styles.container, props.selected && styles.selected]}
      onPress={props.onSelect}
    >
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
};

SearchButton.defaultProps = {
  selected: false
};

SearchButton.propTypes = {
  selected: propTypes.bool,
  text: propTypes.string,
  onSelect: propTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    height: 56,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#3A85B3',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18
  },
  selected: {
    backgroundColor: '#D5EAF4'
  }
});

export default SearchButton;
