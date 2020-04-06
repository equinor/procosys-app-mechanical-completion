import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Colors from '../../../stylesheets/colors';
import SavedSearchList from './SavedSearchList';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';

class SavedSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      savedSearchList: [],
      loading: true
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData = async () => {
    this.setState({
      loading: true
    });
    try {
      let data = await ApiService.getSavedSearchesList();
      let normalizedData = data.map(search => ({
        id: search.Id,
        name: search.Name,
        description: search.Description,
        type: search.Type
      }));

      this.setState({
        savedSearchList: normalizedData,
      });

    } catch (err) {
      Alert.alert("Failed request", "Failed to get saved searches");
    }
    this.setState({
      loading: false
    })
  }

  onSelect = (item) => {
    if (item.type === "Check Lists") {
      this.props.navigation.navigate("SavedSearchChecklist", {data: item});
    } else if (item.type === "Punch List Items") {
      this.props.navigation.navigate("SavedSearchPunchItems", {data: item});
    } else {
      Alert.alert("Unknown search", "Only Checklist and Punch Item searches are supported for now");
    }
    
  }

  onDelete = async (item) => {
    const BUTTON_OK = {
      text: 'Yes',
      onPress: async () => {
        try {
          await ApiService.deleteSavedSearch(item.id);
          this.refreshData();
        } catch (err) {
          Alert.alert("Failed to delete", `Unable to delete the saved search ${err.status}`);
        }
      }
    };

    const BUTTON_CANCEL = {
      text: 'Cancel',
      onPress: () => {
        // No-op
      }
    }
    Alert.alert("Delete search", "Are you sure you want to delete this saved search?",[BUTTON_OK, BUTTON_CANCEL])
    
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.text,
                ]}
              >
                Saved Searches
              </Text>
            </View>
          </View>
          {!this.state.loading && (<SavedSearchList data={this.state.savedSearchList} onSelect={this.onSelect} onDelete={this.onDelete} />)}
          {this.state.loading && (<Spinner text="Loading saved searches" />)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20
  },
  textContainer: {},
  text: {
    fontSize: 18,
    color: '#3A85B3'
  },
});

export default SavedSearch;
