import React from 'react';
import { TouchableWithoutFeedback, Text, View, StyleSheet } from 'react-native';
import propTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * RadioButton
 *
 * @example
 * <RadioButton
 *  style={{ marginLeft: 10 }}
 *  onPress={() => {}}
 *  label="Tomato"
 *  checked={true}
 * />
 *
 * @class RadioButton
 * @extends {React.PureComponent}
 */

class RadioButton extends React.PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.container, this.props.style]}>
          {this.props.checked ? (
            <Icon name="ios-radio-button-on" style={styles.icon} size={14} />
          ) : (
            <Icon name="ios-radio-button-off" style={styles.icon} size={14} />
          )}

          <Text style={styles.text}> {this.props.label} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    marginLeft: 10
  }
});

RadioButton.propTypes = {
  onPress: propTypes.func.isRequired,
  label: propTypes.string,
  checked: propTypes.bool
};

RadioButton.defaultProps = {
  checked: false
};

export default RadioButton;
