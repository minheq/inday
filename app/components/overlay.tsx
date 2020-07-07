import React from 'react';
import { StyleSheet, View } from 'react-native';
import { usePressability, PressabilityConfig } from './pressability';

interface OverlayContext {
  visible: boolean;
  onOpen: (node?: React.ReactNode) => void;
  onRequestClose: () => void;
}

const OverlayContext = React.createContext<OverlayContext>({
  visible: false,
  onOpen: () => {},
  onRequestClose: () => {},
});

export function useOverlay() {
  return React.useContext(OverlayContext);
}

interface OverlayProviderProps {
  children?: React.ReactNode;
}

interface OverlayState {
  visible: boolean;
  node: React.ReactNode;
}

export function OverlayProvider(props: OverlayProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<OverlayState>({
    visible: false,
    node: null,
  });

  const handleOpen = React.useCallback((node?: React.ReactNode) => {
    setState({ visible: true, node });
  }, []);

  const handleRequestClose = React.useCallback(() => {
    setState({ visible: false, node: null });
  }, []);

  const config: PressabilityConfig = React.useMemo(
    () => ({
      onPress: handleRequestClose,
    }),
    [handleRequestClose],
  );

  const eventHandlers = usePressability(config);

  return (
    <OverlayContext.Provider
      value={{
        visible: state.visible,
        onOpen: handleOpen,
        onRequestClose: handleRequestClose,
      }}
    >
      {state.visible && (
        <View style={styles.base}>
          <View style={styles.background} {...eventHandlers} />
          {state.node}
        </View>
      )}
      {children}
    </OverlayContext.Provider>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
