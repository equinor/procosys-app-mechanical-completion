import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';

import SelectableListItem from './SelectableListItem';

/**
 * Renders a list of selectable items
 *
 * @class SelectableList
 * @extends {Component}
 */
const SelectableList = props => {
  let list = (
    <View style={{ flex: 1 }}>
      <FlatList
        data={props.items}
        keyExtractor={item => item.Id.toString()}
        extraData={props}
        initialNumToRender={props.initialItemsToRender}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => props.onSelect(item, index)}>
            <SelectableListItem
              title={item.Title}
              selected={props.selected && props.selected.Id === item.Id}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  if (!props.renderHeader) {
    return list;
  }
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          maxHeight: 40,
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          alignItems: 'center',
          backgroundColor: '#FFF'
        }}
      >
        <Text
          style={{
            flex: 1,
            paddingLeft: 10,
            fontSize: 22
          }}
        >
          {props.title || ''}
        </Text>
        {props.onFinish && (
          <TouchableOpacity
          style={{
            paddingRight: 10
          }}
          onPress={props.onFinish}
          disabled={!props.canFinish}
        >
          <Text
            style={[
              { textAlign: 'right' },
              !props.canFinish ? { opacity: 0.5 } : {}
            ]}
          >
            {props.finishTitle || 'Select'}
          </Text>
        </TouchableOpacity>
        )}
        
      </View>
      {list}
    </View>
  );
};

SelectableList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.any.isRequired,
      Title: PropTypes.string.isRequired
    })
  ),
  onSelect: PropTypes.func.isRequired,
  onFinish: PropTypes.func,
  canFinish: PropTypes.bool,
  finishTitle: PropTypes.string,
  selected: PropTypes.shape({
    Id: PropTypes.any.isRequired,
    Title: PropTypes.string.isRequired
  })
};

SelectableList.defaultProps = {
  selected: null,
  initialItemsToRender: 20,
  renderHeader: true,
  canFinish: true
};

export default SelectableList;
