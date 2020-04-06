import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Checkmark = props => {
  if (props.checked && props.loading) {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderWidth: 2,
          borderColor: '#879199',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}
    >
      <View style={{
          width: 10,
          height: 10,
          borderWidth: 0,
          backgroundColor:  '#879199',
          borderRadius: 10
        }} />
    </View>
    )
  }
  if (props.checked) {
    return (
      <Icon
        name="ios-checkmark-circle"
        style={{ color: props.disabled ? '#EFEFEF': '#3A85B3' }}
        size={20}
      />
    );
  }

  return (
    <View
      style={{
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: props.disabled ? '#EFEFEF': '#3A85B3',
        borderRadius: 10
      }}
    />
  );
};

export default Checkmark;
