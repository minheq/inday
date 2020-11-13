import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Animated,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  Pressable,
} from 'react-native';
import { isNonNullish } from '../../lib/js_utils';
import { IconName, Icon } from './icon';
import { useTheme } from './theme';
import { tokens } from './tokens';

export interface TextInputProps {
  icon?: IconName;
  testID?: string;
  value?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  clearable?: boolean;
  placeholder?: string;
}

export function TextInput(props: TextInputProps): JSX.Element {
  const {
    testID,
    autoFocus,
    icon,
    value,
    clearable,
    onChange,
    onKeyPress,
    onSubmitEditing,
    placeholder,
  } = props;
  const [focused, setFocused] = React.useState(false);
  const theme = useTheme();
  const borderColor = React.useRef(new Animated.Value(0)).current;

  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleClear = React.useCallback(() => {
    if (isNonNullish(onChange)) {
      onChange('');
    }
  }, [onChange]);

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
          backgroundColor: theme.background.content,
          borderColor: borderColor.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.border.default, theme.border.focus],
          }),
        },
      ]}
    >
      {icon && (
        <View style={styles.icon}>
          <Icon name={icon} color="muted" />
        </View>
      )}
      <RNTextInput
        testID={testID}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChangeText={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={onKeyPress}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor={theme.text.muted}
        style={[styles.input, tokens.text.size.md, !!icon && styles.hasIcon]}
      />
      {clearable && value !== undefined && value !== '' && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <Icon name="X" size="lg" />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: tokens.radius,
    alignItems: 'center',
    borderWidth: 1,
  },
  icon: {
    paddingHorizontal: 8,
  },
  hasIcon: {
    paddingLeft: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 8,
    borderRadius: tokens.radius,
  },
  input: {
    height: 38,
    paddingLeft: 16,
    paddingRight: 40,
    borderRadius: tokens.radius,
    flex: 1,
  },
});
