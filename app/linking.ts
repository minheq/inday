import { LinkingOptions } from '@react-navigation/native';

export enum ScreenName {
  Space = 'Space',
}

export type RootStackParamsMap = {
  Space: { spaceID: string; viewID: string };
};

export let linking: LinkingOptions = {
  prefixes: ['https://www.inday.io', 'inday://'],
  config: {
    screens: {
      Space: {
        path: 'space/:spaceID/:viewID',
        screens: {
          Organize: '*',
          NewFilter: '*',
          Views: '*',
        },
      },
    },
  },
};
