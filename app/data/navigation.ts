import React from 'react';
import { atom, useRecoilState } from 'recoil';

import { useStorage } from './storage';

export const NavigationAtomKey = 'Navigation';

export enum Location {
  All = 'All',
  Inbox = 'Inbox',
  List = 'List',
  Trash = 'Trash',
}

export const navigationState = atom<NavigationState>({
  key: NavigationAtomKey,
  default: { location: Location.Inbox, noteID: '' },
});

export type NavigationState =
  | { location: Location.All; noteID: string }
  | { location: Location.Inbox; noteID: string }
  | { location: Location.Trash; noteID: string }
  | {
      location: Location.List;
      listID: string;
      noteID: string;
    };

export function useNavigation() {
  const storage = useStorage();
  const [navigation, setNavigation] = useRecoilState(navigationState);

  const handleNavigate = React.useCallback(
    (newState: NavigationState) => {
      setNavigation(newState);

      storage.saveNavigationState(newState);
    },
    [setNavigation, storage],
  );

  return {
    state: navigation,
    navigate: handleNavigate,
  };
}
