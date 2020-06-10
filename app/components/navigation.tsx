import React from 'react';
import { Animated, StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { last, secondLast } from '../utils/arrays';

interface NavigationContext {
  navigate: (screen: React.ReactNode) => void;
  back: () => void;
  canGoBack: boolean;
}

const NavigationContext = React.createContext<NavigationContext>({
  navigate: () => {},
  back: () => {},
  canGoBack: false,
});

interface NavigationProviderProps {
  children?: React.ReactNode;
}

export function useNavigation() {
  return React.useContext(NavigationContext);
}

interface Screen {
  visibility: Animated.Value;
  node: React.ReactNode;
}

interface State {
  screens: Screen[];
  width: number;
}

const OFFSET_WIDTH = 160;

export function NavigationProvider(props: NavigationProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<State>({
    screens: [{ node: children, visibility: new Animated.Value(0) }],
    width: 0,
  });

  const handleNavigate = React.useCallback(
    (node: React.ReactNode) => {
      const { screens, width } = state;
      const prevScreen = last(screens);
      const nextScreen = { node, visibility: new Animated.Value(width) };

      setState({
        screens: screens.concat(nextScreen),
        width,
      });

      Animated.parallel([
        Animated.spring(prevScreen.visibility, {
          toValue: -OFFSET_WIDTH,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.spring(nextScreen.visibility, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [state],
  );

  const handleBack = React.useCallback(() => {
    const { screens, width } = state;
    const prevScreen = secondLast(screens);
    const nextScreen = last(screens);

    Animated.parallel([
      Animated.spring(nextScreen.visibility, {
        toValue: width,
        bounciness: 0,
        useNativeDriver: true,
      }),
      Animated.spring(prevScreen.visibility, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setState({
        screens: screens.slice(0, screens.length - 1),
        width,
      });
    });
  }, [state]);

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { screens } = state;

      setState({
        screens,
        width: event.nativeEvent.layout.width,
      });
    },
    [state],
  );

  const { screens } = state;

  const canGoBack = screens.length > 1;

  return (
    <NavigationContext.Provider
      value={{
        navigate: handleNavigate,
        back: handleBack,
        canGoBack,
      }}
    >
      <View style={styles.container} onLayout={handleLayout}>
        {screens.map((screen, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                styles.screen,
                {
                  transform: [{ translateX: screen.visibility }],
                  zIndex: index,
                },
              ]}
            >
              {screen.node}
            </Animated.View>
          );
        })}
      </View>
    </NavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  screen: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});
