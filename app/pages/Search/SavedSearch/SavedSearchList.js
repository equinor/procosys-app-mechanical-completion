import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SEARCH_TYPE = {
  CHECKLIST: "Check Lists",
  PUNCH: "Punch List Items"
};

/**
 * Display a list adapted to the properties of a saved search. 
 * @example
 * <SavedSearchList
 *  items={[]}
 *  onSelect={() => {}}
 *  onDelete={() => {}}
 * />
 * @param {Object} props React Native props
 * 
 */
const SavedSearchList = props => {
  const punchIcon = <Icon name="ios-alert" size={20} color="#3A85B3" />;
  const checklistIcon = (
    <Icon name="ios-checkmark-circle" size={20} color="#3A85B3" />
  );

  const renderItem = ({ item }) => {
    let icon = item.type == SEARCH_TYPE.PUNCH ? punchIcon : checklistIcon;
    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={() => props.onSelect(item)}>
        <View style={styles.listItemIconContainer}>{icon}</View>
        <View style={styles.listItemContentContainer}>
          <View
            style={[
              styles.listItemTextContainer
            ]}
          >
            <Text style={styles.listItemTitle}>{item.name}</Text>
          </View>
          <View style={[styles.listItemTextContainer]}>
            <Text style={styles.listItemDescription}>{item.description}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.listItemIconContainer} onPress={() => props.onDelete(item)}>
          <Icon name="ios-trash" size={18} />
        </TouchableOpacity>
        <View style={styles.listItemIconContainer}>
          <Icon name="ios-arrow-forward" size={18} />
        </View>
      </TouchableOpacity>
    );
  };
  if (props.data.length <= 0) {
    return (<View style={styles.container}>
      <Text style={styles.noContentText}>No saved searches in ProCoSys</Text>
    </View>)
  }
  return (
    <FlatList
      data={props.data}
      renderItem={renderItem}
      keyExtractor={item => `srch_${item.id}`}
    />
  );
};

const styles = StyleSheet.create({
  noContentText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: 'center'
  },
  container: {
    justifyContent: 'center',
    paddingTop: 30,
    marginBottom: 30
  },
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  listItemContentContainer: {
    flex: 1,
  },
  listItemTextContainer: {
    flex: 1
  },
  listItemTitle: {
    fontWeight: 'bold',
    fontSize: 14
  },
  listItemDescription: {
    marginTop: 5,
    fontSize: 10
  }
});
export default SavedSearchList;
