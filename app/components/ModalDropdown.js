/**
 * Shamelessly stolen from https://github.com/sohobloo/react-native-modal-dropdown
 * Rewritten some critical parts as the original component was using deprecated stuff. 
 */

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';
import colors from '../stylesheets/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const ROW_HEIGHT = 48;
let MAX_ROWS = 5;

/**
 * @example
 * <ModalDropdown
 *  disabled={false}
 *  defaultIndex={-1}
 *  defaultValue="Please select..."
 *  options=[]
 *  accessible={true}
 *  animated={true}
 *  showsVerticalScrollIndicator={true}
 *  keyboardShouldPersistTaps="never"
 *  
 *  style={}
 *  textStyle={}
 *  dropdownStyle={}
 *  dropdownTextStyle={}
 *  dropdownTextHighlightStyle={}
 *  fullWidth={bool}
 * 
 *  adjustFrame={({height, top, left}) => {height, top, left}}
 *  renderRow={({rowData, rowID, highlighted}) => (<Component />)}
 *  renderSeparator={({sectionID, rowID, adjacentRowHighlighted})}
 *  renderButtonText={({rowData}) => "string"}
 * 
 *  onDropdownWillShow={() => {}}
 *  onDropdownWillHide={() => {}}
 *  onSelect={(rowID, rowData) => bool}
 * />
 */
export default class ModalDropdown extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,

    accessible: PropTypes.bool,
    animated: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.string,

    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    fullWidth: PropTypes.bool,

    adjustFrame: PropTypes.func,
    renderRow: PropTypes.func,
    renderSeparator: PropTypes.func,
    renderButtonText: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    defaultIndex: -1,
    defaultValue: 'Please select...',
    options: null,
    // Renders the dropdown to the same width as the input field
    fullWidth: false,
    animated: true,
    showsVerticalScrollIndicator: true,
    keyboardShouldPersistTaps: 'never'
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._buttonFrame = null;

    this.state = {
      accessible: !!props.accessible,
      loading: !props.options,
      showDropdown: false,
    };
    
  }

  render() {
    return (
      <View {...this.props}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  _updatePosition(callback) {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = {x: px, y: py, w: width, h: height};
        callback && callback();
      });
    }
  }

  show() {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false
    });
  }

  _renderButton() {
    const {disabled, accessible, children, textStyle, defaultValue} = this.props;

    return (
      <TouchableOpacity ref={button => this._button = button}
                        disabled={disabled}
                        accessible={accessible}
                        onPress={this._onButtonPress}
      >
        {
          children ||
          (
            <View style={[styles.button, disabled && styles.disabledButton]}>
              <Text style={[styles.buttonText, {flex: 1}, textStyle]}
                    numberOfLines={1}
              >
                {defaultValue}
              </Text>
              <View style={{minWidth: 32,maxWidth: 32, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="ios-arrow-down" size={16} />
              </View>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }

  _onButtonPress = () => {
    const {onDropdownWillShow} = this.props;
    if (!onDropdownWillShow ||
      onDropdownWillShow() !== false) {
      this.show();
    }
  };

  _renderModal() {
    const {animated, accessible, dropdownStyle} = this.props;
    const {showDropdown, loading} = this.state;
    if (showDropdown && this._buttonFrame) {
      const frameStyle = this._calcPosition();
      const animationType = animated ? 'fade' : 'none';

      return (
        <Modal animationType={animationType}
               visible={true}
               transparent={true}
               onRequestClose={this._onRequestClose}
               supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        >
          <TouchableWithoutFeedback accessible={accessible}
                                    disabled={!showDropdown}
                                    onPress={this._onModalPress}
          >
            <View style={styles.modal}>
              <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
                {loading ? this._renderLoading() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  _calcPosition() {
    const {dropdownStyle, style, adjustFrame, fullWidth} = this.props;

    const dimensions = Dimensions.get('window');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;

    let defaultHeight = StyleSheet.flatten(styles.dropdown).height;
    if (this.props.options.length < MAX_ROWS) {
      defaultHeight = (ROW_HEIGHT + StyleSheet.hairlineWidth) * this.props.options.length;
    }
    const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
    defaultHeight;

    const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    const rightSpace = windowWidth - this._buttonFrame.x;
    const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    const showInLeft = rightSpace >= this._buttonFrame.x;

    const positionStyle = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      positionStyle.left = this._buttonFrame.x;
      if (fullWidth) {
        positionStyle.width = this._buttonFrame.w;
      }
    } else {
      const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) || -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - this._buttonFrame.w;
    }

    return adjustFrame ? adjustFrame(positionStyle) : positionStyle;
  }

  _onRequestClose = () => {
    const {onDropdownWillHide} = this.props;
    if (!onDropdownWillHide ||
      onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _onModalPress = () => {
    const {onDropdownWillHide} = this.props;
    if (!onDropdownWillHide ||
      onDropdownWillHide() !== false) {
      this.hide();
    }
  };

  _renderLoading() {
    return (
      <ActivityIndicator size='small'/>
    );
  }

  _renderDropdown() {
    const {renderSeparator, options} = this.props;
    return (
      <FlatList
                style={styles.list}
                data={options}
                renderItem={({item, index}) => this._renderRow(item, index)}
                keyExtractor={(item, index) => {return `itm_${index}`}}
                itemSeparatorComponent={renderSeparator ? renderSeparator() : this._renderSeparator()}
      />
    );
  }

  _renderRow = (rowData, rowIndex) => {
    const {renderRow, dropdownTextStyle, dropdownTextHighlightStyle, accessible, defaultIndex} = this.props;
    const key = `row_${rowIndex}`;
    const highlighted = rowIndex == defaultIndex;
    const row = !renderRow ?
      (<Text style={[
        styles.rowText,
        dropdownTextStyle,
        highlighted && styles.highlightedRowText,
        highlighted && dropdownTextHighlightStyle
      ]}
      >
        {rowData}
      </Text>) :
      renderRow(rowData, rowIndex, highlighted);
    const preservedProps = {
      key,
      accessible,
      onPress: () => this._onRowPress(rowData, rowIndex),
    };
    return (
      <TouchableHighlight {...preservedProps} style={{justifyContent: 'center'}}>
        {row}
      </TouchableHighlight>
    );
  };

  _onRowPress(rowData, rowIndex) {
    const {onSelect, onDropdownWillHide} = this.props;
    if (onSelect) {
      onSelect(rowIndex, rowData);
    }
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.setState({
        showDropdown: false
      });
    }
  }

  _renderSeparator = (rowIndex) => {
    const key = `spr_${rowIndex}`;
    return (
      <View style={styles.separator}
            key={key}
      />
    );
  };
}

let styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.BORDER_COLOR,
    padding: 16,
    backgroundColor: '#FFF'
  },
  disabledButton: {
    backgroundColor: '#F3F3F3'
  },
  buttonText: {
    fontSize: 16
  },
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    height: (ROW_HEIGHT + StyleSheet.hairlineWidth) * MAX_ROWS, //Default, Overwritten in _calcPosition()
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E3E5E7',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loading: {
    alignSelf: 'center'
  },
  list: {
    //flexGrow: 1,
  },
  rowText: {
    padding: 16,
    color: colors.TEXT_COLOR,
    backgroundColor: 'white',
    textAlignVertical: 'center',
    fontSize: 16
  },
  highlightedRowText: {
    color: 'black',
    backgroundColor: '#F2F9FC'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray'
  }
});
