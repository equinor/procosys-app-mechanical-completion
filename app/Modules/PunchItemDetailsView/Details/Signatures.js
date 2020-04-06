import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert, Modal} from 'react-native';
import propTypes from 'prop-types';
import moment from 'moment';
import ApiService from '../../../services/api';
import AnalyticsService from '../../../services/AnalyticsService';

class Signatures extends React.PureComponent {

  constructor(props) {
    super(props);
    
    //Signatures
    this.isVerified = this.isVerified.bind(this);
    this.isCleared = this.isCleared.bind(this);
    this.isRejected = this.isRejected.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.onPressClear = this.onPressClear.bind(this);
    this.onPressUnclear = this.onPressUnclear.bind(this);
    this.onPressVerify = this.onPressVerify.bind(this);
    this.onPressUnverify = this.onPressUnverify.bind(this);
    this.onPressReject = this.onPressReject.bind(this);
  }

  isVerified() {
    return this.props.punchDetails.VerifiedAt !== null;
  }

  isCleared() {
    return this.props.punchDetails.ClearedAt !== null;
  }

  isRejected() {
    return this.props.punchDetails.RejectedAt !== null;
  }

  handleApiResponse(apiPromise) {
    apiPromise.then(response => {
      if (response.status != 204) {
        response.text().then(text => {
          Alert.alert("Could not sign punch item", text);
        })
      } else {
        this.props.refresh();
      }
    }).catch(err => {
      Alert.alert("Failed to sign punch item", err.data);
    })
  }

  onPressClear() {
    AnalyticsService.trackEvent('PUNCH_CLEAR');
    const punchId = this.props.punchDetails.Id;
    this.handleApiResponse(ApiService.setPunchItemCleared(punchId));
  }

  onPressUnclear() {
    AnalyticsService.trackEvent('PUNCH_UNCLEAR');
    const punchId = this.props.punchDetails.Id;
    this.handleApiResponse(ApiService.setPunchItemUnclear(punchId));
  }

  onPressVerify() {
    AnalyticsService.trackEvent('PUNCH_VERIFY');
    const punchId = this.props.punchDetails.Id;
    this.handleApiResponse(ApiService.setPunchItemVerified(punchId));
  }

  onPressUnverify() {
    AnalyticsService.trackEvent('PUNCH_UNVERIFY');
    const punchId = this.props.punchDetails.Id;
    this.handleApiResponse(ApiService.setPunchItemUnverified(punchId));
  }

  onPressReject() {
    AnalyticsService.trackEvent('PUNCH_REJECT');
    const punchId = this.props.punchDetails.Id;
    this.handleApiResponse(ApiService.setPunchItemRejected(punchId));
  }

  renderRow(header, name = '', date = null) {
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

  renderButtons() {
    if (!this.isCleared() || this.isRejected()) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressClear}>
            <Text style={[styles.buttonText,styles.primaryText]}>Clear</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (!this.isVerified()) {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressUnclear}>
            <Text style={[styles.buttonText,styles.primaryText]}>Unclear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressReject}>
            <Text style={[styles.buttonText,styles.primaryText]}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primary]} onPress={this.onPressVerify}>
            <Text style={[styles.buttonText,styles.primaryText]}>Verify</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.isVerified()) {
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
    if (!this.props.punchDetails) return null;
    const {ClearedByFirstName, ClearedByLastName, ClearedAt, VerifiedByFirstName, VerifiedByLastName, VerifiedAt, RejectedByFirstName, RejectedByLastName, RejectedAt} = this.props.punchDetails;
    return (
      <View style={styles.container}>
        <View style={styles.signatureContainer}>
          {this.renderRow('Cleared', `${ClearedByFirstName || ''} ${ClearedByLastName || ''}`, ClearedAt)}
          {this.renderRow('Verified', `${VerifiedByFirstName || ''} ${VerifiedByLastName || ''}`, VerifiedAt)}
          {this.renderRow('Rejected', `${RejectedByFirstName || ''} ${RejectedByLastName || ''}`, RejectedAt)}
        </View>
          {this.renderButtons()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
  },
  columnText: {
    fontSize: 14
  }
});

Signatures.defaultProps = {
  checklist: null
}

Signatures.propTypes = {
  punchDetails: propTypes.shape({
    SignedByFirstName: propTypes.string,
    SignedAt: propTypes.string,
    SignedByLastName: propTypes.string,
    VerifiedAt: propTypes.string,
    VerifiedByFirstName: propTypes.string,
    VerifiedByLastName: propTypes.string,
    RejectedAt: propTypes.string,
    RejectedByFirstName: propTypes.string,
    RejectedByLastName: propTypes.string,
    Id: propTypes.number.isRequired
  })
}
export default Signatures;
