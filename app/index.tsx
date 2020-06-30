import './firebase';
import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { ThemeProvider } from './theme';
import { Row, Text } from './components';
import { SideNavigation } from './core/side_navigation';
import { DragDropProvider } from './drag_drop/drag_drop_provider';
import { ErrorBoundary } from './core/error_boundary';
import { InitWorkspace } from './data/init_workspace';
import { InboxScreen } from './screens/inbox';

export function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<Text>Initializing workspace...</Text>}>
          <InitWorkspace />
          <Suspense fallback={<Text>Loading...</Text>}>
            <ThemeProvider>
              <DragDropProvider>
                <Row expanded>
                  <SideNavigation />
                  <HomeContainer />
                </Row>
              </DragDropProvider>
            </ThemeProvider>
          </Suspense>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

function HomeContainer() {
  return <InboxScreen />;
}
