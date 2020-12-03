import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Playground } from './app/components/playground';

AppRegistry.registerComponent(appName, () => Playground);
