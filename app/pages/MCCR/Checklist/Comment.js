import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import propTypes from 'prop-types';
import AutoSubmitTextInput from '../../../components/AutoSubmitTextInput/AutoSubmitTextInput';

class Comment extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Comment</Text>
        <View style={[styles.commentText, !this.props.disabled && {borderWidth: 1}]}>
          {this.props.disabled && (
            <Text>{this.props.comment || '- No comment - '}</Text>
          )}
          {!this.props.disabled && (
            <AutoSubmitTextInput 
              onClear={this.props.onClear} 
              onSubmit={this.props.onSubmit} 
              text={this.props.comment} 
              disabled={this.props.disabled} 
              multiline={true} 
              placeholder="No comment"
            />
          )}
          
        </View>
      </View>
    )
  }
}

Comment.defaultProps = {
  onClear: () => null,
  comment: '',
  disabled: false
}

const styles = StyleSheet.create({
  container: {
    margin: 15
  },
  headerText: {
    fontWeight: 'bold'
  },
  commentText: {
    marginTop: 5,
    padding: 5,
    minHeight: 50
  }
});

Comment.propTypes = {
  comment: propTypes.string,
  onClear: propTypes.func,
  onSubmit: propTypes.func.isRequired,
  disabled: propTypes.bool
}
export default Comment;
