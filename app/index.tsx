import './firebase';
import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { ThemeProvider } from './theme';
import { Row, Text } from './components';
import { SideNavigation } from './core/side_navigation';
import { DragDropProvider } from './drag_drop/drag_drop_provider';
import { ErrorBoundary } from './core/error_boundary';
import { useGetWorkspace, useGetAllCards } from './data/atoms';
import { useInitFromStorage } from './data/init_from_storage';
import { InitWorkspace } from './data/init_workspace';
import { InitFromDB } from './data/init_from_db';

export function App() {
  const { loading, initializeState } = useInitFromStorage();

  if (loading === true) {
    return null;
  }

  return (
    <RecoilRoot initializeState={initializeState}>
      <ErrorBoundary>
        <Suspense fallback={<Text>Initializing workspace...</Text>}>
          <InitWorkspace />
          <InitFromDB />
          <ThemeProvider>
            <DragDropProvider>
              <Row expanded>
                <SideNavigation />
                <HomeContainer />
              </Row>
            </DragDropProvider>
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

function HomeContainer() {
  const workspace = useGetWorkspace();
  const cards = useGetAllCards();

  return <Text>{workspace.id}</Text>;
}
