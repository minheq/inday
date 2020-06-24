import React from 'react';
import { FirebaseContext } from './firebase';
import { Text } from './components';

interface AppLoaderProps {
  children?: React.ReactNode;
}

export function AppLoader(props: AppLoaderProps) {
  const { children } = props;
  const { loading: firebaseLoading } = React.useContext(FirebaseContext);

  const loading = firebaseLoading;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return <>{children}</>;
}
