import React from 'react';
import { ThemeProvider } from './theme';
import { Row } from './components';
import { SideNavigation } from './core/side_navigation';
import { HomeScreen } from './screens/home';

export function App() {
  return (
    <ThemeProvider>
      <Row expanded>
        <SideNavigation />
        <HomeScreen />
      </Row>
    </ThemeProvider>
  );
}
