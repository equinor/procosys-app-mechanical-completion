import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import propTypes from 'prop-types';

class InputHistoryContainer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let listItems = this.props.history.map((item, index) => {
      return (
        <TouchableOpacity onPress={() => this.props.onSelect(item)} key={`${this.props.storageKey}_${index}`}>
          <Text style={{paddingHorizontal: 10, fontSize: 16, paddingVertical: 20}}>{item}</Text>
        </TouchableOpacity>
      )
    });
    return (
      <View style={{backgroundColor: '#FFF', minHeight: 0}}>
        {listItems}
      </View>
    );
  }
}

InputHistoryContainer.propTypes = {
  onSelect: propTypes.func.isRequired,
  storageKey: propTypes.string.isRequired,
  history: propTypes.arrayOf(propTypes.string).isRequired
}

export default InputHistoryContainer;
