import React, { Component } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import storageService from '../../services/storageService';
import InputHistoryContainer from './InputHistoryContainer';
import Analytics from '../../services/AnalyticsService';
import propTypes from 'prop-types';

const HISTORY_PREFIX = "INPUT_HISTORY";

/**
 * @example
 * <AutoSubmitTextInput 
 *  onClear={() => {}}
 *  onSubmit={(value) => {}}
 *  minLengthBeforeSubmit={3}
 *  delay={300}
 *  text=""
 *  useHistory="UniqueInputKey"
 * />
 */
class AutoSubmitTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
      lastSubmittedText: props.text,
      focused: false,
      history: []
    };
    
    this.historyKey = `${HISTORY_PREFIX}_${props.useHistory || ""}`
    this.timer = null;
  }

  _onClear = () => {
    this.props.onClear && this.props.onClear();
  }

  _onSubmit = () => {
    this._clearTimeout();

    /*
     * Avoids sending the submit again in the following scenarios:
     * *) If the user mis-types a letter and removes it right afterwards
     * *) If the user hits the keyboards "Submit" button after the delay has kicked in.
     */
    if (this.state.text == this.state.lastSubmittedText) return;
    this.setState({
      lastSubmittedText: this.state.text
    });

    this.addToHistory(this.state.text);
    this.props.onSubmit(this.state.text);
  }

  addToHistory = (text) => {
    if (!this.props.useHistory) return;
    let oldHistory = [...this.state.history];
    let newHistory = [];
    newHistory.push(text);

    for (var i = 0; i <= 3; i++) {
      if (oldHistory[i] && oldHistory[i] != text) {
        newHistory.push(oldHistory[i]);
      }
    }
    
    storageService.setData(this.historyKey,newHistory);
    this.setState({history: newHistory});
  }

  selectHistory = (text) => {
    Analytics.trackEvent('AUTOSUBMIT_SELECTED_HISTORY_ELEMENT', {key: this.props.useHistory})
    this.onTextChange(text, this._onSubmit);
  }

  _clearTimeout = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  _clearInput = () => {
    this._clearTimeout();
    this.setState({
      text: ''
    });
    this._onClear();
  }

  _onFocus = () => {
    this.setState({focused: true});
  }
  _onBlur = () => {
    this.setState({focused: false});
  }

  onTextChange = (text, stateChangeCallback = null) => {
    this._clearTimeout();
    this.setState({
      text: text
    }, stateChangeCallback);
    if (text.length < this.props.minLengthBeforeSubmit) return;
    this.timer = setTimeout(this._onSubmit, this.props.delay);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text != this.props.text) {
      this.onTextChange(this.props.text);
    }
  }

  async componentDidMount() {
    if (this.props.useHistory) {
      let history = await storageService.getData(this.historyKey);
      if (history && history.length > 0) {
        this.setState({history});
      }
    }
  }

  render() {
    let clearInput = null;
    if (this.state.text != '' && !this.props.disabled) {
      clearInput = (
        <TouchableOpacity
          onPress={this._clearInput}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="ios-close" size={20} style={{ marginRight: 20 }} />
        </TouchableOpacity>
      );
    }
    return (
      <View>
        <View
          style={[
            this.props.style,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <TextInput
            onFocus={this._onFocus}
            onBlur={this._onBlur}
            disabled={this.props.disabled}
            placeholder={this.props.placeholder}
            style={{ flex: 1 }}
            onChangeText={this.onTextChange}
            value={this.state.text}
            onSubmitEditing={this._onSubmit}
            multiline={this.props.multiline}
          />
          {clearInput}
        </View>
        {(this.props.useHistory && this.state.focused) && (
          <InputHistoryContainer onSelect={val => this.selectHistory(val)} storageKey={this.historyKey} history={this.state.history} />
        )}
      </View>
    );
  }
}



AutoSubmitTextInput.defaultProps = {
  onSubmit: () => {},
  delay: 300,
  minLengthBeforeSubmit: 3,
  placeholder: '',
  disabled: false
};

AutoSubmitTextInput.propTypes = {
  disabled: propTypes.bool,
  onSubmit: propTypes.func.isRequired,
  delay: propTypes.number,
  minLengthBeforeSubmit: propTypes.number,
  placeholder: propTypes.string,
  useHistory: propTypes.string
}

export default AutoSubmitTextInput;
