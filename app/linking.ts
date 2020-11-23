import { LinkingOptions } from '@react-navigation/native';

export enum ScreenName {
  Space = 'Space',
  Playground = 'Playground',
}

export type RootStackParamsMap = {
  Space: { spaceID: string; viewID: string };
  Playground: { component: string };
};

export let linking: LinkingOptions = {
  prefixes: ['https://www.inday.io', 'inday://'],
  config: {
    screens: {
      Space: {
        path: 'space/:spaceID/:viewID',
      },
      Playground: {
        path: 'playground',
      },
    },
  },
};
