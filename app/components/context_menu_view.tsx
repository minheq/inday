import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PressableHighlight } from './pressable_highlight';
import { Icon, IconName } from './icon';
import { Text, TextColor, TextWeight } from './text';
import { tokens } from './tokens';

export interface ContextMenuItem {
  color?: TextColor;
  weight?: TextWeight;
  onPress?: () => void;
  label: string;
  icon?: IconName;
}

export interface ContextMenuViewProps {
  options: ContextMenuItem[];
  onPressed?: () => void;
  width?: number;
}

export const CONTEXT_MENU_ITEM_HEIGHT = 32;

export function ContextMenuView(props: ContextMenuViewProps): JSX.Element {
  const { options, onPressed, width = 240 } = props;

  return (
    <View style={[styles.wrapper, { width }]}>
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
    <PressableHighlight key={label} onPress={handlePress} style={styles.button}>
      <View style={styles.iconWrapper}>{icon && <Icon name={icon} />}</View>
      <Text weight={weight} color={color}>
        {label}
      </Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  iconWrapper: {
    height: CONTEXT_MENU_ITEM_HEIGHT,
    width: 32,
    paddingRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: tokens.border.radius,
    flexDirection: 'row',
    alignItems: 'center',
    height: CONTEXT_MENU_ITEM_HEIGHT,
    paddingHorizontal: 8,
  },
});
