import { AppRegistry, YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['unknown call: "relay:check"']);

// Main application
import App from './app/containers/app';
AppRegistry.registerComponent('McProCoSys', () => App);

// Playground

// import Playground from './app/containers/Playground';
// AppRegistry.registerComponent('McProCoSys', () => Playground);
