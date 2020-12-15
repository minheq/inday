import { AppRegistry } from 'react-native';
import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';

import { Text } from './app/components/text';
import { ErrorBoundary } from './app/core/error_boundary';
import { SpaceScreen } from './app/screens/space_screen';

import { Playground } from './app/components/playground';
import { Router, ScreenName } from './app/routes';
import { ThemeProvider } from './app/components/theme';

export function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <ThemeProvider>
          <Suspense fallback={<Text>Loading...</Text>}>
            <Router
              pathMap={{
                Space: {
                  path: '/space/:spaceID/:viewID',
                  component: SpaceScreen,
                },
                Playground: {
                  path: '/playground/:component',
                  component: Playground,
                },
              }}
              fallback={
                <SpaceScreen
                  name={ScreenName.Space}
                  params={{ viewID: 'viw1', spaceID: 'spc1' }}
                />
              }
            />
          </Suspense>
        </ThemeProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
