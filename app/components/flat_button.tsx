import React from 'react';
import { StyleSheet, View } from 'react-native';
import { tokens } from './tokens';
import { Icon, IconName } from './icon';
import { Spacer } from './spacer';
import { Text } from './text';
import { Button } from './button';

interface FlatButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  icon?: IconName;
  color?: 'primary' | 'muted' | 'default';
  weight?: 'bold' | 'normal';
}

export function FlatButton(props: FlatButtonProps): JSX.Element {
  const {
    onPress,
    icon,
    disabled = false,
    weight = 'normal',
    title,
    color = 'default',
  } = props;

  return (
    <Button onPress={onPress} disabled={disabled} style={styles.button}>
      <View style={styles.root}>
        {icon && <Icon color={color} name={icon} />}
        <Spacer size={4} />
        {title && (
          <Text weight={weight} color={color}>
            {title}
          </Text>
        )}
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: tokens.radius,
    flexDirection: 'row',
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: tokens.radius,
  },
});
