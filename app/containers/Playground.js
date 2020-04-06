import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ChecklistView from '../pages/MCCR/Checklist/ChecklistModule/ChecklistView';

// Import the stuff you want to play with

/**
 * Root component to be used when testing out new components.
 * Helps you avoid logging in \ verifying data on each reload, and navigating trough a bunch of screens.
 */
class Playground extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 20 }}>Playground</Text>
          <Text>Play with your component here</Text>
          <Text>Do not submit changes to git repository</Text>
        </View>
        <View
          style={{
            flex: 9
          }}
        >
          <ChecklistView />
        </View>
      </View>
    );
  }
}

const MyCustomComponent = () => {
  return <Text>My Custom Component</Text>;
};

export default Playground;
