import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

import propTypes from 'prop-types';

import DialogueListItem from './DialogueListItem';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../../stylesheets/colors';

class SelectDialogue extends React.PureComponent {
  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
    this._renderEmptyList = this._renderEmptyList.bind(this);
    this._renderSelectedTitle = this._renderSelectedTitle.bind(this);
    this._renderModal = this._renderModal.bind(this);
    this.state = {
      showModal: false
    };
  }

  /**
   * Triggered when a listitem gets selected
   *
   * @param {*} item
   * @memberof SelectDialog
   */
  onItemSelect(item) {
    this.props.onValueChange(item);
    this.setState({ showModal: false });
  }

  /**
   * Returns a component indicating an empty dataset
   *
   * @returns
   * @memberof SelectDialog
   */
  _renderEmptyList() {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={{ opacity: 0.5 }}>No items available</Text>
        <TouchableOpacity
          style={{ flex: 1, marginTop: 20, height: 50 }}
          onPress={() => {
            this.setState({ showModal: false });
          }}
        >
          <Text style={styles.textLink}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Returns component to be rendered for each item in list
   *
   * @param {*} { item, index }
   * @returns Component
   * @memberof SelectDialog
   */
  _renderItem({ item, index }) {
    return (
      <DialogueListItem
        selected={this.props.selectedValue === item.value}
        onPress={this.props.onValueChange}
        title={item.label}
        value={item.value}
        index={index}
      />
    );
  }

  /**
   * Returns a component indicating which title value for the selected item to display.
   * Returns a default component if nothing is selected.
   *
   * @returns Component
   * @memberof SelectDialog
   */
  _renderSelectedTitle() {
    if (this.props.selectedValue && this.props.selectedValue != '') {
      const item = this.props.data.find(
        val => val.value === this.props.selectedValue
      );
      if (item) {
        return <Text style={styles.textStyle}>{item.label}</Text>;
      }
    }
    return (
      <Text style={[styles.textStyle, styles.defaultTitleText]}>Select</Text>
    );
  }

  /**
   * Render Modal Component
   *
   * @returns Component
   * @memberof SelectDialog
   */
  _renderModal() {
    const initialScrollIndex = this.props.data.findIndex(
      (val, index) => val.value === this.props.selectedValue
    );
    return (
      <Modal
        visible={this.state.showModal}
        transparent={true}
        onRequestClose={() => this.setState({ showModal: false })}
      >
        <View style={styles.dialogContainer}>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ showModal: false })}
          >
            <View style={styles.touchableDismissViewbox} />
          </TouchableWithoutFeedback>
          <View style={styles.listContainer}>
            <FlatList
              data={this.props.data}
              renderItem={this._renderItem}
              ListEmptyComponent={this._renderEmptyList}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index
              })}
              initialNumToRender={20}
              initialScrollIndex={initialScrollIndex}
              keyExtractor={(item, index) => `list_${index}`}
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ showModal: false })}
          >
            <View style={styles.touchableDismissViewbox} />
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }

  /**
   * Render component
   *
   * @returns Component
   * @memberof SelectDialog
   */
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dialogueActivator}
          onPress={() => this.setState({ showModal: true })}
        >
          {this._renderSelectedTitle()}
          <Icon name="ios-arrow-down" size={18} style={{ marginRight: 10 }} />
        </TouchableOpacity>
        {this._renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dialogueActivator: {
    padding: 10,
    backgroundColor: 'lightblue',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textLink: {
    color: colors.TEXT_CLICKABLE_COLOR
  },
  defaultTitleText: {
    opacity: 0.5
  },
  emptyListContainer: {
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 18,
    flex: 1
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    width: '80%',
    flex: 4,
    backgroundColor: '#FFF',
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1
  },
  touchableDismissViewbox: {
    flex: 2,
    width: '100%'
  }
});

SelectDialogue.propTypes = {
  data: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string.isRequired,
      value: propTypes.string.isRequired
    })
  ),
  selectedValue: propTypes.string,
  onValueChange: propTypes.func.isRequired
};

export default SelectDialogue;
