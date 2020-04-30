import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Hover, Icon, Spacing } from '../components';

interface AddCardProps {
  onPress: () => void;
}

export function AddCard(props: AddCardProps) {
  const { onPress } = props;

  return (
    <Hover>
      <TouchableOpacity style={styles.base} onPress={onPress}>
        <Icon name="plus" size="lg" />
        <Spacing width={8} />
        <Text>Add card</Text>
      </TouchableOpacity>
    </Hover>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    paddingLeft: 8,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
