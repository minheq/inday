import React, { useCallback, useState, useRef, Fragment } from 'react';

import {
  StyleSheet,
  View,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Animated,
  Dimensions,
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
import { wait } from '../../lib/async/async';

interface PickerProps<TValue = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value: TValue) => void;
  renderOption?: (option: Option<TValue>, active: boolean) => React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
}

export function Picker<TValue = any>(props: PickerProps<TValue>) {
  const {
    value,
    placeholder = '',
    options,
    renderOption,
    onChange = () => {},
    searchable = false,
  } = props;
  const buttonRef = useRef<View>(null);
  const popoverRef = useRef<View>(null);
  const opacity = React.useRef(new Animated.Value(0)).current;
  const borderColor = React.useRef(new Animated.Value(0)).current;
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [ready, setReady] = useState(false);
  const [anchor, setAnchor] = useState(initialPopoverAnchor);
  const [button, setButton] = useState(initialMeasurements);
  const theme = useTheme();

  const handleClosePicker = useCallback(() => {
    setVisible(false);
    setReady(false);
    setSearch('');
  }, []);

  const handleOpenPicker = useCallback(async () => {
    const buttonMeasurements = await measure(buttonRef);
    setButton(buttonMeasurements);
    setVisible(true);

    await wait();

    const screenSize = Dimensions.get('window');
    const popoverMeasurements = await measure(popoverRef);

    const offsetTop = 4;

    const bottomY =
      buttonMeasurements.pageY + buttonMeasurements.height + offsetTop;

    if (bottomY + popoverMeasurements.height > screenSize.height) {
      setAnchor({
        x: buttonMeasurements.pageX,
        y: buttonMeasurements.pageY - offsetTop - popoverMeasurements.height,
      });
    } else {
      setAnchor({
        x: buttonMeasurements.pageX,
        y: bottomY,
      });
    }

    setReady(true);
  }, [buttonRef, popoverRef]);

  const handleSelectOption = useCallback(
    (option: Option<TValue>) => {
      handleClosePicker();
      onChange(option.value);
    },
    [onChange, handleClosePicker],
  );

  const handleChangeSearch = useCallback((text: string) => {
    setSearch(text);
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
      handleClosePicker();
      const option = options[activeIndex];
      onChange(option.value);
    }
  }, [activeIndex, options, handleClosePicker, onChange]);

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
        handleClosePicker();
      }
    },
    [activeIndex, options, handleClosePicker],
  );

  React.useEffect(() => {
    Animated.spring(borderColor, {
      toValue: focused || visible ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [borderColor, focused, visible]);

  React.useEffect(() => {
    Animated.spring(opacity, {
      toValue: ready ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [ready, opacity]);

  const selected = options.find((o) => o.value === value);
  const filteredOptions =
    search !== ''
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  return (
    <Container>
      <View ref={buttonRef}>
        <Pressable
          onPress={handleOpenPicker}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.button,
            {
              backgroundColor: theme.container.color.content,
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
        visible={visible}
        onRequestClose={handleClosePicker}
      >
        <View ref={popoverRef}>
          <Animated.View style={{ opacity }}>
            <Container
              width={button.width}
              color="content"
              padding={8}
              borderWidth={1}
              borderRadius={tokens.radius}
            >
              {searchable === true && (
                <Fragment>
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
                </Fragment>
              )}
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
          </Animated.View>
        </View>
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
