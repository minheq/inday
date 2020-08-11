import React, { Suspense } from 'react';
import { RecoilRoot, useTransactionObservation_UNSTABLE } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './components/theme';
import { Text } from './components';
import { ErrorBoundary } from './core/error_boundary';
import { SpaceScreen, SpaceScreenHeader } from './screens/space_screen';
import { linking, ScreenName, RootStackParamsMap } from './linking';

const RootStack = createStackNavigator<RootStackParamsMap>();

function PersistenceObserver() {
  useTransactionObservation_UNSTABLE(
    ({ atomValues, atomInfo, modifiedAtoms }) => {
      for (const modifiedAtom of modifiedAtoms) {
        window[`atom__${modifiedAtom}`] = atomValues.get(modifiedAtom);
      }
    },
  );

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
