import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { tokens } from './tokens';
import { Icon, IconName } from './icon';
import { Spacer } from './spacer';
import { Text } from './text';
import { Button } from './button';

interface IconButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  title?: string;
  icon?: IconName;
}

export function IconButton(props: IconButtonProps): JSX.Element {
  const { onPress, icon, disabled = false, title } = props;

  return (
    <Button onPress={onPress} disabled={disabled} style={styles.button}>
      <View style={styles.root}>
        {icon && <Icon name={icon} />}
        {title && (
          <Fragment>
            <Spacer size={4} />
            <Text size="xs">{title}</Text>
          </Fragment>
        )}
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: tokens.border.radius,
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: tokens.border.radius,
  },
});
