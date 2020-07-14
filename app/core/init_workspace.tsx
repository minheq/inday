import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { v4 } from 'uuid';
import { useRecoilState } from 'recoil';

import { Workspace, workspaceState } from '../data/workspace';
import { StorageKey, StorageKeyPrefix } from '../data/constants';
import { useAsync } from '../hooks/use_async';

function useInitWorkspace() {
  const [workspace, setWorkspace] = useRecoilState(workspaceState);

  const init = React.useCallback(async () => {
    if (workspace === null) {
      const newWorkspace: Workspace = {
        name: 'New workspace',
        id: v4(),
        allNoteIDs: [],
        inboxNoteIDs: [],
        listOrListGroupIDs: [],
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
