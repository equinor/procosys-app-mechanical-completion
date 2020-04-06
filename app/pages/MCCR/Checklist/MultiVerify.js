import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView} from 'react-native';
import Checkbox from '../../../components/Checkbox';
import propTypes from 'prop-types';
import ApiService from '../../../services/api';
import AnalyticsService from '../../../services/AnalyticsService';

/**
 * MultiVerify module
 * 
 * @example
 * <MultiVerify checklists={[]} checklistId={123} />
 */
class MultiVerify extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checklists: [],
    }
  }

  componentDidMount() {
    AnalyticsService.trackEvent('MCCR_MULTIVERIFY_MODAL_SHOW');

    let checklists = this.props.checklists.map(checklist => {
      return {
        ...checklist,
        checked: false
      };
    });

    this.setState({
      checklists
    });
  }

  onPressVerify = () => {
    AnalyticsService.trackEvent('MCCR_MULTIVERIFY_MODAL_VERIFY');
    let checklists = this.state.checklists.filter((checklist) => checklist.checked);
    ApiService.multiVerifyChecklist(this.props.checklistId, checklists.map(checklist => checklist.Id), this.state.copyTableContents)
    .then(this.props.closeModal)
    .catch(err => {
      AnalyticsService.trackEvent('MCCR_MULTIVERIFY_MODAL_VERIFY_FAILED');
      Alert.alert("Failed to multi verify", err.data)
    });
  }

  onPressCancel = () => {
    AnalyticsService.trackEvent('MCCR_MULTIVERIFY_MODAL_CANCEL');
    this.props.closeModal();
  }

  hasCheckedItems = () => {
    return this.state.checklists.length > 0 && this.state.checklists.some(checklist => checklist.checked);
  }

  allItemsAreChecked = () => {
    return this.state.checklists.length > 0 && this.state.checklists.every(checklist => checklist.checked);
  }

  toggleCheckAll = () => {
    AnalyticsService.trackEvent('MCCR_MULTIVERIFY_MODAL_CHECK_ALL');
    let checklists = [...this.state.checklists];
    if (this.allItemsAreChecked()) {
      checklists.forEach(checklist => {
        checklist.checked = false;
      });
    } else {
      checklists.forEach(checklist => {
        checklist.checked = true;
      });
    }

    this.setState({checklists})
  }

  renderCheckboxes = () => {
    let checkboxModules = this.state.checklists.map((checklist, index) => {
      return <Checkbox label={checklist.TagNo} checked={checklist.checked} onPress={
        () => {
          let checklists = [...this.state.checklists];
          checklists[index].checked = !checklists[index].checked;
          this.setState({checklists})
        }
      } 
      key={`checkbox_${index}`}/>
    });
    return checkboxModules;
  }

  render() {
    let disabledButton = !this.hasCheckedItems();
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text>Do you want to verify these tags, having the same form, responsible, sheet and subsheet as well?</Text>
          <View style={styles.controllerContainer}>
            <Checkbox label="Check all" checked={this.allItemsAreChecked()} onPress={this.toggleCheckAll} />
          </View>
          <View style={styles.listContainer}>
            {this.renderCheckboxes()}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button]} onPress={this.onPressCancel}>
              <Text style={[styles.buttonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.primary, disabledButton && styles.buttonDisabled]} onPress={this.onPressVerify} disabled={disabledButton}>
              <Text style={[styles.buttonText,styles.primaryText]} >Verify selected</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22
  },
  controllerContainer: {
    margin: 15
  },
  listContainer: {
    margin: 15
  },
  buttonContainer: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#3A85B3'
  },
  buttonDisabled: {
    opacity: 0.6
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
  }
});

MultiVerify.propTypes = {
  checklists: propTypes.arrayOf(propTypes.shape({
    Id: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    Description: propTypes.string
  }))
}
export default MultiVerify;
