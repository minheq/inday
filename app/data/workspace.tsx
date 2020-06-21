import React from 'react';
import { queryCache } from 'react-query';
import { v4 } from 'uuid';
import { useFindOrCreateWorkspace } from './api';

export interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceIDContext {
  workspaceID: string;
}

export const WorkspaceContext = React.createContext<WorkspaceIDContext>({
  workspaceID: '',
});

interface WorkspaceIDProviderProps {
  children?: React.ReactNode;
}

export function useWorkspaceID() {
  const { workspaceID } = React.useContext(WorkspaceContext);

  return workspaceID;
}

export function WorkspaceIDProvider(props: WorkspaceIDProviderProps) {
  const { children } = props;
  const findOrCreateWorkspace = useFindOrCreateWorkspace();
  const [value] = React.useState<WorkspaceIDContext>({
    workspaceID: window.localStorage.getItem('workspaceID') || v4(),
  });

  const { workspaceID } = value;

  React.useEffect(() => {
    findOrCreateWorkspace(workspaceID).then((workspace) => {
      queryCache.setQueryData('workspace', workspace);
      window.localStorage.setItem('workspaceID', workspaceID);
    });
  }, [workspaceID, findOrCreateWorkspace]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
