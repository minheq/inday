import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from './button';
import { Icon, IconName } from './icon';
import { Text, TextColor, TextWeight } from './text';
import { useTheme } from './theme';
import { tokens } from './tokens';

export interface ContextMenuItem {
  color?: TextColor;
  weight?: TextWeight;
  onPress?: () => void;
  label: string;
  icon?: IconName;
}

export interface ContextMenuContentProps {
  options: ContextMenuItem[];
  onPressed?: () => void;
  width?: number;
}

export const CONTEXT_MENU_ITEM_HEIGHT = 32;

export function ContextMenuContent(
  props: ContextMenuContentProps,
): JSX.Element {
  const { options, onPressed, width = 240 } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        theme === 'dark' ? styles.wrapperDark : styles.wrapperLight,
        { width },
      ]}
    >
      <ScrollView>
        {options.map((option) => (
          <ContextMenuButton
            onPressed={onPressed}
            key={option.label}
            option={option}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface ContextMenuButtonProps {
  option: ContextMenuItem;
  onPressed?: () => void;
}

function ContextMenuButton(props: ContextMenuButtonProps) {
  const { option, onPressed } = props;
  const { onPress, weight, color, label, icon } = option;

  const handlePress = useCallback(() => {
    if (onPress !== undefined) {
      onPress();
    }

    if (onPressed !== undefined) {
      onPressed();
    }
  }, [onPressed, onPress]);

  return (
    <Button key={label} onPress={handlePress} style={styles.button}>
      <View style={styles.iconWrapper}>{icon && <Icon name={icon} />}</View>
      <Text weight={weight} color={color}>
        {label}
      </Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 4,
    borderRadius: tokens.border.radius,
    overflow: 'hidden',
    flex: 1,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
  },
  wrapperDark: {
    backgroundColor: tokens.colors.gray[900],
  },
  wrapperLight: {
    backgroundColor: tokens.colors.base.white,
  },
  iconWrapper: {
    height: CONTEXT_MENU_ITEM_HEIGHT,
    width: 32,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: CONTEXT_MENU_ITEM_HEIGHT,
    paddingHorizontal: 8,
  },
});
