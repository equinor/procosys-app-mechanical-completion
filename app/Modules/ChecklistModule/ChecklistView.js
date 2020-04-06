import React from 'react';

import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert
} from 'react-native';
import ChecklistItem from './ChecklistItem';
import Checkmark from './Checkmark';
import ApiService from '../../services/api';
import AnalyticsService from '../../services/AnalyticsService';
import _isEqual from 'lodash.isequal';

const CHECK_ITEM_STATE = {
  NA: "NA",
  OK: "OK",
  DELETE: "DELETE",
  NONE: "NONE"
}
function CheckItemUpdate(itemId, checkItemState) {
    if (!CHECK_ITEM_STATE[checkItemState]) {
      throw new Exception("Invalid parameter value for check item state");
    }
    this.id = itemId;
    this.checkItemState = checkItemState;
}

/**
 * Render e checklist administrator
 * Acts as a module and is self-contained, interacting with the API.
 * 
 * @example
 * <ChecklistView
 *  checkItems={[...CheckItems]}
 *  checklist={Object}
 *  customCheckItems={[customCheckItems]}
 *  refresh={() => {}}
 *  disableCustomCheckItem={true}
 * />
 */
class ChecklistView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newCheckItemText: '',
      requestsInProgress: [],
    };
  }

  componentDidUpdate(prevProps) {
      if(!_isEqual(prevProps.checkItems,this.props.checkItems)) {
        this.setState({
          requestsInProgress: []
        })
      }
      
  }


  addRequestInProgress = (checkItemUpdate) => {
    this.setState(oldState => {
      return {
        ...oldState,
        requestsInProgress: [...oldState.requestsInProgress, checkItemUpdate]
      }
    })
  }

  onPressNA = (item) => {
    
    if (this.props.checklist.IsRestrictedForUser) {
      Alert.alert("Restricted", "This checklist is restricted");
      return;
    }

    if (item.IsOk) {
      item.IsOk = false;
    }
    AnalyticsService.trackEvent('CHECKLIST_TOGGLE_NA', {
      value: !item.IsNotApplicable
    });
    const requestInProgress = new CheckItemUpdate(item.Id, !item.IsNotApplicable ? CHECK_ITEM_STATE.NONE : CHECK_ITEM_STATE.NA);
    this.addRequestInProgress(requestInProgress)
    ApiService.setCheckItemStatus(
      this.props.checklist.Id,
      item.Id,
      item.IsOk,
      !item.IsNotApplicable,
      item.isCustom
    )
      .then(result => {
        this.props.refresh();
      })
      .catch(err => {
        if (err.status === 403) {
          Alert.alert("Missing privileges", "You dont have access to edit this checklist");
        } else {
          Alert.alert(`Error (${err.status})`, err.data);
        }
      });
  }

  canEdit = () => {
    const {checklist} = this.props;
    return !checklist.IsRestrictedForUser && !checklist.VerifiedAt && !checklist.SignedAt;
  }

  onPressOk = (item) => {
    if (this.props.checklist.IsRestrictedForUser) {
      Alert.alert("Restricted", "This checklist is restricted");
      return;
    }

    if (item.IsNotApplicable) {
      item.IsNotApplicable = false;
    }

    AnalyticsService.trackEvent('CHECKLIST_TOGGLE_OK', {
      value: !item.IsOk
    });
    const requestInProgress = new CheckItemUpdate(item.Id, !item.IsOk ? CHECK_ITEM_STATE.NONE : CHECK_ITEM_STATE.OK);
    this.addRequestInProgress(requestInProgress)
    ApiService.setCheckItemStatus(
      this.props.checklist.Id,
      item.Id,
      !item.IsOk,
      item.IsNotApplicable,
      item.isCustom
    )
      .then(result => {
        this.props.refresh();
      })
      .catch(err => {
        if (err.status === 403) {
          Alert.alert("Missing privileges", "You dont have access to edit this checklist");
        } else {
          Alert.alert(`Error (${err.status})`, err.data);
        }
        
      });
  }

  onPressDelete = (item) => {
    Alert.alert("Delete check item", "Are you sure you want to delete this check item?", [
      {
        text: "Delete",
        onPress: () => {
          const requestInProgress = new CheckItemUpdate(item.Id, CHECK_ITEM_STATE.DELETE);
          this.addRequestInProgress(requestInProgress);
          AnalyticsService.trackEvent('CHECKLIST_DELETE_CHECKITEM');
          ApiService.deleteCustomCheckItem(this.props.checklist.Id, item.Id)
          .then(this.props.refresh)
          .catch(err => {
            if (err.status === 403) {
              Alert.alert("Missing privileges", "You dont have access to edit this checklist");
            } else {
              Alert.alert("Unable to delete check item", err.data);
            }
          });
        }
        
      }, {
        text: "Cancel", 
        onPress: null
      }
    ])
    
  }

  onUpdateMetaTable = (checkitemId,rowId, columnId, value) => {
    AnalyticsService.trackEvent('CHECKLIST_UPDATE_METATABLE');
    ApiService.updateMetatableValueForChecklist(this.props.checklist.Id, checkitemId,rowId, columnId, value)
    .catch(err => {
      if (err.status === 403) {
        Alert.alert("Missing privileges", "You dont have access to edit this checklist");
      } else {
        Alert.alert("Unable to update metatable", err.data);
      }
    })
  }

  onPressCheckAll = () => {
    AnalyticsService.trackEvent('CHECKLIST_ITEM_CHECK_ALL');
    if (this.props.checklist.IsRestrictedForUser) {
      Alert.alert("Restricted", "This checklist is restricted");
      return;
    }
    let allItemsAreChecked = this.allItemsChecked();
    let promises = this.props.checkItems
      .concat(this.props.customCheckItems)
      .filter(item => !item.IsHeading)
      .map(item => {
        const requestInProgress = new CheckItemUpdate(item.Id, !allItemsAreChecked ? CHECK_ITEM_STATE.OK : CHECK_ITEM_STATE.NONE);
        this.addRequestInProgress(requestInProgress);
        return ApiService.setCheckItemStatus(
          this.props.checklist.Id,
          item.Id,
          !allItemsAreChecked,
          false,
          item.isCustom
        )
      });
    Promise.all(promises)
      .catch(err => {
        Alert(
          'Error',
          'Not all elements could be updated, please check manually'
        );
      })
      .then(() => this.props.refresh());
  }

  allItemsChecked = () => {
    return !this.props.checkItems
      .concat(this.props.customCheckItems)
      .filter(item => !item.IsHeading)
      .some(item => !item.IsOk);
  }

  onPressAddNewCheckItem = () => {
    AnalyticsService.trackEvent('CHECKLIST_ADD_CUSTOM_CHECKITEM');
    ApiService.addCustomCheckItem(this.props.checklist.Id, this.state.newCheckItemText, false).then(result => {
      this.setState({newCheckItemText: ''}, this.props.refresh);
    }).catch(err => {
      if (err.status === 403) {
        Alert.alert("Missing privileges", "You dont have access to edit this checklist");
      } else {
        Alert.alert(`Error (${err.status})`, "Could not add new checklist item \n " + err.data);
      }
    });
  }

  renderNonElectronicForm = () => {
    AnalyticsService.trackEvent('CHECKLIST_NON_ELECTRONIC_LOADED');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center' }}>
          This checklist does not support electronic forms
        </Text>
      </View>
    );
  }

  renderCheckItems = () => {
    let items = [...this.props.checkItems,...this.props.customCheckItems];
    const canEdit = this.canEdit();
    let components = items.map((checkItem, index) => {
      const item = {...checkItem};
      item.isCustom = item.IsNotApplicable === undefined;
      const elementInQueue = this.state.requestsInProgress.find((el) => el.id == item.Id);
      if (elementInQueue) {
        switch(elementInQueue.checkItemState) {
          case CHECK_ITEM_STATE.OK:
            item.IsOk = true;
            item.IsNotApplicable = false;
            break;
          case CHECK_ITEM_STATE.NA: 
            item.IsOk = false;
            item.IsNotApplicable = true;
            break;
          case CHECK_ITEM_STATE.NONE:
          default:
            // Nothing, just show a loading state
        }
      }
      return (
        <View
          style={styles.checklistItemContainer}
          key={`ChecklistItem_${index}`}
        >
          <ChecklistItem
            disabled={!canEdit}
            checkItem={item}
            loading={elementInQueue ? true : false}
            onPressOk={() => this.onPressOk(item)}
            onPressNA={() => this.onPressNA(item)}
            onPressDelete={() => this.onPressDelete(item)}
            onUpdateMetaTable={(rowId, columnId, value) => this.onUpdateMetaTable(item.Id, rowId, columnId,value)}
          />
        </View>
      );
    });
    return components;
  }

  render() {
    if (!this.props.checklist) {
      return <View />;
    }
    if (this.props.checklist && !this.props.checklist.HasElectronicForm) {
      return this.renderNonElectronicForm();
    }
    const canEdit = this.canEdit();
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{marginLeft: 35, flexDirection: 'row'}}>
            <View style={{flex: 2, justifyContent: 'center'}}>
              <Text>Check all</Text>
            </View>
            <View style={styles.headerCheckboxes}>
              <View style={styles.headerCheckbox}>
                <Text>Checked</Text>
                <TouchableWithoutFeedback onPress={this.onPressCheckAll} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} disabled={!canEdit}>
                  <View style={{paddingTop: 5, paddingBottom: 5}}>
                    <Checkmark checked={this.allItemsChecked()} disabled={!canEdit} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.headerCheckbox}>
                <Text>NA</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.checklistContainer}>
          {this.renderCheckItems()}
          {(!this.props.disableCustomCheckItem && canEdit) && (
            <View style={[styles.newCheckItemContainer]}>
              <Text>Add new check item</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.newCheckItemInput}
                  placeholder="Type here"
                  value={this.state.newCheckItemText}
                  onChangeText={(text) => this.setState({newCheckItemText: text})}
                />
                <TouchableOpacity style={styles.newCheckItemButton} onPress={this.onPressAddNewCheckItem}>
                  <Text style={styles.newCheckItemButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
            
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checklistContainer: {
    flex: 1
  },
  header: {
    marginBottom: 5
  },
  headerRow: {
    flexDirection: 'row',
    marginTop: 5
  },
  headerCheckboxes: {
    flexDirection: 'row',
    minWidth: 100, 
    justifyContent: 'space-between'
  },
  headerText: {
    color: '#879199',
    fontSize: 14
  },
  spacer: {
    flex: 3
  },
  headerCheckboxText: {
    flex: 1
  },
  headerCheckbox: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  checklistItemContainer: {
    flexDirection: 'row',
    minHeight: 72,
    paddingTop: 15,
    paddingLeft: 15,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)'
  },
  newCheckItemContainer: {
    margin: 15,
    flex: 1
  },
  newCheckItemInput: {
    borderWidth: StyleSheet.hairlineWidth,
    height: 48,
    marginTop: 1,
    flex: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  newCheckItemButton: {
    height: '100%',
    backgroundColor: '#E3E5E7',
    margin: 5,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 4
  },
  newCheckItemButtonText: {
    textAlign: 'center',
    fontSize: 18
  }
});

ChecklistView.propStyle = {};
ChecklistView.defaultProps = {
  checklist: null,
  checkItems: [],
  customCheckItems: []
};

export default ChecklistView;
