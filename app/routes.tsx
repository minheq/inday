import { EmptyObject } from 'lib/js_utils';
import {
  RouterImplementation,
  useNavigationImplementation,
} from './lib/router';

export enum ScreenName {
  Space = 'Space',
  Playground = 'Playground',
}

export type RootStackParamsMap = {
  [ScreenName.Space]: { spaceID: string; viewID: string };
  [ScreenName.Playground]: EmptyObject;
};

export type ScreenProps<T extends ScreenName> = {
  name: T;
  params: RootStackParamsMap[T];
};

export const useNavigation = useNavigationImplementation as () => {
  setParams: <T extends ScreenName>(params: RootStackParamsMap[T]) => void;
  push: <T extends ScreenName>(name: T, params: RootStackParamsMap[T]) => void;
  back: () => void;
};

export const Router = RouterImplementation as (props: {
  fallback: React.ReactNode;
  pathMap: {
    [name in ScreenName]: {
      path: string;
      component: <T extends name>(p: ScreenProps<T>) => JSX.Element;
    };
  };
}) => JSX.Element;
