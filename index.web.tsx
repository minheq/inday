import React from 'react';
import { AppRegistry } from 'react-native';
import { TimelineScreen } from './app/screens/timeline';

function App() {
  return <TimelineScreen />;
}

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
