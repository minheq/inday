import React from 'react';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { TimelineScreen } from './app/screens/timeline';

function App() {
  return <TimelineScreen />;
}

AppRegistry.registerComponent(appName, () => App);
