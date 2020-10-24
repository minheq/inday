import React, { Suspense } from 'react';
import { RecoilRoot, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './components/theme';
import { Text } from './components';
import { ErrorBoundary } from './core/error_boundary';
import { SpaceScreen, SpaceScreenHeader } from './screens/space_screen';
import { linking, ScreenName, RootStackParamsMap } from './linking';
import { spacesByIDState } from './data/atoms';

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
    };
  });

  return null;
}

export function App() {
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
