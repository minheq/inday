import React from 'react';
import { WorkspaceContext } from './data/workspace';
import { FirebaseContext } from './firebase';
import { Text } from './components';

interface AppLoaderProps {
  children?: React.ReactNode;
}

export function AppLoader(props: AppLoaderProps) {
  const { children } = props;
  const { loading: firebaseLoading } = React.useContext(FirebaseContext);
  const { loading: workspaceLoading } = React.useContext(WorkspaceContext);

  const loading = workspaceLoading || firebaseLoading;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return <>{children}</>;
}
