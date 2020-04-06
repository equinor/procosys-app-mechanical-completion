import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import propTypes from 'prop-types';

/**
 * @example
 * <NavigationHeader title="Hello World" navgation={this.props.navigation}>
 *  <Button title="Custom Action" onClick={() => {}} />
 * </NavigationHeader>
 * @param {Object} props Props
 */
const NavigationHeader = (props) => {
  return (
    <View style={{maxHeight: 50, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#00000066'}}>
      <View style={{flex: 1, alignItems: 'flex-start'}}>
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.pop()}><Text style={styles.backButton}><Text style={styles.backIcon}>&#60;</Text> Back</Text></TouchableOpacity>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{fontSize: 16}}>{props.title}</Text>
      </View>
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        {props.children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 10
  },
  backButton: {
    color: 'rgb(12,96,255)',
    fontSize: 18,
  },
  backIcon: {
    fontWeight: 'bold',
    paddingRight: 10
  }
})

NavigationHeader.propTypes = {
  navigation: propTypes.object.isRequired,
  title: propTypes.string.isRequired,
  children: propTypes.any
}

export default NavigationHeader;
