import React from 'react';
import { Workspace } from './types';
import { v4 } from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import { useRecoilState } from 'recoil';
import { workspaceIDState, workspaceListState } from './atoms';
import { useAsync } from '../hooks/use_async';
import { StorageKey } from './storage';
import { useGetWorkspace } from './api';

function useInitWorkspace() {
  const workspace = useGetWorkspace();
  const [, setWorkspaceID] = useRecoilState(workspaceIDState);
  const [, setWorkspaceList] = useRecoilState(workspaceListState);

  const init = React.useCallback(async () => {
    if (workspace === null) {
      const newWorkspace: Workspace = {
        name: 'New workspace',
        id: v4(),
        all: [],
        inbox: [],
        typename: 'Workspace',
      };

      setWorkspaceID(newWorkspace.id);
      setWorkspaceList([newWorkspace]);
      await AsyncStorage.setItem(StorageKey.WorkspaceID, newWorkspace.id);
      await AsyncStorage.setItem(
        `Workspace:${newWorkspace.id}`,
        JSON.stringify(newWorkspace),
      );
    }
  }, [workspace, setWorkspaceList, setWorkspaceID]);

  useAsync('initWorkspace', init);
}

export function InitWorkspace() {
  useInitWorkspace();
  return null;
}
