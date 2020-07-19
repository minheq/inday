import React from 'react';
import { v4 } from 'uuid';
import { useRecoilState } from 'recoil';

import { Workspace, workspaceState } from '../data/workspace';
import { useAsync } from '../hooks/use_async';
import { useEventEmitter } from '../data/events';

function useInitWorkspace() {
  const eventEmitter = useEventEmitter();
  const [workspace, setWorkspace] = useRecoilState(workspaceState);

  const init = React.useCallback(async () => {
    if (workspace === null) {
      const newWorkspace: Workspace = {
        name: 'New workspace',
        id: v4(),
        typename: 'Workspace',
      };

      setWorkspace(newWorkspace);

      // We cannot use useEmitEvent() yet because workspace has not been loaded
      eventEmitter.emit({
        name: 'WorkspaceCreated',
        workspace: newWorkspace,
        createdAt: new Date(),
        workspaceID: newWorkspace.id,
        typename: 'Event',
      });
    }
  }, [eventEmitter, workspace, setWorkspace]);

  useAsync('initWorkspace', init);
}

export function InitWorkspace() {
  useInitWorkspace();
  return null;
}
