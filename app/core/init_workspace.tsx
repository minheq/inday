import React from 'react';
import { v4 } from 'uuid';
import { useRecoilState } from 'recoil';

import { Workspace, workspaceState } from '../data/workspace';
import { useAsync } from '../hooks/use_async';
import { useStorage } from '../data/storage';

function useInitWorkspace() {
  const storage = useStorage();
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

      await storage.saveWorkspaceID(newWorkspace);
      await storage.saveWorkspace(newWorkspace);
    }
  }, [workspace, setWorkspace, storage]);

  useAsync('initWorkspace', init);
}

export function InitWorkspace() {
  useInitWorkspace();
  return null;
}
