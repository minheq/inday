import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Animated,
} from 'react-native';
import { IconName, Icon } from './icon';
import { tokens, useTheme } from './theme';

export interface TextInputProps {
  icon?: IconName;
  testID?: string;
  value?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextInput(props: TextInputProps) {
  const {
    testID,
    autoFocus,
    icon,
    value,
    onChange = () => {},
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
        placeholderTextColor={theme.text.color.muted}
        style={[
          styles.input,
          tokens.text.size.md,
          !!icon && styles.hasIcon,
          // @ts-ignore
          webStyle,
        ]}
      />
    </Animated.View>
  );
}

const webStyle = {
  outline: 'none',
};

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
  input: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: tokens.radius,
    flex: 1,
  },
});
