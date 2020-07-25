import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { ThemeProvider } from './components/theme';
import { Text } from './components';
import { ErrorBoundary } from './core/error_boundary';

export function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<Text>Loading...</Text>}>
          <ThemeProvider>
            <SpaceScreen />
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

function SpaceScreen() {
  return null;
}

function SpaceHeader() {
  return null;
}

function CollectionsMenu() {}
