import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import propTypes from 'prop-types';

class Comment extends React.PureComponent {
  render() {
    if (!this.props.comment) return null;

    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Comment</Text>
        <Text style={styles.commentText}>{this.props.comment}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 15
  },
  headerText: {
    fontWeight: 'bold'
  },
  commentText: {
    marginTop: 5
  }
});

Comment.defaultProps = {
  comment: null
}

Comment.propTypes = {
  comment: propTypes.string
}
export default Comment;
