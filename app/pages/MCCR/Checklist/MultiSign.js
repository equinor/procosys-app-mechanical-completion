import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView} from 'react-native';
import Checkbox from '../../../components/Checkbox';
import propTypes from 'prop-types';
import ApiService from '../../../services/api';
import AnalyticsService from '../../../services/AnalyticsService';

/**
 * Multisign module
 * 
 * @example
 * <MultiSign checklists={[]} checklistId={123} />
 */
class MultiSign extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checklists: [],
      copyTableContents: false
    }
  }

  componentDidMount() {
    AnalyticsService.trackEvent('MCCR_MULTISIGN_MODAL_SHOW');
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

  onPressSign = () => {
    AnalyticsService.trackEvent('MCCR_MULTISIGN_MODAL_SIGN');
    let checklists = this.state.checklists.filter((checklist) => checklist.checked);
    ApiService.multiSignChecklist(this.props.checklistId, checklists.map(checklist => checklist.Id), this.state.copyTableContents)
    .then(this.props.closeModal)
    .catch(err => Alert.alert("Failed to multisign", err.data));
  }

  onPressCancel = () => {
    AnalyticsService.trackEvent('MCCR_MULTISIGN_MODAL_CANCEL');
    this.props.closeModal();
  }

  hasCheckedItems = () => {
    return this.state.checklists.length > 0 && this.state.checklists.some(checklist => checklist.checked);
  }

  allItemsAreChecked = () => {
    return this.state.checklists.length > 0 && this.state.checklists.every(checklist => checklist.checked);
  }

  toggleCheckAll = () => {
    AnalyticsService.trackEvent('MCCR_MULTISIGN_MODAL_CHECK_ALL');
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

  toggleCopyTableContents = () => {
    AnalyticsService.trackEvent('MCCR_MULTISIGN_MODAL_COPY_TABLE_CONTENTS');
    this.setState({copyTableContents: !this.state.copyTableContents});
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
          <Text>Do you want to sign these tags, having the same form, responsible, sheet and subsheet as well?</Text>
          <View style={styles.controllerContainer}>
            <View>
              <Checkbox label="Check all" checked={this.allItemsAreChecked()} onPress={this.toggleCheckAll} />
            </View>
            <View>
              <Checkbox label="Copy table contents" checked={this.state.copyTableContents} onPress={this.toggleCopyTableContents} />
            </View>
          </View>
          <View style={styles.listContainer}>
            {this.renderCheckboxes()}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button]} onPress={this.onPressCancel}>
              <Text style={[styles.buttonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.primary, disabledButton && styles.buttonDisabled]} onPress={this.onPressSign} disabled={disabledButton}>
              <Text style={[styles.buttonText,styles.primaryText]} >Sign selected</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15,
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

MultiSign.propTypes = {
  checklists: propTypes.arrayOf(propTypes.shape({
    Id: propTypes.number.isRequired,
    TagNo: propTypes.string.isRequired,
    Description: propTypes.string
  }))
}
export default MultiSign;
