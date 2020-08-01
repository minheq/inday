import React, { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from './components/theme';
import { Text } from './components';
import { ErrorBoundary } from './core/error_boundary';
import { SpaceScreen, SpaceScreenHeader } from './screens/space_screen';
import { linking, ScreenName, RootStackParamsMap } from './linking';

const Stack = createStackNavigator<RootStackParamsMap>();

export function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense fallback={<Text>Loading...</Text>}>
          <ThemeProvider>
            <NavigationContainer
              linking={linking}
              fallback={<Text>Loading...</Text>}
            >
              <Stack.Navigator>
                <Stack.Screen
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
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
