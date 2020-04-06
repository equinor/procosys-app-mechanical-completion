import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },
  iconContainer: {
    justifyContent: 'center',
    width: 30
  }
});

const SelectableListItem = props => {
  let icon = <React.Fragment />;
  if (props.selected) {
    icon = <Icon name="md-checkmark" size={16} color="#000" />;
  }

  return (
    <View style={style.container}>
      <View style={style.textContainer}>
        <Text>{props.title}</Text>
      </View>
      <View style={style.iconContainer}>{icon}</View>
    </View>
  );
};

SelectableListItem.propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string
};

export default SelectableListItem;
