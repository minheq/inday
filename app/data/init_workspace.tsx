import React from 'react';
import { Workspace } from './types';
import { v4 } from 'uuid';
import { db, Collection } from './db';
import AsyncStorage from '@react-native-community/async-storage';
import { useRecoilState } from 'recoil';
import { workspaceIDState } from './atoms';
import { useAsync } from '../hooks/use_async';

async function initWorkspace() {
  const workspace: Workspace = {
    name: 'New workspace',
    id: v4(),
    __typename: 'Workspace',
  };

  await db.collection(Collection.Workspaces).doc(workspace.id).set(workspace);

  return workspace;
}

function useInitWorkspace() {
  const [workspaceID, setWorkspaceID] = useRecoilState(workspaceIDState);

  const init = React.useCallback(async () => {
    if (workspaceID === '') {
      const workspace = await initWorkspace();

      await AsyncStorage.setItem('workspaceID', workspace.id);
      await AsyncStorage.setItem(
        `Workspace:${workspace.id}`,
        JSON.stringify(workspace),
      );

      setWorkspaceID(workspace.id);
    }
  }, [workspaceID, setWorkspaceID]);

  useAsync('initWorkspace', init);
}

export function InitWorkspace() {
  useInitWorkspace();
  return null;
}
