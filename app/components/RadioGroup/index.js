import React from 'react';
import { View, StyleSheet } from 'react-native';
import propTypes from 'prop-types';
import RadioButton from './RadioButton';

/**
 * Renders a set of radio buttons and reports back which one gets activated
 * while still maintaining single option selected
 *
 * @example
 * <RadioGroup
 *  data={[{label: 'test label'}]}
 *  initialIndex={0}
 *  onChange={(index, group) => {}}
 *  group="MyGroup"
 * />
 *
 * @class RadioGroup
 * @extends {React.PureComponent}
 */

class RadioGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.state = {};
  }

  componentDidMount() {
    this.setState({ selectedIndex: this.props.initialIndex });
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.state.selectedIndex != oldState.selectedIndex) {
      this.props.onChange(this.state.selectedIndex, this.props.group);
    }
  }

  onSelect(index) {
    this.setState({ selectedIndex: index });
  }

  render() {
    let items = this.props.data.map((item, index) => {
      return (
        <RadioButton
          style={[{marginRight: 15}, this.props.style]}
          key={`radiobtn_${index}`}
          onPress={() => this.onSelect(index)}
          label={item.label}
          checked={index == this.state.selectedIndex}
        />
      );
    });

    return <View style={styles.container}>{items}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

RadioGroup.propTypes = {
  data: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string.isRequired
    }).isRequired
  ),
  group: propTypes.string,
  onChange: propTypes.func.isRequired,
  initialIndex: propTypes.number.isRequired
};

RadioGroup.defaultProps = {
  data: [],
  initialIndex: 0
};

export default RadioGroup;
