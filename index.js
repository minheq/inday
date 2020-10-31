import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Default } from './app/core/grid.stories';

AppRegistry.registerComponent(appName, () => Default);
