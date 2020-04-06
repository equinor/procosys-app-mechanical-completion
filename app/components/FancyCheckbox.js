import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text, Animated } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../stylesheets/colors';

class FancyCheckbox extends Component {
  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);
  }
  state = {
    positionX: new Animated.Value(this.props.checked ? 32 : 0)
  };

  componentDidUpdate(oldProps) {
    if (this.props.checked != oldProps.checked) {
      this.animate();
    }
  }

  animate() {
    // 0 = Unchecked
    // 32 = Checked
    let animationOptions = {
      toValue: this.props.checked ? 32 : 0,
      duration: 300
    };

    Animated.timing(this.state.positionX, animationOptions).start();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View
          style={{
            width: 60,
            maxWidth: 60,
            height: 32,
            maxHeight: 32,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              flex: 1,
              maxHeight: 20,
              maxWidth: 54,
              borderRadius: 4,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: '#D5EAF4'
            }}
          >
            <Text
              style={{
                flex: 1,
                paddingLeft: 5,
                fontSize: 12,
                color: Colors.TEXT_COLOR
              }}
            >
              {this.props.checkedText}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                paddingRight: 5,
                fontSize: 12,
                color: Colors.TEXT_COLOR
              }}
            >
              {this.props.uncheckedText}
            </Text>
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              left: this.state.positionX,
              top: 0,
              width: 32,
              maxHeight: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#FFF',
              borderWidth: 1,
              borderColor: Colors.BORDER_COLOR
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

FancyCheckbox.propTypes = {
  checked: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  checkedText: PropTypes.string,
  uncheckedText: PropTypes.string
};

FancyCheckbox.defaultProps = {
  checked: false,
  checkedText: 'Yes',
  uncheckedText: 'No'
};

export default FancyCheckbox;
