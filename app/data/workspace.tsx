import React from 'react';
import { Collection, useDB } from './db';
import { useFirebase } from '../firebase';

export interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceContext {
  workspace: Workspace;
  loading: boolean;
}

export const WorkspaceContext = React.createContext<WorkspaceContext>({
  workspace: {
    id: '',
    name: '',
  },
  loading: true,
});

interface WorkspaceProviderProps {
  children?: React.ReactNode;
}

export function useWorkspace() {
  const { workspace } = React.useContext(WorkspaceContext);

  return workspace;
}

export function useWorkspaceCardsCollection() {
  const workspace = useWorkspace();
  const db = useDB();

  return db
    .collection(Collection.Workspaces)
    .doc(workspace.id)
    .collection(Collection.Cards);
}

export function WorkspaceProvider(props: WorkspaceProviderProps) {
  const { children } = props;
  const { db } = useFirebase();
  const [value, setValue] = React.useState<WorkspaceContext>({
    loading: true,
    workspace: {
      id: '',
      name: '',
    },
  });

  const createNewWorkspace = React.useCallback(async () => {
    if (!db) {
      return;
    }
    const docRef = await db.collection(Collection.Workspaces).add({
      name: 'New workspace',
    });

    return docRef.get();
  }, [db]);

  React.useEffect(() => {
    if (!db) {
      return;
    }

    const workspaceID = window.localStorage.getItem('workspaceID');

    if (!workspaceID) {
      createNewWorkspace()
        .then((workspace) => {
          if (workspace) {
            window.localStorage.setItem('workspaceID', workspace.id);
          }
        })
        .catch((error) => {
          console.log('Error creating document:', error);
        });
    } else {
      db.collection(Collection.Workspaces)
        .doc(workspaceID)
        .get()
        .then((doc) => {
          const workspace = doc.data();

          if (workspace) {
            setValue({
              loading: false,
              workspace: {
                id: doc.id,
                name: workspace.name,
              },
            });
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    }
  }, [db, createNewWorkspace]);

  if (value.loading) {
    return null;
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
