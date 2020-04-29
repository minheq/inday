import React from 'react';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import { useTheme, tokens } from '../theme';
import { Interactive } from './interactive';
import { IconName, Icon } from './icon';

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
  const {
    testID,
    icon,
    value,
    onValueChange = () => {},
    placeholder,
    onFocus: propOnFocus,
    onBlur: propOnBlur,
  } = props;

  const theme = useTheme();

  return (
    <Interactive onBlur={propOnBlur} onFocus={propOnFocus}>
      {({ onBlur, onFocus }) => (
        <View
          style={[
            styles.root,
            theme.container.shadow,
            { backgroundColor: theme.container.color.content },
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
            placeholderTextColor={theme.text.color.muted}
            style={[
              styles.input,
              theme.text.size.md,
              // @ts-ignore
              webStyle,
            ]}
          />
        </View>
      )}
    </Interactive>
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
  },
  icon: {
    paddingHorizontal: 8,
  },
  input: {
    paddingVertical: 8,
    paddingRight: 8,
    borderRadius: tokens.radius,
    flex: 1,
  },
});
