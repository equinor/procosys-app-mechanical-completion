import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Image, Button, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../stylesheets/colors';
import propTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import Spinner from './Spinner';


/**
 * @example
 * <Attachments 
 * onDelete={(item) => {}}
 * onSelect={(id) => {}}
 * data={[{}]}
 * disabled={false}
 * loading={false}
 * upload={(title, imageUri) => Promise}
 *  />
 */
class Attachments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      addModalVisible: false,
      selectedImage: null,
      attachmentTitle: '',
      uploading: false
    };
  }

  addAttachment = () => {
    const image = this.state.selectedImage;
    const title = this.state.attachmentTitle;

    if (!image) {
      Alert.alert("No image selected");
      return;
    }
    if (title === '') {
      Alert.alert("Title can not be empty");
      return;
    }
    this.setState({uploading: true}, () => {
      this.props.upload(title, image.uri, image.type, image.fileName)
      .then(() => {
        this.setState({uploading: false});
        this.toggleModal();
      })
      .catch((error) => {
        console.log("Error", error);
        this.setState({uploading: false, addModalVisible: !this.state.addModalVisible}, () => {
          //Modals and alerts arent good friends apparently
          setTimeout(() => Alert.alert("Unable to upload file", error),300);
          this.resetAttachmentModal();
        });
      })
    })
    
  }

  deleteAttachment = (item) => {
    Alert.alert("Delete attachment",`Are you sure you want to delete ${item.Title}?`,[
      {text: "Cancel", onPress: () => {}},
      {text: "Delete", onPress: () => this.props.onDelete(item)}
    ]);
  }

  resetAttachmentModal = () => {
    this.setState({
      selectedImage: null,
      attachmentTitle: ''
    })
  }

  selectImage = () => {
    const pickerOptions = {
      mediaType: 'photo',
      noData: true
    };

    ImagePicker.showImagePicker(pickerOptions, (response) => {
      if (response.error) {
        Alert.alert(response.error);
        return;
      }
      if (response.didCancel) {
        return;
      }
      var update = {selectedImage: response};
      if (this.state.attachmentTitle === '') {
        update.attachmentTitle = response.fileName;
      }
      this.setState(update);
    });
  }

  toggleModal = () => {
    if (this.props.disabled) return;
    if (this.state.addModalVisible) {
      this.resetAttachmentModal();
    }
    this.setState({addModalVisible: !this.state.addModalVisible})
  }

  renderAddModal = () => {
    return (
      <Modal
        visible={(this.state.addModalVisible)}
        animationType="fade"
        transparent={true}
        onRequestClose={this.toggleModal}
        
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}>
          <View style={{
            backgroundColor: '#FFF',
            padding: 20,
            minWidth: 300,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 5
          }}>
          <Text>Select Attachment</Text>
            <View style={{marginTop: 20}}>
              {!this.props.hideTitle && (
                <View style={{paddingBottom: 20}}>
                  <Text>Title:</Text>
                  <TextInput style={{paddingTop: 5}} placeholder="Write your title here..." onChangeText={(text) => this.setState({attachmentTitle: text})} value={this.state.attachmentTitle} minLength={3} maxLength={50} />
                </View>
              )}
              <Text>Attachment</Text>
              {!this.state.uploading && (
                <Button title="Select image" onPress={this.selectImage} />
              )}
              {this.state.uploading && (
                <View style={{flexDirection: 'row', height: 120}}>
                  <Spinner text="Uploading..." />
                </View>
              )}
              {(this.state.selectedImage != null && !this.state.uploading) && (<Image source={{uri: this.state.selectedImage.uri}} style={{width: 100, height: 100, alignSelf: 'center', marginTop: 20}} />)}
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 22}}>
                <Button title="Cancel" color="red" onPress={this.toggleModal} disabled={this.state.uploading} />
                <Button title="Upload" onPress={this.addAttachment} disabled={(!this.state.selectedImage || this.state.attachmentTitle == '' || this.state.uploading)} />
              </View>
              
              
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  viewAttachment = (attachmentId) => {
    this.props.onSelect(attachmentId);
  }

  toggleExpand = () => {
    this.setState(oldState => ({ expanded: !oldState.expanded }));
  }

  renderContent = () => {
    if (!this.state.expanded || this.props.loading) return null;
    let content = this.props.data.map(attachment => {
      return (
        <View style={[{flexDirection: 'row'},itemStyle.container]} key={`attachment_${attachment.Id}`}>
          <TouchableOpacity key={`Attachment_${attachment.Id}`} style={{flex: 1}} onPress={() => this.viewAttachment(attachment.Id)}>
              <Text style={itemStyle.text}>{attachment.Title}</Text>
          </TouchableOpacity>

            <TouchableOpacity style={[styles.iconContainer, {alignItems: 'flex-end', paddingRight: 10}]} onPress={() => this.deleteAttachment(attachment)}>
              <Icon
                name="ios-trash"
                size={22}
              />
            </TouchableOpacity>
        </View>
        
          
      )
    })
    return content;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.toggleExpand}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Icon
                name={
                  this.state.expanded ? 'ios-arrow-down' : 'ios-arrow-forward'
                }
                size={18}
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.text,
                  this.state.expanded && styles.textExpanded
                ]}
              >
                {`Attachments (${this.props.data.length})`}
              </Text>
            </View>
            
            <TouchableOpacity style={[styles.iconContainer, {alignItems: 'flex-end', flex: 1, paddingRight: 20}]} onPress={this.toggleModal}>
              {this.props.loading && (
              <Spinner size="small" />
              ) || 
              (!this.props.disabled && <Icon
                name="ios-add"
                size={28}
              />)}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        {this.renderContent()}
        {this.renderAddModal()}
      </View>
    );
  }
}

const itemStyle = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    padding: 10
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    maxHeight: 500
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 47
  },
  iconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {},
  text: {
    fontSize: 18
  },
  textExpanded: {
    color: '#3A85B3'
  }
});

Attachments.propTypes = {
  data: propTypes.arrayOf(propTypes.shape({
    Id: propTypes.oneOfType([propTypes.number, propTypes.string]).isRequired,
    Title: propTypes.string.isRequired,
  })).isRequired,
  loading: propTypes.bool,
  onSelect: propTypes.func,
  onDelete: propTypes.func,
  upload: propTypes.func
}

Attachments.defaultProps = {
  data: [],
  loading: false,
  disabled: false
};

export default Attachments;
