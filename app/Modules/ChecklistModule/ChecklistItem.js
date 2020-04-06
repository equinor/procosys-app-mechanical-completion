import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import Checkmark from './Checkmark';
import MetaTable from './MetaTable';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * @example
 <ChecklistItem 
 onPressOk={() => {}} 
 onPressNA={() => {}} 
 onPressDelete={() => {}}
 loading={false}
 checkitem={item} />
 *
 * @class ChecklistItem
 * @extends {React.PureComponent}
 */
class ChecklistItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  toggleOk = () => {
    this.props.onPressOk();
  }

  toggleNA = () => {
    this.props.onPressNA();
  }

  delete = () => {

    this.props.onPressDelete();
  }

  onUpdateMetaTableColumn = (rowId, columnId, value) => {
    this.props.onUpdateMetaTable(rowId, columnId, value);
  }

  renderHeading(item) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.checklistItemText}>
          <Text>{item.Text}</Text>
        </View>
      </View>
    );
  }

  render() {
    let item = this.props.checkItem;
    if (item.IsHeading) {
      return this.renderHeading(item);
    }
    if (item.isCustom) {
      item.SequenceNumber = item.ItemNo;
    }

    let metaTable = null;
    if (item.HasMetaTable) {
      metaTable = <MetaTable data={item.MetaTable} onUpdateMetaTableColumn={this.onUpdateMetaTableColumn} disabled={this.props.disabled} />;
    }

    let color = this.props.disabled ? "#EFEFEF": "#000";
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={styles.checklistItemIndex}>
            <Text style={[styles.checklistItemIndexText, this.props.loading && styles.loadingText]}>
              {item.SequenceNumber}
            </Text>
          </View>
          <View style={[styles.checklistItemTextContainer]}>
            <Text style={[this.props.loading && styles.loadingText]}>{item.Text}</Text>
          </View>
          <View style={styles.checklistItemCheckboxContainer}>
            <TouchableWithoutFeedback onPress={this.toggleOk} disabled={this.props.disabled}>
              <View style={styles.checkboxContainer}>
                <Checkmark checked={item.IsOk} disabled={this.props.disabled} loading={this.props.loading} />
              </View>
            </TouchableWithoutFeedback>
            {!item.isCustom && (
              <TouchableWithoutFeedback onPress={this.toggleNA} disabled={this.props.disabled}>
                <View style={styles.checkboxContainer}>
                  <Checkmark checked={item.IsNotApplicable} disabled={this.props.disabled} loading={this.props.loading} />
                </View>
              </TouchableWithoutFeedback>
            )}
            {item.isCustom && (
              
              <TouchableWithoutFeedback onPress={this.delete} disabled={this.props.disabled}>
                <View style={styles.checkboxContainer}>
                  <Icon name="ios-trash" size={20} color={color}/>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        {metaTable}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checklistItemIndex: {
    maxWidth: 25,
    width: 25
  },
  checklistItemIndexText: {
    fontSize: 17
  },
  checklistItemTextContainer: {
    flex: 1
  },
  loadingText: {
    color: '#879199',
  },
  checkboxContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistItemCheckboxContainer: {
    minWidth: 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
});

ChecklistItem.defaultProps = {
  checkItem: {},
  disabled: false,
  loading: false
};

export default ChecklistItem;
