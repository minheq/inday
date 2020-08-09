import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  LayoutRectangle,
} from 'react-native';

interface AutoSizerProps {
  children: (size: { width: number; height: number }) => React.ReactNode;
}

export function AutoSizer(props: AutoSizerProps) {
  const { children } = props;
  const [ready, setReady] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setLayout(event.nativeEvent.layout);
    setReady(true);
  }, []);

  return (
    <View onLayout={handleLayout} style={styles.base}>
      {ready === true && children(layout)}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
