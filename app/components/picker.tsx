import React, { useCallback, useState, useRef, Fragment } from 'react';

import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Animated,
} from 'react-native';
import { tokens, useTheme } from './theme';
import { Container } from './container';
import { Pressable } from './pressable';
import { Row } from './row';
import { Text } from './text';
import { Icon } from './icon';
import { TextInput } from './text_input';
import { Spacer } from './spacer';
import { Option } from './option';
import { Checkbox } from './checkbox';
import { Popover, initialPopoverAnchor } from './popover';
import { measure, initialMeasurements } from '../lib/measurements';

interface PickerProps<TValue = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value: TValue) => void;
  renderOption?: (option: Option<TValue>, active: boolean) => React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

export function Picker<TValue = any>(props: PickerProps<TValue>) {
  const {
    value,
    placeholder,
    options,
    renderOption,
    onChange = () => {},
  } = props;
  const ref = useRef<View>(null);
  const borderColor = React.useRef(new Animated.Value(0)).current;
  const [focused, setFocused] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [anchor, setAnchor] = useState(initialPopoverAnchor);
  const [button, setButton] = useState(initialMeasurements);
  const theme = useTheme();

  const handleSelectOption = useCallback(
    (option: Option<TValue>) => {
      setOpen(false);
      setSearch('');
      onChange(option.value);
    },
    [onChange],
  );

  const handleChangeSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handlePress = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleClosePopover = useCallback(() => {
    setSearch('');
    setOpen(false);
  }, []);

  const handleHoverIn = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleBlur = React.useCallback(() => {
    setFocused(false);
  }, []);

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleSubmitEditing = useCallback(() => {
    if (activeIndex !== null) {
      setOpen(false);
      const o = options[activeIndex];
      onChange(o.value);
    }
  }, [activeIndex, options, onChange]);

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (key === 'ArrowDown') {
        if (activeIndex === null || activeIndex === options.length - 1) {
          setActiveIndex(0);
        } else {
          setActiveIndex(activeIndex + 1);
        }
      } else if (key === 'ArrowUp') {
        if (activeIndex === null || activeIndex === 0) {
          setActiveIndex(options.length - 1);
        } else {
          setActiveIndex(activeIndex - 1);
        }
      } else if (key === 'Escape') {
        handleClosePopover();
      }
    },
    [activeIndex, options, handleClosePopover],
  );

  const handleLayout = useCallback((_event: LayoutChangeEvent) => {
    const offsetTop = 44;

    measure(ref).then((m) => {
      setAnchor({ x: m.pageX, y: m.pageY + offsetTop });
      setButton(m);
    });
  }, []);

  React.useEffect(() => {
    if (focused || open) {
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
  }, [borderColor, focused, open]);

  const selected = options.find((o) => o.value === value);
  const filteredOptions =
    search !== ''
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  return (
    <Container>
      <View ref={ref} onLayout={handleLayout}>
        <Pressable
          onPress={handlePress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.button,
            {
              borderColor: borderColor.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  theme.border.color.default,
                  theme.border.color.focus,
                ],
              }),
            },
          ]}
        >
          <Container center height={40} paddingHorizontal={16}>
            <Row expanded alignItems="center" justifyContent="space-between">
              <Text>{selected ? selected.label : placeholder}</Text>
              <Icon size="lg" name="chevron-down" />
            </Row>
          </Container>
        </Pressable>
      </View>
      <Popover
        anchor={anchor}
        visible={open}
        onRequestClose={handleClosePopover}
      >
        <Container
          width={button.width}
          color="content"
          padding={8}
          borderWidth={1}
          borderRadius={tokens.radius}
        >
          <TextInput
            clearable
            placeholder="Search option"
            autoFocus
            value={search}
            onChange={handleChangeSearch}
            onKeyPress={handleKeyPress}
            onSubmitEditing={handleSubmitEditing}
          />
          <Spacer size={8} />
          {filteredOptions.map((o, i) => {
            const active = i === activeIndex;

            return renderOption ? (
              renderOption(o, active)
            ) : (
              <Pressable
                onHoverIn={() => handleHoverIn(i)}
                onPress={() => handleSelectOption(o)}
                style={[
                  styles.option,
                  {
                    backgroundColor: active
                      ? theme.button.backgroundActive
                      : theme.button.backgroundDefault,
                  },
                ]}
              >
                <Container
                  height={32}
                  paddingHorizontal={8}
                  borderRadius={tokens.radius}
                >
                  <Row
                    expanded
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text>{o.label}</Text>
                    {selected && selected.value === o.value && (
                      <Checkbox value={true} />
                    )}
                  </Row>
                </Container>
              </Pressable>
            );
          })}
        </Container>
      </Popover>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: tokens.radius,
    borderWidth: 1,
  },
  optionsContainer: {
    position: 'absolute',
    top: 44,
    width: '100%',
  },
  option: {
    borderRadius: tokens.radius,
  },
});
