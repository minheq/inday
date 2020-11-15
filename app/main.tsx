import React, { Suspense } from 'react';
import { RecoilRoot, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './components/theme';
import { Text } from './components';
import { ErrorBoundary } from './core/error_boundary';
import { SpaceScreen, SpaceScreenHeader } from './screens/space_screen';
import { linking, ScreenName, RootStackParamsMap } from './linking';
import {
  fieldsByIDState,
  recordsByIDState,
  spacesByIDState,
  filtersByIDState,
  workspaceState,
  sortsByIDState,
  eventsState,
} from './data/atoms';

const RootStack = createStackNavigator<RootStackParamsMap>();

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
            <NavigationContainer
              linking={linking}
              fallback={<Text>Loading...</Text>}
            >
              <RootStack.Navigator>
                <RootStack.Screen
                  name={ScreenName.Space}
                  component={SpaceScreen}
                  options={({ route, navigation }) => ({
                    headerStyle: {
                      height: 48,
                      borderBottomWidth: 0,
                    },
                    headerTitleContainerStyle: {
                      left: 0,
                      right: 0,
                      height: 48,
                    },
                    // headerBackTitleStyle: {
                    //   backgroundColor: 'blue',
                    // },
                    // headerLeftContainerStyle: {
                    //   backgroundColor: 'blue',
                    // },
                    // headerRightContainerStyle: {
                    //   backgroundColor: 'blue',
                    // },
                    headerTitle: () => (
                      <SpaceScreenHeader
                        navigation={navigation}
                        route={route}
                      />
                    ),
                  })}
                />
              </RootStack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
