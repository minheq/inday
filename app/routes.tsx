import { EmptyObject } from 'lib/js_utils';
import { createRouter } from './lib/router';

export enum ScreenName {
  Space = 'Space',
  Playground = 'Playground',
}

export type RootStackParamsMap = {
  [ScreenName.Space]: { spaceID: string; viewID: string };
  [ScreenName.Playground]: EmptyObject;
};

export const {
  useRoute,
  useNavigation,
  Router,
  Route,
} = createRouter<RootStackParamsMap>();
