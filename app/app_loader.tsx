import React from 'react';
import { useInitFromDB } from './data/init_from_db';
import { useInitWorkspace } from './data/init_workspace';

interface AppInitProps {
  children?: React.ReactNode;
}

export function AppInit(props: AppInitProps) {
  const { children } = props;

  useInitFromDB();
  useInitWorkspace();

  return <>{children}</>;
}
