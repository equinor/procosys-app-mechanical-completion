import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, TouchableOpacity, SafeAreaView, Modal} from 'react-native';
import DatePickerModal from '../../../components/DatepickerModal';

import ModalDropdown from '../../../components/ModalDropdown';
import colors from '../../../stylesheets/colors';
import Attachments from '../../../components/Attachments';
import Signatures from './Signatures';
import FileViewer from 'react-native-file-viewer';
import ApiService from '../../../services/api';
import Spinner from '../../../components/Spinner';
import AttachmentService from '../../../services/AttachmentService';
import AnalyticsService from '../../../services/AnalyticsService';
import PersonSearch from '../../PersonSearch';


class EditPunchItemView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      description: "",
      punchDetails: null,
      attachments: [],
      categories: null,
      sortings: null,
      types: null,
      organizations: null,
      editable: false,
      loadingAttachments: false,
      comments: [],
      commentInputText: '',
      showActionByPersonModal: false
    };
    
  }

  componentDidMount() {
    this.updatePunchItemDetails();
    this.loadAttachments();
    const categoriesPromise = ApiService.getPunchItemCategories();
    const sortingsPromise = ApiService.getPunchItemSortings();
    const typesPromise = ApiService.getPunchItemTypes();
    const prioritiesPromise = ApiService.getPunchPriorities();
    const organizationsPromise = ApiService.getPunchItemOrganizations();
    Promise.all([categoriesPromise,sortingsPromise,typesPromise,organizationsPromise, prioritiesPromise])
    .then((result) => {
      this.setState({
        categories: result[0], 
        sortings: result[1], 
        types: result[2], 
        organizations: result[3],
        priorities: result[4]
      })
    }).catch(err => {
      if (err.status === 403) {
        Alert.alert("Missing privileges", "You dont have access to perform this action");
      } else {
        Alert.alert(`Error (${err.status})`, "Could not fetch all data required - please try again");
      }
      this.props.navigation.pop();
    })
  }

  updatePunchItemDetails = () => {
    const punchId = this.props.punchId;
    const punchComments = ApiService.getPunchItemComments(punchId);
    const punchDetails =  ApiService.getPunchItemDetails(punchId);
    Promise.all([punchDetails, punchComments])
    .then(result => {
      const [details, comments] = result;
      const isEditable = (details.ClearedAt == null && details.RejectedAt == null);
      this.setState({
        punchDetails: details,
        description: details.Description,
        editable: isEditable,
        comments: comments
      });
    });
  }

  handleResponseFor = (apiPromise, field) => {
    apiPromise.then(data => {
        if (data.status != 204) {
          data.text().then(text => {
            Alert.alert("Failed to set " + field, text);
          })
        }
      }).catch(err => {
      
      if (err.status === 403) {
        Alert.alert("Missing privileges", "You dont have access to perform this action");
      } else {
        Alert.alert(`Failed to set ${field} (${err.status})`, err.data);
      }
    }).finally(() => {
      this.updatePunchItemDetails();
    })
  }

  setPriority = (index) => {
    const punchId = this.state.punchDetails.Id;
    const priorityId = this.state.priorities[index].Id;
    this.handleResponseFor(ApiService.setPunchItemPriority(punchId, priorityId), "priority");
  }

  setCategory = (index) => {
    const punchId = this.state.punchDetails.Id;
    const categoryId = this.state.categories[index].Id;
    this.handleResponseFor(ApiService.setPunchItemCategory(punchId, categoryId), "category");
  }

  setSorting = (index) => {
    const punchId = this.state.punchDetails.Id;
    const sortingId = this.state.sortings[index].Id;
    this.handleResponseFor(ApiService.setPunchItemSorting(punchId, sortingId), "sorting");
  }

  setRaisedByOrg = (index) => {
    const punchId = this.state.punchDetails.Id;
    const orgId = this.state.organizations[index].Id;
    this.handleResponseFor(ApiService.setPunchItemRaisedByOrg(punchId, orgId), "raised by");
  }

  setClearingBy = (index) => {
    const punchId = this.state.punchDetails.Id;
    const orgId = this.state.organizations[index].Id;
    this.handleResponseFor(ApiService.setPunchItemClearingByOrg(punchId, orgId), "clearing");
  }

  setDueDate = ({/*year, month, day,*/ date}) => {
    if (!date) return;
    const punchId = this.state.punchDetails.Id;
    const dateFormatted = date.toISOString();
    this.handleResponseFor(ApiService.setPunchItemDueDate(punchId, dateFormatted), "Due date");
  }

  clearDueDate = () => {
    const punchId = this.state.punchDetails.Id;
    this.handleResponseFor(ApiService.setPunchItemDueDate(punchId, null), "Due date");
  }

  setDescription = (newDescription) => {
    if (this.state.punchDetails.Description === newDescription) return;
    const punchId = this.state.punchDetails.Id;
    this.handleResponseFor(ApiService.setPunchItemDescription(punchId, newDescription), "description")
  }

  setEstimate = (newEstimate) => {
    if (this.state.punchDetails.Estimate === newEstimate) return;
    if (isNaN(newEstimate)) {
      Alert.alert('Only numeric values for estimates are allowed');
      return;
    }
    const punchId = this.state.punchDetails.Id;
    this.handleResponseFor(ApiService.setPunchItemEstimate(punchId, newEstimate), "estimate")
  }
  
  setType = (index) => {
    const punchId = this.state.punchDetails.Id;
    const typeId = this.state.types[index].Id;
    this.handleResponseFor(ApiService.setPunchItemType(punchId, typeId), "type");
  }

  updateCommentText = (newText) => {
    this.setState({
      commentInputText: newText
    });
  }

  addComment = () => {
    const punchId = this.props.punchId;
    const promise = ApiService.addPunchItemComment(punchId, this.state.commentInputText);
    this.handleResponseFor(promise, 'Comment');
    promise.then(() => {
      this.setState({
        commentInputText: ''
      });
    });
  }

  clearActionbyPerson = () => {
    const punchId = this.props.punchId;
    this.handleResponseFor(ApiService.setPunchItemActionByPerson(punchId, null), 'Action by person');
  }

  setActionByPerson = (person) => {
    if (person) {
      const punchId = this.props.punchId;
      this.handleResponseFor(ApiService.setPunchItemActionByPerson(punchId, person.Id), 'Action by person');
    }
    this.setState({showActionByPersonModal: false});
  }

  loadAttachments = () => {
    this.setState({loadingAttachments: true});
    const punchId = this.props.punchId;
    ApiService.getAttachmentsForPunchItem(punchId)
    .then(data => {
      this.setState({attachments: data});
    }).catch(err => Alert.alert("Attachment error", `Failed to get attachments (${err.status})`))
    .finally(() => {
      this.setState({
        loadingAttachments: false
      });
    });
  }

  uploadAttachment = (title, imagePath, type, filename) => {
    const punchId = this.state.punchDetails.Id;
    return new Promise((resolve, reject) => {
      AttachmentService.uploadPunchItemAttachment(imagePath, punchId, type, filename, title)
      .then(response => {
        if (response.status != 204) {
          response.text().then(text => {
            reject(text);
          });
        } else {
          resolve();
          this.loadAttachments();
        }
      })
      .catch(err => {
        reject(err.data);
      });
    });
  }

  openAttachment = (attachmentId) => {
    this.setState({loadingAttachments: true});
    AnalyticsService.trackEvent('PUNCH_EDIT_OPEN_ATTACHMENT');
    const attachment = this.state.attachments.find(el => el.Id === attachmentId);
    const punchId = this.state.punchDetails.Id;
    AttachmentService.downloadPunchItemAttachment(punchId, attachment.Id, attachment.MimeType)
    .then(result => {
      FileViewer.open(result);
    }).catch(err => {
      Alert.alert("Unable to load attachment", err);
    }).finally(() => {
      this.setState({loadingAttachments: false});
    })
  }

  deleteAttachment = (attachment) => {
    this.setState({loadingAttachments: true});
    AnalyticsService.trackEvent('PUNCH_EDIT_DELETE_ATTACHMENT');
    const punchId = this.state.punchDetails.Id;
    ApiService.deletePunchItemAttachment(punchId, attachment.Id)
    .then((response) => {
      if (response.status != 204) {
        response.text().then(text => {
          Alert.alert("Unable to delete attachment", text);
        });
      } else {
        this.loadAttachments();
        Alert.alert("Attachment deleted");
      }
    })
    .catch((err) => {Alert.alert("Failed to delete attachment",err.message)})
    .finally(() => {
      this.setState({
        loadingAttachments: false
      });
    });
  }

  renderDate = ({year, month, day, date}) => {

    if (this.state.punchDetails.DueDate) {
      const dueDate = new Date(this.state.punchDetails.DueDate);
      const dateStr = `${dueDate.getMonth()+1}/${dueDate.getDate()}/${dueDate.getFullYear()}`;
      return (<Text>{dateStr}</Text>)
    }
    return (<Text>Click to select date</Text>)
    
  }

  renderDisabledDate = () => {
    if (this.state.punchDetails.DueDate) {
      const dueDate = new Date(this.state.punchDetails.DueDate);
      const dateStr = `${dueDate.getMonth()+1}/${dueDate.getDate()}/${dueDate.getFullYear()}`;
      return (<Text>{dateStr}</Text>)
    }
    return <Text>-</Text>
  }

  render() {
    if (!this.state.punchDetails || !this.state.categories || !this.state.sortings || !this.state.types || !this.state.organizations) {
      return <Spinner text="Loading details" />
    }
    const categories = this.state.categories && this.state.categories.map(category => `${category.Code}, ${category.Description}`) || [];
    const sortings = this.state.sortings && this.state.sortings.map(sorting => `${sorting.Code}, ${sorting.Description}`) || [];
    const types = this.state.types && this.state.types.map(type => `${type.Code}, ${type.Description}`);
    const organizations = this.state.organizations && this.state.organizations.map(org => `${org.Code}, ${org.Description}`) || [];
    const priorities = this.state.priorities && this.state.priorities.map(priorty => `${priorty.Code}, ${priorty.Description}`) || [];

    const selectedClearingBy = this.state.organizations && this.state.organizations.findIndex( org => org.Code == this.state.punchDetails.ClearingByCode);
    const selectedRaisedBy = this.state.organizations && this.state.organizations.findIndex( org => org.Code == this.state.punchDetails.RaisedByCode);
    const selectedType = this.state.types && this.state.types.findIndex( type => type.Code == this.state.punchDetails.TypeCode);
    const selectedCategory = this.state.categories && this.state.categories.findIndex( category => category.Code == this.state.punchDetails.Status);
    const selectedSorting = this.state.sortings && this.state.sortings.findIndex( sorting => sorting.Code == this.state.punchDetails.Sorting);
    const selectedPriority = this.state.priorities && this.state.priorities.findIndex( priority => priority.Code == this.state.punchDetails.PriorityCode);

    const selectedDate = new Date(this.state.punchDetails.DueDate || Date.now());

    const comments = this.state.comments.map(comment => {
      const date = new Date(comment.CreatedAt);
      return (
        <View style={{paddingBottom: 10, marginTop: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.BORDER_COLOR}} key={comment.Id}>
          <View style={{flex: 1, flexDirection: 'row', marginBottom: 5}}>
            <Text style={{flex: 1, textAlign: 'left', fontWeight: '500'}}>{comment.FirstName} {comment.LastName}</Text>
            <Text style={{flex: 1, textAlign: 'right', fontWeight: '500'}}>{`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}</Text>
          </View>
          <Text>{comment.Text}</Text>
          
        </View>
      )
    })

    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.editable && (
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
        )}
        
        <ScrollView style={{flex: 1, backgroundColor: colors.PAGE_BACKGROUND}}>
          <View style={styles.container}>

            <View style={styles.inlineInputContainerWithLabel}>
              <Text style={[styles.inputLabel, styles.inlineInputLabel]}>Category *</Text>
              <View style={{
                flex: 1
              }}>
                <ModalDropdown options={categories} defaultIndex={selectedCategory} defaultValue={categories[selectedCategory]} onSelect={this.setCategory} disabled={!this.state.editable} />
              </View>
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Description *
              </Text>
              <TextInput editable={this.state.editable} multiline={true} defaultValue={this.state.punchDetails.Description} maxLength={2000} style={[styles.multilineInput, !this.state.editable && styles.disabled]} textContentType="none" numberOfLines={5} onEndEditing={(e) => {this.setDescription(e.nativeEvent.text);}} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Comments
              </Text>
              {this.state.editable && (<TextInput placeholder="Add comment" editable={this.state.editable} multiline={true} value={this.state.commentInputText} style={[styles.multilineInput, !this.state.editable && styles.disabled]} numberOfLines={3} onChangeText={this.updateCommentText} />)}
              {this.state.commentInputText != '' && (<TouchableOpacity onPress={this.addComment}>
                <View style={[styles.button, styles.primary, {marginTop: 10}]}>
                  <Text style={[styles.primaryText, {padding: 16}]}>Add Comment</Text>
                </View>
              </TouchableOpacity>)}
              {comments}
              {(comments.length <= 0) && (<Text style={{marginTop: 10}}>No comments</Text>) }
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Raised By *
              </Text>
              <ModalDropdown options={organizations} defaultIndex={selectedRaisedBy} defaultValue={organizations[selectedRaisedBy]} onSelect={this.setRaisedByOrg} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Clearing by *
              </Text>
              <ModalDropdown options={organizations} defaultIndex={selectedClearingBy} defaultValue={organizations[selectedClearingBy]} onSelect={this.setClearingBy} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
                <Text style={styles.inputLabel}>
                  Action by person
                </Text>
                <View style={styles.dateTimePickerContainer}>
                  <View style={{flex: 1}}>
                  <TouchableOpacity onPress={() => this.setState({showActionByPersonModal: true})} disabled={!this.state.editable}>
                    <View style={[styles.multilineInput,!this.state.editable && styles.disabled]}>
                      {this.state.punchDetails.ActionByPersonFirstName && (<Text>{`${this.state.punchDetails.ActionByPersonFirstName} ${this.state.punchDetails.ActionByPersonLastName}`}</Text>)}
                      {(this.state.editable && !this.state.punchDetails.ActionByPersonFirstName) && (<Text>Click to search</Text>)}
                      {(!this.state.editable && !this.state.punchDetails.ActionByPersonFirstName) && (<Text>-</Text>)}
                    </View>
                  </TouchableOpacity>
                  </View>
                  {this.state.editable && (
                    <View>
                      <TouchableOpacity onPress={this.clearActionbyPerson} disabled={!this.state.editable}>
                          <View style={[styles.clearDateContainer,styles.button, styles.primary]}>
                            <Text style={[styles.primaryText]}>Clear</Text>
                          </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                </View>
              </View>


            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Due Date (mm/dd/yyyy)
              </Text>
              {this.state.editable && (
                <View style={styles.dateTimePickerContainer}>
                  <DatePickerModal 
                    renderDate={this.renderDate}
                    startDate={selectedDate}
                    onDateChanged={this.setDueDate}
                    style={styles.dateContainer}
                  />
                  <TouchableOpacity onPress={this.clearDueDate}>
                    <View style={[styles.clearDateContainer,styles.button, styles.primary]}>
                      <Text style={[styles.primaryText]}>Clear</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                )}
              {!this.state.editable && (<View 
                style={[styles.dateContainer, styles.disabled]}
              >{this.renderDisabledDate()}</View>)}
              
            </View>

            

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Punch list type
              </Text>
              <ModalDropdown options={types} defaultIndex={selectedType} defaultValue={types[selectedType]} onSelect={this.setType} disabled={!this.state.editable} />
            </View>

            
            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Punch list sorting
              </Text>
              <ModalDropdown options={sortings} defaultIndex={selectedSorting} defaultValue={sortings[selectedSorting]} onSelect={this.setSorting} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Punch Priority
              </Text>
              <ModalDropdown options={priorities} defaultIndex={selectedPriority} defaultValue={priorities[selectedPriority]} onSelect={this.setPriority} disabled={!this.state.editable} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Estimate
              </Text>
              <TextInput editable={this.state.editable} defaultValue={`${this.state.punchDetails.Estimate || ''}`} style={[styles.multilineInput, !this.state.editable && styles.disabled]} keyboardType="number-pad" onEndEditing={(e) => {this.setEstimate(e.nativeEvent.text);}} />
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Attachments
              </Text>
              <Attachments data={this.state.attachments} onSelect={this.openAttachment} upload={this.uploadAttachment} onDelete={this.deleteAttachment} loading={this.state.loadingAttachments} disabled={!this.state.editable}/>
            </View>

            <View style={[styles.marginTop,styles.inputContainerWithLabel]}>
              <Text style={styles.inputLabel}>
                Signatures
              </Text>
              <Signatures punchDetails={this.state.punchDetails} refresh={this.updatePunchItemDetails} />
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
  dateContainer: {
    flex: 1, 
    minHeight: 40,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    justifyContent: 'center',
    paddingLeft: 16
  },
  disabled: {
    backgroundColor: '#F3F3F3'
  },
  dateTimePickerContainer: {
    flex: 1, 
    flexDirection: 'row'
  },
  clearDateContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  primaryText: {
    color: '#FFF'
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
});

export default EditPunchItemView;
