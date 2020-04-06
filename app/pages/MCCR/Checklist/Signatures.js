import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert, Modal} from 'react-native';
import propTypes from 'prop-types';
import moment from 'moment';
import ApiService from '../../../services/api';
import MultiSign from './MultiSign';
import MultiVerify from './MultiVerify';
import AnalyticsService from '../../../services/AnalyticsService';

class Signatures extends React.PureComponent {

  constructor(props) {
    super(props);
    
    this.state = {
      showMultiSignModal: false,
      showMultiVerifyModal: false,
      multiSignChecklists: [],
      multiVerifyChecklists: []
    }
  }

  canMultiSign = () => {
    return this.state.multiSignChecklists.length > 0;
  }
  canMultiVerify = () => {
    return this.state.multiVerifyChecklists.length > 0;
  }

  isVerified = () => {
    return this.props.checklist.VerifiedAt !== null;
  }

  isSigned = () => {
    return this.props.checklist.SignedAt !== null;
  }

  onPressSign = () => {
    AnalyticsService.trackEvent('MCCR_SIGN');
    ApiService.signChecklist(this.props.checklist.Id)
    .then(() => {
      ApiService.canMultiSignChecklist(this.props.checklist.Id)
      .then(response => {
        this.setState({multiSignChecklists: response}, () => {
          if (this.canMultiSign()) {
            this.toggleMultiSignModal();
          }
        });
      })
      .catch(err => Alert.alert("Error", err.message));
    })
    .catch((err) => Alert.alert("Unable to sign",err.data))
    .finally(this.props.refresh)
  }

  onPressUnsign = () => {
    AnalyticsService.trackEvent('MCCR_UNSIGN');
    ApiService.unsignChecklist(this.props.checklist.Id)
    .then(this.props.refresh)
    .catch((err) => Alert.alert("Unable to unsign",err.data))
  }

  onPressVerify = () => {
    AnalyticsService.trackEvent('MCCR_VERIFY');
    ApiService.verifyChecklist(this.props.checklist.Id)
    .then(() => {
      ApiService.canMultiVerifyChecklist(this.props.checklist.Id)
      .then(response => {
        this.setState({multiVerifyChecklists: response}, () => {
          if (this.canMultiVerify()) {
            this.toggleMultiVerifyModal();
          }
        });
      })
      .catch(err => Alert.alert("Error", err.message));
    })
    .catch((err) => Alert.alert("Unable to verify",err.data))
    .finally(this.props.refresh)
  }

  onPressUnverify = () => {
    AnalyticsService.trackEvent('MCCR_UNVERIFY');
    ApiService.unverifyChecklist(this.props.checklist.Id)
    .then(this.props.refresh)
    .catch((err) => Alert.alert("Unable to unverify",err.data))
  }

  renderRow = (header, name = '', date = null) => {
    if (name.trim() === '') {
      name = '-';
      date = '-';
    }
    if (date && date != '-') {
      date = moment(date).format('DD.MM.YYYY');
    }

    return (
      <View style={styles.signatureRow}>
        <View style={[styles.signatureColumn]}><Text style={[styles.columnText,styles.headerText]}>{header}</Text></View>
        <View style={[styles.signatureColumn, styles.large]}><Text style={styles.columnText}>{name}</Text></View>
        <View style={[styles.signatureColumn]}><Text style={styles.columnText}>{date}</Text></View>
      </View>
    )
  }

  toggleMultiSignModal = () => {
    this.setState({
      showMultiSignModal: !this.state.showMultiSignModal
    })
  }

  toggleMultiVerifyModal = () => {
    this.setState({
      showMultiVerifyModal: !this.state.showMultiVerifyModal
    })
  }

  renderButtons = () => {
    if (!this.isSigned()) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressSign}>
            <Text style={[styles.buttonText,styles.primaryText]}>Sign</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (!this.isVerified()) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressUnsign}>
            <Text style={[styles.buttonText,styles.primaryText]}>Unsign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressVerify}>
            <Text style={[styles.buttonText,styles.primaryText]}>Verify</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button]} onPress={this.onPressUnverify}>
          <Text style={[styles.buttonText]}>Unverify</Text>
        </TouchableOpacity>
      </View>
      );
    }
  }

  render() {
    if (!this.props.checklist) return null;

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Signatures</Text>
        <View style={styles.signatureContainer}>
          {this.renderRow('Signed', `${this.props.checklist.SignedByFirstName || ''} ${this.props.checklist.SignedByLastName || ''}`, this.props.checklist.SignedAt)}
          {this.renderRow('Verified', `${this.props.checklist.VerifiedByFirstName || ''} ${this.props.checklist.VerifiedByLastName || ''}`, this.props.checklist.VerifiedAt)}
        </View>
        
          {this.renderButtons()}

          <Modal visible={this.state.showMultiSignModal} onRequestClose={this.toggleMultiSignModal}>
            <MultiSign checklists={this.state.multiSignChecklists} checklistId={this.props.checklist.Id} closeModal={this.toggleMultiSignModal} />
          </Modal>
          <Modal visible={this.state.showMultiVerifyModal} onRequestClose={this.toggleMultiSignModal}>
            <MultiVerify checklists={this.state.multiVerifyChecklists} checklistId={this.props.checklist.Id} closeModal={this.toggleMultiVerifyModal} />
          </Modal>
        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
  signatureColumn: {
    flex: 1
  },
  large: {
    flex: 2
  },
  signatureRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  headerText: {
    fontWeight: 'bold'
  },
  columnText: {
    fontSize: 14
  }
});

Signatures.defaultProps = {
  checklist: null
}

Signatures.propTypes = {
  checklist: propTypes.shape({
    SignedByFirstName: propTypes.string,
    SignedAt: propTypes.string,
    SignedByLastName: propTypes.string,
    SignedByUser: propTypes.string,
    VerifiedAt: propTypes.string,
    VerifiedByFirstName: propTypes.string,
    VerifiedByLastName: propTypes.string,
    VerifiedByUser: propTypes.string,
    Id: propTypes.number.isRequired
  })
}
export default Signatures;
