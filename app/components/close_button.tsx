import React from 'react';
import { Hover } from './hover';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from './icon';

interface CloseButtonProps {
  onPress?: () => void;
}

export function CloseButton(props: CloseButtonProps) {
  const { onPress } = props;

  return (
    <Hover>
      <TouchableOpacity style={styles.base} onPress={onPress}>
        <Icon name="x" size="xl" />
      </TouchableOpacity>
    </Hover>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
