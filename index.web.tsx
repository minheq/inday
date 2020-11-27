import { AppRegistry } from 'react-native';
import React, { Suspense } from 'react';
import { RecoilRoot, useRecoilTransactionObserver_UNSTABLE } from 'recoil';

import { ThemeProvider, Text } from './app/components';
import { ErrorBoundary } from './app/core/error_boundary';
import { SpaceScreen } from './app/screens/space_screen';

import {
  fieldsByIDState,
  recordsByIDState,
  spacesByIDState,
  filtersByIDState,
  workspaceState,
  sortsByIDState,
  eventsState,
} from './app/data/atoms';
import { Playground } from './app/components/playground';
import { Router, ScreenName } from './app/routes';

declare global {
  interface Window {
    debugState: any;
  }
}

function PersistenceObserver() {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    window.debugState = {
      spacesByIDState: snapshot.getLoadable(spacesByIDState).contents,
      recordsByIDState: snapshot.getLoadable(recordsByIDState).contents,
      fieldsByIDState: snapshot.getLoadable(fieldsByIDState).contents,
      filtersByIDState: snapshot.getLoadable(filtersByIDState).contents,
      workspaceState: snapshot.getLoadable(workspaceState).contents,
      sortsByIDState: snapshot.getLoadable(sortsByIDState).contents,
      eventsState: snapshot.getLoadable(eventsState).contents,
    };
  });

  return null;
}

export function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<Text>Loading...</Text>}>
          <PersistenceObserver />
          <ThemeProvider>
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
                  params={{ viewID: '1', spaceID: '1' }}
                />
              }
            />
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root'),
});
