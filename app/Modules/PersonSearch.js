import React, {Component} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Alert, FlatList, TouchableOpacity } from 'react-native';
import ApiService from '../services/api';
import AutoSubmitTextInput from '../components/AutoSubmitTextInput/AutoSubmitTextInput';
import colors from '../stylesheets/colors';
import Icon from 'react-native-vector-icons/Ionicons';


import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';


class PersonSearch extends Component {

  constructor(props) {
    super(props);

    this.state = {
      persons: [],
      loading: false,
      selectedPerson: null
    };

  }

  onSubmitSearch = (text) => {
    this.setState({
      loading: true
    })
    ApiService.getPersonsByName(text).then((result) => {
      this.setState({persons: result});
    }).catch(err => {
      Alert.alert('Failed to get persons');
    }).finally(() => {
      this.setState({loading: false})
    })
  }

  renderPersonRow = ({item}) => {
    const isSelected = (this.state.selectedPerson && this.state.selectedPerson.Id === item.Id);
    return (
      <TouchableOpacity onPress={() => this.selectPerson(item)}>
        <View style={[styles.personContainer, isSelected && styles.selected]} key={item.Id}>
          <Text style={styles.personRowText}>{item.FirstName} {item.LastName}</Text>
          {isSelected && (
            <Icon name="ios-checkbox-outline" size={20} />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  selectPerson = (person) => {
    this.setState({
      selectedPerson: person
    })
  }

  onCancel = () => {
    this.props.onSelect(null);
  }

  onSubmit = () => {
    this.props.onSelect(this.state.selectedPerson);
  }

  render() {
    const hasSelectedPerson = this.state.selectedPerson != null;
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 4}}>

        
        <Text style={styles.heading}>Person Search</Text>
        <AutoSubmitTextInput
          style={styles.searchbox}
          onSubmit={this.onSubmitSearch}
          delay={3000}
          placeholder="Type to search persons"
          useHistory="Person"
        />
        {this.state.loading && (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Spinner /></View>
        )}
        <FlatList 
          data={this.state.persons}
          renderItem={this.renderPersonRow}
          keyExtractor={(item) => `p_${item.Id}`}
          extraData={this.state.selectedPerson}
        />
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <TouchableOpacity  onPress={this.onSubmit} disabled={!hasSelectedPerson}>
              <View style={[buttonStyle.button,buttonStyle.primary, !hasSelectedPerson && buttonStyle.disabled]}>
                <Text style={[buttonStyle.buttonText, buttonStyle.primaryText]}>Select</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={this.onCancel}>
              <View style={[buttonStyle.button]}>
                <Text style={[buttonStyle.buttonText]}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PAGE_BACKGROUND,
  },
  personContainer: {
    padding: 10,
    borderBottomColor: colors.BORDER_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center'
  },
  personRowText: {
    flex: 1,
    fontSize: 20,
    padding: 10
  },
  heading: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    borderBottomColor: colors.BORDER_COLOR
  },
  selected: {
    backgroundColor: colors.BORDER_COLOR
  },
  searchbox: {
    backgroundColor: '#FFF',
    paddingLeft: 15,
    height: 48,
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1
  },
})

const buttonStyle = StyleSheet.create({
  button: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#3A85B3'
  },
  primary: {
    backgroundColor: '#3A85B3'
  },
  buttonText: {
    fontSize: 18,
    padding: 15
  },
  primaryText: {
    color: '#FFF'
  },
  disabled: {
    backgroundColor: colors.BORDER_COLOR,
    borderColor: colors.BORDER_COLOR
  }
})

PersonSearch.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default PersonSearch;
