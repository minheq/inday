import React from 'react';
import { ThemeProvider } from './theme';
import { Row, NavigationProvider, Screen } from './components';
import { SideNavigation } from './core/side_navigation';
import { HomeScreen } from './screens/home';
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
        <HomeScreen />
      </NavigationProvider>
    </Screen>
  );
}
