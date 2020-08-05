import React, { useCallback } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { tokens, useTheme } from './theme';
import { css } from '../lib/css/css';
import { Icon } from './icon';

export interface Option<TValue extends string | number = any> {
  value: TValue;
  label: string;
  disabled?: boolean;
}

interface PickerProps<TValue extends string | number = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value: TValue) => void;
  disabled?: boolean;
}

export function Picker<TValue extends string | number = any>(
  props: PickerProps<TValue>,
) {
  const { value, options, onChange = () => {} } = props;
  const [focused, setFocused] = React.useState(false);
  const theme = useTheme();
  const borderColor = React.useRef(new Animated.Value(0)).current;

  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(event.currentTarget.value as TValue);
    },
    [onChange],
  );

  React.useEffect(() => {
    if (focused) {
      Animated.spring(borderColor, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.spring(borderColor, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [borderColor, focused]);

  return (
    <Animated.View
      style={[
        styles.base,
        {
          backgroundColor: theme.container.color.content,
          borderColor: borderColor.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.border.color.default, theme.border.color.focus],
          }),
        },
      ]}
    >
      <select
        style={webStyles('picker')}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {options.map((o) => (
          <option value={o.value} label={o.label} />
        ))}
      </select>
      <View style={styles.arrow}>
        <Icon size="lg" name="chevron-down" />
      </View>
    </Animated.View>
  );
}

const webStyles = css.create({
  picker: {
    height: 38,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: tokens.radius,
    border: 'none',
    width: '100%',
    backgroundColor: 'transparent',
    WebkitAppearance: 'none',
    ...tokens.text.size.md,
    lineHeight: `${tokens.text.size.md.lineHeight}px`,
  },
});

const styles = StyleSheet.create({
  base: {
    height: 40,
    flexDirection: 'row',
    borderRadius: tokens.radius,
    alignItems: 'center',
    borderWidth: 1,
  },
  arrow: {
    position: 'absolute',
    right: 16,
    zIndex: -1,
  },
});
