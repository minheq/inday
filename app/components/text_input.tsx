import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  View,
  Animated,
} from 'react-native';
import { useTheme, tokens } from '../theme';
import { IconName, Icon } from './icon';
import { useHoverable } from './use_hoverable';
import { useFocusable } from './use_focusable';

export interface TextInputProps {
  icon?: IconName;
  testID?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function TextInput(props: TextInputProps) {
  const { testID, icon, value, onValueChange = () => {}, placeholder } = props;
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
        styles.root,
        theme.container.shadow,
        {
          backgroundColor: theme.container.color.darkTint,
          borderColor: interaction.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
              'rgba(0, 0, 0, 0)',
              theme.border.color.default,
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
      <RNTextInput
        testID={testID}
        value={value}
        placeholder={placeholder}
        onChangeText={onValueChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onResponderStart={onPressIn}
        onResponderRelease={onPressOut}
        placeholderTextColor={theme.text.color.muted}
        style={[
          styles.input,
          theme.text.size.md,
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
  root: {
    flexDirection: 'row',
    borderRadius: tokens.radius,
    alignItems: 'center',
    borderWidth: 2,
  },
  icon: {
    paddingHorizontal: 8,
  },
  input: {
    height: 38,
    paddingRight: 8,
    borderRadius: tokens.radius,
    flex: 1,
  },
});
