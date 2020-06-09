import React from 'react';

import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import ChecklistView from '../../../Modules/ChecklistModule/ChecklistView';
import Spinner from '../../../components/Spinner';
import ApiService from '../../../services/api';
import Comment from './Comment';
import Signatures from './Signatures';
import Attachments from '../../../components/Attachments';
import AttachmentService from '../../../services/AttachmentService';
import FileViewer from 'react-native-file-viewer';
import MCCRHeader from '../MCCRHeader';
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationHeader from '../../../components/NavigationHeader';


//Redux
import {connect} from 'react-redux';
import Actions from '../../../actions';

class MCCRContainerView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarOptions: {adaptive: false},
      tabBarLabel: 'Checklist',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon
            name="ios-list-box"
            size={25}
            color={tintColor}
          />
        );
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      checklist: null,
      attachments: [],
      failed: false,
      loadingAttachments: false,
      comment: ''
    };
    this.subs = [];
    
    this.openAttachment = this.openAttachment.bind(this);
    this.refreshChecklist = this.refreshChecklist.bind(this);
    this.loadAttachments = this.loadAttachments.bind(this);
    this.uploadAttachment = this.uploadAttachment.bind(this);
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.clearComment = this.clearComment.bind(this);

  }

  componentDidMount() {
    this.props.navigation.setParams({createPunch: this.createPunch})
    this.refreshChecklist();

    this.subs = [
      this.props.navigation.addListener('didFocus',this.refreshChecklist)
    ];
  }

  componentWillUnmount() {
    this.props.unsetChecklistInfo();
    this.subs.forEach(sub => sub.remove());
  }

  createPunch = () => {
    const {checklist} = this.props.navigation.state.params;
    this.props.navigation.navigate('PunchItemDetails', {
      punchId: null,
      tagId: checklist.TagId,
      checklistId: checklist.Id
    })
  }

  updateComment(newText) {
    this.setState({comment: newText});
    const {checklist} = this.props.navigation.state.params;
    ApiService.setChecklistComment(checklist.Id, newText).catch(() => {
      Alert.alert('Error while updating comment')
    });
  }

  clearComment() {
    this.setState({comment: ''});
    const {checklist} = this.props.navigation.state.params;
    ApiService.setChecklistComment(checklist.Id, '')
    .catch(() => {
      Alert.alert('Error while updating comment')
    });
  }

  refreshChecklist() {
    let scopeItem = this.props.navigation.state.params.checklist;
    ApiService.getChecklistDetailsForChecklist(scopeItem.Id).then(data => {
      this.setState({ checklist: data, comment: data.CheckList.Comment || '' }, this.loadAttachments);
      this.props.setChecklistInfo(data.CheckList);
    }).catch(err => {
      Alert.alert("Failed to load checklist data", `An error occured when loading checklist data (${err.status})`)
      this.props.navigation.pop();
    });
  }

  loadAttachments() {
    this.setState({
      loadingAttachments: true
    });
    ApiService.getAttachmentsForChecklist(this.state.checklist.CheckList.Id)
    .then(data => {
      this.setState({attachments: data});
    })
    .catch(err => Alert.alert("Attachment error", `Failed to get attachments (${err.status})`))
    .finally(() => {
      this.setState({loadingAttachments: false});
    });
  }

  uploadAttachment(title, imagePath, type, filename) {
    return new Promise((resolve, reject) => {
      return AttachmentService.uploadChecklistAttachment(imagePath,this.state.checklist.CheckList.Id,type, filename, title)
      .then(response => {
        if (response.status == 204) {
          resolve();
          this.loadAttachments();
        } else {
          response.text().then(text => reject(text));
        }
      })
      .catch((err) => reject(err.message))
    })
    
  }

  openAttachment(attachmentId) {
    let attachment = this.state.attachments.find(el => el.Id === attachmentId);
    this.setState({loadingAttachments: true});
    AttachmentService.downloadChecklistAttachment(this.state.checklist.CheckList.Id, attachment.Id, attachment.MimeType)
    .then(result => {
      FileViewer.open(result);
    }).catch(err => {
      Alert.alert("Unable to load attachment", err);
    }).finally(() => {
      this.setState({loadingAttachments: false});
    })
  }

  deleteAttachment(attachment) {
    this.setState({loadingAttachments: true});
    ApiService.deleteChecklistAttachment(this.state.checklist.CheckList.Id, attachment.Id)
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
      this.setState({loadingAttachments: false});
    })
  }

  render() {
    if (!this.state.checklist) {
      return <Spinner text="Loading checklist" />;
    }
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationHeader navigation={this.props.navigation} title="Checklist">
          <TouchableOpacity style={styles.button} onPress={this.createPunch}>
            <Text style={{
              backgroundColor: 'rgb(83,134,216)',
              borderRadius: 2,
              padding: 10,
              fontWeight: '500',
              color: '#FFF'
            }}>Create Punch</Text>
          </TouchableOpacity>
        </NavigationHeader>
        <MCCRHeader item={this.state.checklist.CheckList} />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingBottom: 50 }}>
            {this.state.checklist.LoopTags.length > 0 && (
              <View style={styles.loopTagContainer}>
                <Text style={styles.loopTagHeader}>Loop Tags</Text>
                <Text style={styles.loopTagContent}>{this.state.checklist.LoopTags.map(i => i.TagNo).join(',')}</Text>
              </View>)
            }
            <ChecklistView
              checkItems={this.state.checklist.CheckItems}
              checklist={this.state.checklist.CheckList}
              customCheckItems={this.state.checklist.CustomCheckItems}
              refresh={this.refreshChecklist}
            />
            <Comment comment={this.state.comment} onSubmit={this.updateComment} onClear={this.clearComment} disabled={this.state.checklist.CheckList.SignedAt != null} />
            <Signatures checklist={this.state.checklist.CheckList} refresh={this.refreshChecklist} />
            <View style={styles.attachmentsContainer}>
              <Attachments data={this.state.attachments} onSelect={this.openAttachment} upload={this.uploadAttachment} onDelete={this.deleteAttachment} loading={this.state.loadingAttachments} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  loopTagContainer: {
    margin: 10
  },
  loopTagHeader: {
    fontWeight: '500', 
    marginBottom: 5
  },
  loopTagContent: {

  },
  attachmentsContainer: {
    margin: 15
  },
  button: {
    alignItems: 'center',
    padding: 10
  }
});

MCCRContainerView.propStyle = {};

const mapDispatchToProps = dispatch => ({
  setChecklistInfo: (checklist) => dispatch(Actions.setChecklistInfo(checklist)),
  unsetChecklistInfo: () => dispatch(Actions.unsetChecklistInfo()),
});

const mapStateToProps = state => ({
  checklistInfo: state.Data.checklistInfo,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCCRContainerView);
