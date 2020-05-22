import React from 'react';
import { Text, Icon, Spacing, Button } from '../components';
import { StyleSheet } from 'react-native';

interface AddCardProps {
  onPress: () => void;
}

export function AddCard(props: AddCardProps) {
  const { onPress } = props;

  return (
    <Button style={styles.base} onPress={onPress}>
      <Icon name="plus" size="lg" />
      <Spacing width={8} />
      <Text>Add card</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingLeft: 8,
    paddingRight: 16,
  },
});
