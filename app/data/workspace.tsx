import React from 'react';
import { Workspace } from './types';
import { v4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import { useRecoilState } from 'recoil';
import { useAsync } from '../hooks/use_async';
import { StorageKey, StorageKeyPrefix } from './storage';
import { workspaceState } from './atoms';

function useInitWorkspace() {
  const [workspace, setWorkspace] = useRecoilState(workspaceState);

  const init = React.useCallback(async () => {
    if (workspace === null) {
      const newWorkspace: Workspace = {
        name: 'New workspace',
        id: v4(),
        all: [],
        inbox: [],
        typename: 'Workspace',
      };

      setWorkspace(newWorkspace);

      await AsyncStorage.setItem(StorageKey.WorkspaceID, newWorkspace.id);
      await AsyncStorage.setItem(
        `${StorageKeyPrefix.Workspace}:${newWorkspace.id}`,
        JSON.stringify(newWorkspace),
      );
    }
  }, [workspace, setWorkspace]);

  useAsync('initWorkspace', init);
}

export function InitWorkspace() {
  useInitWorkspace();
  return null;
}
