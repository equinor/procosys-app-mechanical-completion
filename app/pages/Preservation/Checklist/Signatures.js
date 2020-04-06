import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import propTypes from 'prop-types';
import moment from 'moment';
import ApiService from '../../../services/api';
import AnalyticsService from '../../../services/AnalyticsService';

class Signatures extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  isVerified = () => {
    return this.props.checklist.VerifiedAt !== null;
  }

  isSigned = () => {
    return this.props.checklist.SignedAt !== null;
  }

  onPressSign = () => {
    AnalyticsService.trackEvent('PRESERVATION_SIGN');
    ApiService.signPreservationChecklist(this.props.checklist.Id)
    .catch((err) => Alert.alert("Unable to sign",err.data))
    .finally(this.props.refresh)
  }

  onPressUnsign = () => {
    AnalyticsService.trackEvent('PRESERVATION_UNSIGN');
    ApiService.unsignPreservationChecklist(this.props.checklist.Id)
    .then(this.props.refresh)
    .catch((err) => Alert.alert("Unable to unsign",err.data))
  }

  onPressVerify = () => {
    AnalyticsService.trackEvent('PRESERVATION_VERIFY');
    ApiService.verifyPreservationChecklist(this.props.checklist.Id)
    .catch((err) => Alert.alert("Unable to verify",err.data))
    .finally(this.props.refresh)
  }

  onPressUnverify = () => {
    AnalyticsService.trackEvent('PRESERVATION_UNVERIFY');
    ApiService.unverifyPreservationChecklist(this.props.checklist.Id)
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
