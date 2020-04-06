import React from 'react';
import { TouchableWithoutFeedback, Text, View, StyleSheet } from 'react-native';
import propTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Simple Checkbox
 *
 * @example
 * <Checkbox
 *  checked={true}
 *  onPress={(index) => {}}
 *  label="Check Me"
 *  style={{}}
 * />
 *
 * @class Checkbox
 * @extends {React.PureComponent}
 */
class Checkbox extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress} style={[this.props.style]}>
        <View style={[styles.container, this.props.style]}>
          <View style={styles.iconContainer}>
            {this.props.checked && (
              <Icon name="ios-checkmark" style={styles.icon} size={20} />
            )}
          </View>

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
  icon: {
    width: 20,
    height: 20, 
    paddingLeft: 1
  },
  iconContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    width: 12,
    height: 12,
    justifyContent: 'center',
    marginBottom: 1
  },
  text: {
    fontSize: 14
  }
});

Checkbox.propTypes = {
  initialValue: propTypes.bool,
  onPress: propTypes.func.isRequired,
  name: propTypes.string,
  label: propTypes.string
};

export default Checkbox;
