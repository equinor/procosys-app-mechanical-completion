import React from 'react';
import { View, SafeAreaView, StyleSheet, Modal, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { RNCamera } from 'react-native-camera';
import IconButton from './IconButton';
import Analytics from '../services/AnalyticsService';

class TagOcr extends React.PureComponent {
  constructor(props) {
    super(props);
    this.takePicture = this.takePicture.bind(this);
    this.processImage = this.processImage.bind(this);
    this._getTagFromOCR = this._getTagFromOCR.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);

    this.state = {
      results: [],
      numberOfResults: 0,
      loading: false,
      modalVisible: false,
      modalTagsVisible: false
    };
  }

  _getTagFromOCR() {
    Analytics.trackEvent('TAG_OCR_OPEN');
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setModalTagsVisible(visible) {
    this.setState({ modalTagsVisible: visible });
  }

  takePicture = async function () {
    Analytics.trackEvent('TAG_OCR_PHOTO_CAPTURED');
    const options = { quality: 0.5, base64: true, mute: true, width: 1000 };
    const photo = await this.camera.takePictureAsync(options);
    //  eslint-disable-next-line
    await this.processImage(photo);

    //this.setModalVisible(false);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  processImage = async (photoData) => {
    var subscriptionKey = "f7acef886c3b42eb97ea1e2867c65eda";
    var uriBase =
      "https://northeurope.api.cognitive.microsoft.com/vision/v2.0/ocr";

    const uploadHeaders = new Headers()
    uploadHeaders.append('Content-Type', 'multipart/form-data');
    uploadHeaders.append('Accept', 'application/json');
    uploadHeaders.append("Ocp-Apim-Subscription-Key", subscriptionKey);

    var data = new FormData();
    data.append('my_photo', {
      uri: photoData.uri,
      name: 'my_photo.jpg',
      type: 'image/jpg'
    });

    const uploadConfig = {
      method: 'POST',
      headers: uploadHeaders,
      body: data
    };

    const response = await fetch(uriBase + '?language=unk&detectOrientation=true', uploadConfig);
    var possibleTags = [];
    await response.json().then((res) => {
      res.regions.forEach((region) => {
        region.lines.forEach((line) => {
          possibleTags.push(line.words.map(word => word.text).join(''));
        });
      });
    });
    Analytics.trackEvent('TAG_OCR_PHOTO_PROCESSED', {numberOfTagsFound: possibleTags.length});
    if (possibleTags.length > 0) {
      this.setState({ possibleTags: possibleTags });
      this.setState({ modalTagsVisible: true });
    } else {
      this.setModalVisible(false);
      setTimeout(() => {
        Alert.alert('No Tags identified!');
      }, 500);
      
    }

    this.setModalVisible(false);
  };

  setAndClose(item) {
    Analytics.trackEvent('TAG_OCR_TAG_SELECTED');
    this.setModalTagsVisible(false);
    this.props.setAndClose(item)
  };

  render() {
    return (
      <SafeAreaView>
        <IconButton
          icon="md-camera"
          onPress={this._getTagFromOCR}
          size={50}
        >
        </IconButton>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false); }}>
          <View style={styles.container}>
            <RNCamera
              ref={ref => { this.camera = ref; }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
            >
              <View style={styles.cameraButton}>
                <IconButton
                  icon="md-camera"
                  onPress={() => { this.takePicture() }}
                  size={50}
                ></IconButton>
              </View>
            </RNCamera>
            <View style={styles.closeButton}>
                <IconButton
                  icon="ios-close"
                  onPress={() => { Analytics.trackEvent('TAG_OCR_BTN_CLOSE'); this.setModalVisible(false); }}
                  size={50}
                ></IconButton>
              </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalTagsVisible}
          onRequestClose={() => { this.setModalTagsVisible(false); }}>
          <SafeAreaView style={styles.modal}>
            <Text style={styles.header}>Possible Tags</Text>
            <FlatList
              data={this.state.possibleTags}
              renderItem={({ item }) => {
                return (
                  <View style={styles.tagSelector}>
                    <TouchableOpacity onPress={() => { this.setAndClose(item) }}>
                      <Text style={styles.text}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={item => item}
            />
            <View style={styles.tagSelectorCancel}>
              <TouchableOpacity onPress={() => { this.setAndClose() }}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
  },
  cameraButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 2,
    bottom: 20
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20
  },
  header: {
    alignSelf: 'center',
    fontSize: 40
  },
  text: {
    fontSize: 25
  },
  tagSelector: {
    borderColor: 'gray',
    borderBottomWidth: 0,
    borderTopWidth: 2,
    padding: 10,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tagSelectorCancel: {
    borderColor: 'gray',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    backgroundColor: 'yellow',
    padding: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  container: {
    flex: 1
  },
});

export default TagOcr;
