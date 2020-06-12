import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, TextInput, Modal, SafeAreaView, DatePickerAndroid} from 'react-native';
import DatePickerModal from '../../../components/DatepickerModal';

import ModalDropdown from '../../../components/ModalDropdown';
import colors from '../../../stylesheets/colors';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';
import Attachments from '../../../components/Attachments';
import AttachmentService from '../../../services/AttachmentService';
import { Exception } from '../../../utils/Exception';
import AnalyticsService from '../../../services/AnalyticsService';
import PersonSearch from '../../PersonSearch';

class CreatePunchItemView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      punchDetails: {
        ClearingByCode: null,
        RaisedByCode: null,
        TypeCode: null,
        Status: null,
        Sorting: null,
        Priority: null,
        Description: '',
        Estimate: '',
        DueDate: null,
        ActionByPerson: null
      },
      attachments: [],
      categories: null,
      priorities: null,
      sortings: null,
      types: null,
      organizations: null,
      editable: false,
      loadingAttachments: false,
      saving: false,
      showActionByPersonModal: false
    };

  }

  componentDidMount() {
    AnalyticsService.trackEvent('PUNCH_INIT_CREATE');
    const categoriesPromise = ApiService.getPunchItemCategories();
    const sortingsPromise = ApiService.getPunchItemSortings();
    const typesPromise = ApiService.getPunchItemTypes();
    const organizationsPromise = ApiService.getPunchItemOrganizations();
    const prioritiesPromise = ApiService.getPunchPriorities();

    Promise.all([categoriesPromise,sortingsPromise,typesPromise,organizationsPromise,prioritiesPromise])
    .then((result) => {
      this.setState({
        categories: result[0], 
        sortings: result[1], 
        types: result[2], 
        organizations: result[3],
        priorities: result[4],
        editable: true
      })
    }).catch(err => {
      if (err.status === 403) {
        Alert.alert("Missing privileges", "You dont have access to perform this action");
      } else {
        AnalyticsService.trackEvent('PUNCH_DATA_FAILED');
        Alert.alert(`Error (${err.status})`, "Could not fetch all data required - please try again");
      }
      this.props.navigation.pop();
    })
  }

  onUploadAttachment = (title, imageUri, type, filename) => {
    return new Promise((resolve, reject) => {
      if (filename ===  undefined) {
        filename =  imageUri.split("/").pop()
      }
      AttachmentService.uploadTemporaryAttachment(imageUri, type, filename, title)
      .then(response => {
        if (response.status !== 200) {
          response.text().then(text => reject(text));
          return;
        }
        response.json().then(data => {
          const attachments = [...this.state.attachments];
          attachments.push({Title: `Temporary file ${this.state.attachments.length+1}`, Id: data.Id});
          this.setState({
            attachments
          });
          resolve();
        }).catch(err => reject("Failed to transform response data"));
      })
      .catch(err => {
        reject(err.data);
      });
    });
  }

  onDeleteAttachment = (item) => {
    AnalyticsService.trackEvent('PUNCH_CREATE_DELETE_ATTACHMENT');
    const attachments = this.state.attachments.filter(attachment => {
      return attachment.Id != item.Id;
    });
    this.setState({
      attachments: attachments
    });
  }

  onPressCreatePunch = async () => {
    // Validate input
    const {ClearingByCode, RaisedByCode, TypeCode, Status, Sorting, Priority, Estimate, DueDate, ActionByPerson} = this.state.punchDetails;
    const description = this.state.punchDetails.Description;
    const checklistId = this.props.navigation.state.params.checklistId;
    const attachments = this.state.attachments;
    if (!ClearingByCode || !RaisedByCode || !Status || description.trim() == "") {
      AnalyticsService.trackEvent('PUNCH_CREATE_INVALID_FORM');
      Alert.alert("Missing data", "Please fill out all fields before continuing");
      return;
    }
    AnalyticsService.trackEvent('PUNCH_CREATE_SAVE', {type: Status});
    const clearingByOrgId = this.state.organizations[this.getOrganizationIndexByCode(ClearingByCode)].Id;
    const raisedByOrgId = this.state.organizations[this.getOrganizationIndexByCode(RaisedByCode)].Id;
    const categoryId = this.state.categories[this.getCategoryIndexByCode(Status)].Id;
    const typeId = TypeCode && this.state.types[this.getTypeIndexByCode(TypeCode)].Id;
    const sortingId = Sorting && this.state.sortings[this.getSortingIndexByCode(Sorting)].Id;
    const priorityId = Priority && this.state.priorities[this.getPriorityIndexByCode(Priority)].Id;
    const dueDate = DueDate && DueDate.toISOString();
    const actionByPerson = ActionByPerson && ActionByPerson.Id;
    this.setState({
      saving: true
    });
    try {
      const response = await ApiService.createPunchItem(checklistId,description,categoryId,typeId,sortingId,raisedByOrgId,clearingByOrgId, priorityId, Estimate, dueDate, actionByPerson, attachments.map(att => att.Id));
      if (response.status == 403) {
        Alert.alert("Missing privileges", "You dont have access to create a new punch");
        return;
      }
      if (response.status != 200) {
        Alert.alert("Failed to create punch", response.data);
        return;
      }
      const punchId = response.data.Id;

      try {
        const woInfo = await ApiService.getWorkOrderForChecklist(checklistId);
        if (woInfo) {
          Alert.alert("Add punch to work order", `Do you want to add punch item ${punchId} to workorder ${woInfo.WorkOrderNo}?`,
          [{
            text: "No",
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: "Yes",
            onPress: () => {
              ApiService.setWorkOrderForPunchItem(punchId, woInfo.WorkOrderId);
            }
          }])
        }
      } catch (err) {
        // Failed to check workorder
        Alert.alert("Workorder lookup failed", err.message);
      }

      // This will trigger a re-render on parent component, making it reload with the edit view. 
      this.props.navigation.setParams({punchId: punchId});
    } catch (error) {
      Alert.alert("Failed to create punch", error.data);
    } finally {
      this.setState({
        saving: false
      });
    }
  }

  setPriority = (index) => {
    const priorityCode = this.state.priorities[index].Code;
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        Priority: priorityCode
      }
    });
  }

  getPriorityIndexByCode = (code) => {
    return this.state.priorities.findIndex(pri => pri.Code == code);
  }

  setCategory = (index) => {
    const categoryCode = this.state.categories[index].Code;
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        Status: categoryCode
      }
    });
  }

  getCategoryIndexByCode = (code) => {
    return this.state.categories.findIndex(category => category.Code == code);
  }

  setSorting = (index) => {
    const sortingCode = this.state.sortings[index].Code;
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        Sorting: sortingCode
      }
    });
  }

  getSortingIndexByCode = (code) => {
    return this.state.sortings.findIndex( sorting => sorting.Code == code);
  }

  setRaisedByOrg = (index) => {
    const orgCode = this.state.organizations[index].Code;
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        RaisedByCode: orgCode
      }
    })
  }

  setClearingBy = (index) => {
    const orgCode = this.state.organizations[index].Code;

    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        ClearingByCode: orgCode
      }
    })
  }

  getOrganizationIndexByCode = (code) => {
    return this.state.organizations.findIndex( org => org.Code == code);
  }

  setDescription = (newDescription) => {
    this.setState((state) => {
      return {
        punchDetails: {
          ...state.punchDetails,
          Description: newDescription
        }
      }
    });
  }

  setEstimate = (newEstimate) => {
    if (isNaN(newEstimate)) return;
    this.setState((state) => {
      return {
        punchDetails: {
          ...state.punchDetails,
          Estimate: newEstimate
        }
      }
    });

  }
  
  setType = (index) => {
    const typeCode = this.state.types[index].Code;
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        TypeCode: typeCode
      }
    });
  }

  getTypeIndexByCode = (code) => {
    return this.state.types.findIndex( type => type.Code == code);
  }

  setActionByPerson = (person) => {
    this.setState(state => {
      const newState = {
        showActionByPersonModal: false
      }
      if (person) {
        newState.punchDetails = {
          ...state.punchDetails,
          ActionByPerson: person
        }
      }
      return newState;
    })
  }

  clearActionByPerson = () => {
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        ActionByPerson: null
      }
    });
  }

  setDueDate = ({/*year, month, day,*/ date}) => {
    if (!date) return;
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        DueDate: date
      }
    })
  }

  clearDueDate = async () => {
    this.setState({
      punchDetails: {
        ...this.state.punchDetails,
        DueDate: null
      }
    });
  }

  renderDate = ({year, month, day, date}) => {
    if (this.state.punchDetails.DueDate) {
      const dueDate = this.state.punchDetails.DueDate
      const dateStr = `${dueDate.getMonth()+1}/${dueDate.getDate()}/${dueDate.getFullYear()}`;
      return (<Text>{dateStr}</Text>)
    }
    return (<Text>Click to select date</Text>)
    
  }

  render() {
    if (!this.state.categories || !this.state.sortings || !this.state.types || !this.state.organizations) {
      return <Spinner text="Loading details" />
    }

    const categories = this.state.categories && this.state.categories.map(category => `${category.Code}, ${category.Description}`) || [];
    const sortings = this.state.sortings && this.state.sortings.map(sorting => `${sorting.Code}, ${sorting.Description}`) || [];
    const types = this.state.types && this.state.types.map(type => `${type.Code}, ${type.Description}`);
    const organizations = this.state.organizations && this.state.organizations.map(org => `${org.Code}, ${org.Description}`) || [];
    const priorities = this.state.priorities && this.state.priorities.map(priorty => `${priorty.Code}, ${priorty.Description}`) || [];


    const selectedClearingBy = this.getOrganizationIndexByCode(this.state.punchDetails.ClearingByCode);
    const selectedRaisedBy = this.getOrganizationIndexByCode(this.state.punchDetails.RaisedByCode);
    const selectedType = this.getTypeIndexByCode(this.state.punchDetails.TypeCode);
    const selectedCategory = this.getCategoryIndexByCode(this.state.punchDetails.Status);
    const selectedSorting = this.getSortingIndexByCode(this.state.punchDetails.Sorting);
    const selectedPriority = this.getPriorityIndexByCode(this.state.punchDetails.Priority);

    return (
      <SafeAreaView style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showActionByPersonModal}
          onRequestClose={() => this.setState({showActionByPersonModal: false})}
          >
            <SafeAreaView style={{flex: 1}}>
              <View style={{flex: 1}}>
                <PersonSearch onSelect={this.setActionByPerson} />
              </View>
            </SafeAreaView>
        </Modal>
        <ScrollView style={{flex: 1, backgroundColor: colors.PAGE_BACKGROUND}}>
          <View style={styles.container}>

            <View style={styles.inlineInputContainerWithLabel}>
              <Text style={[styles.inputLabel, styles.inlineInputLabel]}>Category *</Text>
              <View style={{
                flex: 1
              }}>
                <ModalDropdown options={categories} defaultIndex={selectedCategory} defaultValue={categories[selectedCategory]} fullWidth={true} onSelect={this.setCategory} disabled={!this.state.editable} />
              </View>
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Description *
              </Text>
              <TextInput editable={this.state.editable} multiline={true} defaultValue={this.state.punchDetails.Description} maxLength={2000} style={styles.multilineInput} textContentType="none" numberOfLines={5} onEndEditing={(e) => {this.setDescription(e.nativeEvent.text);}} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Raised By *
              </Text>
              <ModalDropdown options={organizations} defaultIndex={selectedRaisedBy} defaultValue={organizations[selectedRaisedBy]} fullWidth={true} onSelect={this.setRaisedByOrg} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Clearing by *
              </Text>
              <ModalDropdown options={organizations} defaultIndex={selectedClearingBy} defaultValue={organizations[selectedClearingBy]} fullWidth={true} onSelect={this.setClearingBy} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Action by person
              </Text>
              <View style={styles.dateTimePickerContainer}>
                <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => this.setState({showActionByPersonModal: true})}>
                  <View style={styles.multilineInput}>
                    {this.state.punchDetails.ActionByPerson && (<Text>{`${this.state.punchDetails.ActionByPerson.FirstName} ${this.state.punchDetails.ActionByPerson.LastName}`}</Text>)}
                    {!this.state.punchDetails.ActionByPerson && (<Text>Click to search</Text>)}
                  </View>
                </TouchableOpacity>
                </View>
                <View>
                <TouchableOpacity onPress={this.clearActionByPerson}>
                    <View style={[styles.clearDateContainer,styles.button, styles.primary]}>
                      <Text style={[styles.primaryText]}>Clear</Text>
                    </View>
                </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Due Date (mm/dd/yyyy)
              </Text>
              <View style={styles.dateTimePickerContainer}>
                <DatePickerModal 
                  renderDate={this.renderDate}
                  startDate={this.state.punchDetails.DueDate || new Date()}
                  onDateChanged={this.setDueDate}
                  style={styles.dateContainer}
                />
                <TouchableOpacity onPress={this.clearDueDate}>
                  <View style={[styles.clearDateContainer,styles.button, styles.primary]}>
                    <Text style={[styles.primaryText]}>Clear</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Punch list type
              </Text>
              <ModalDropdown options={types} defaultIndex={selectedType} defaultValue={types[selectedType]} fullWidth={true} onSelect={this.setType} disabled={!this.state.editable} />
            </View>
            
            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Punch list sorting
              </Text>
              <ModalDropdown options={sortings} defaultIndex={selectedSorting} defaultValue={sortings[selectedSorting]} fullWidth={true} onSelect={this.setSorting} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Punch Priority
              </Text>
              <ModalDropdown options={priorities} defaultIndex={selectedPriority} defaultValue={priorities[selectedPriority]} fullWidth={true} onSelect={this.setPriority} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Estimate
              </Text>
              <TextInput editable={this.state.editable} value={this.state.punchDetails.Estimate} style={styles.multilineInput} onChangeText={this.setEstimate} keyboardType="number-pad" />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Attachments
              </Text>
              <Attachments onDelete={this.onDeleteAttachment} onSelect={() => { Alert.alert("Please save","Please save the punch before downloading attachments")}} upload={this.onUploadAttachment} data={this.state.attachments} hideTitle loading={this.state.loadingAttachments} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressCreatePunch} disabled={this.state.saving || this.state.loadingAttachments}>
                {(this.state.saving || this.state.loadingAttachments) && (
                  <Spinner color="#FFF" size="small" />
                ) || (
                  <Text style={[styles.buttonText,styles.primaryText]}>Save punch</Text>
                )}
                
              </TouchableOpacity>
            </View>

            
            
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  marginTop: {
    marginTop: 16
  },
  inlineInputContainerWithLabel: {
    flexDirection: 'row',
    alignItems: 'center'
  }, 
  inputLabel: {
    fontSize: 16,
    marginBottom: 8
  },
  inlineInputLabel: {
    marginRight: 16
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    padding: 16, 
    textAlignVertical: "top", 
    maxHeight: 100, 
    fontSize: 14,
    backgroundColor: '#FFF'
  },
  button: {
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
  dateContainer: {
    flex: 1, 
    minHeight: 40,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    justifyContent: 'center',
    paddingLeft: 16
  },
  dateTimePickerContainer: {
    flex: 1, 
    flexDirection: 'row',
  },
  clearDateContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  }
});

export default CreatePunchItemView;
