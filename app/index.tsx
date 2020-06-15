import React from 'react';
import { ThemeProvider } from './theme';
import { Row, NavigationProvider, Screen } from './components';
import { SideNavigation } from './core/side_navigation';
import { InboxScreen } from './screens/inbox';
import { CardStoreProvider } from './data/card';

export function App() {
  return (
    <ThemeProvider>
      <CardStoreProvider>
        <Row expanded>
          <SideNavigation />
          <HomeContainer />
        </Row>
      </CardStoreProvider>
    </ThemeProvider>
  );
}

function HomeContainer() {
  return (
    <Screen>
      <NavigationProvider>
        <InboxScreen />
      </NavigationProvider>
    </Screen>
  );
}
