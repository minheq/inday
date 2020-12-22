import { SpaceID } from '../../data/spaces';
import { ViewID } from '../../data/views';
import {
  RouterImplementation,
  useNavigationImplementation,
} from '../../lib/router';

// eslint-disable-next-line
export enum ScreenName {
  Space = 'Space',
  Playground = 'Playground',
}

export type RootStackParamsMap = {
  [ScreenName.Space]: { spaceID: SpaceID; viewID: ViewID };
  [ScreenName.Playground]: { component: string };
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
