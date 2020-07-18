import React from 'react';
import { v4 } from 'uuid';
import { useRecoilState } from 'recoil';

import { Workspace, workspaceState } from '../data/workspace';
import { useAsync } from '../hooks/use_async';
import { useEmitEvent } from '../data/api';

function useInitWorkspace() {
  const emitEvent = useEmitEvent();
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

      emitEvent({
        name: 'WorkspaceCreated',
        workspace: newWorkspace,
      });
    }
  }, [emitEvent, workspace, setWorkspace]);

  useAsync('initWorkspace', init);
}

export function InitWorkspace() {
  useInitWorkspace();
  return null;
}
