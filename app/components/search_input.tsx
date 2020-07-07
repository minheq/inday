import React from 'react';
import {
  StyleSheet,
  TextInput as RNSearchInput,
  View,
  Animated,
} from 'react-native';
import { useTheme, tokens } from '../theme';
import { IconName, Icon } from './icon';
import { useHoverable } from '../hooks/use_hoverable';
import { useFocusable } from '../hooks/use_focusable';

export interface SearchInputProps {
  icon?: IconName;
  testID?: string;
  value?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function SearchInput(props: SearchInputProps) {
  const {
    testID,
    autoFocus,
    icon,
    value,
    onChange = () => {},
    placeholder,
  } = props;
  const {
    onHoverIn,
    onHoverOut,
    onPressIn,
    onPressOut,
    isHovered,
  } = useHoverable();
  const { onBlur, onFocus, isFocused } = useFocusable();
  const theme = useTheme();
  const interaction = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isFocused) {
      Animated.spring(interaction, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else if (isHovered) {
      Animated.spring(interaction, {
        toValue: 0.5,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      Animated.spring(interaction, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    }
  }, [interaction, isHovered, isFocused]);

  return (
    <Animated.View
      // @ts-ignore
      onMouseEnter={onHoverIn}
      // @ts-ignore
      onMouseLeave={onHoverOut}
      onResponderStart={onPressIn}
      onResponderRelease={onPressOut}
      style={[
        styles.base,
        theme.container.shadow,
        {
          backgroundColor: theme.container.color.content,
          borderColor: interaction.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              theme.border.color.default,
              theme.border.color.dark,
              theme.border.color.focus,
            ],
          }),
        },
      ]}
    >
      {icon && (
        <View style={styles.icon}>
          <Icon name={icon} color="muted" />
        </View>
      )}
      <RNSearchInput
        testID={testID}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChangeSearch={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onResponderStart={onPressIn}
        onResponderRelease={onPressOut}
        placeholderSearchColor={theme.text.color.muted}
        style={[
          styles.input,
          theme.text.size.md,
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
    borderWidth: 2,
  },
  icon: {
    paddingHorizontal: 8,
  },
  hasIcon: {
    paddingLeft: 0,
  },
  input: {
    height: 38,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: tokens.radius,
    flex: 1,
  },
});
