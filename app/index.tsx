import React from 'react';
import { TimelineScreen } from './screens/timeline';
import { AppProvider } from './app_provider';
import { Row } from './components';
import { SideNavigation } from './core/side_navigation';

export function App() {
  return (
    <AppProvider>
      <Row expanded>
        <SideNavigation />
        <TimelineScreen />
      </Row>
    </AppProvider>
  );
}
