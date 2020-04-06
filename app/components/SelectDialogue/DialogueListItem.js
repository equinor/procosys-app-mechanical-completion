import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import colors from '../../../stylesheets/colors';

class DialogueListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPress(this.props.value, this.props.index);
  };

  render() {
    const backgroundColor = this.props.selected ? '#D5EAF4' : '#FFF';
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={[styles.textContainer, { backgroundColor }]}>
          <Text>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    padding: 5,
    paddingLeft: 15,
    borderBottomColor: colors.BORDER_COLOR,
    borderBottomWidth: 1,
    height: 50,
    maxHeight: 50,
    justifyContent: 'center'
  }
});

export default DialogueListItem;
