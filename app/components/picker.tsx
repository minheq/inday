import React, { useCallback, useState, useRef, Fragment } from 'react';

import {
  View,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Animated,
  ScrollView,
  Pressable,
} from 'react-native';
import { tokens } from './tokens';
import { Text } from './text';
import { Icon } from './icon';
import { TextInput } from './text_input';
import { Popover, getPopoverAnchorAndHeight } from './popover';
import { Measurements } from '../lib/measurements';
import { isNonNullish } from '../../lib/js_utils';
import { DynamicStyleSheet } from './stylesheet';
import { NavigationKey, UIKey } from '../lib/keyboard';

export interface PickerProps<T> {
  value?: T;
  options: PickerOption<T>[];
  onChange?: (value: T) => void;
  renderOption?: (option: PickerOption<T>, active: boolean) => React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
}

export interface PickerOption<T> {
  value: T;
  label: string;
}

const OPTION_HEIGHT = 32;
const SEARCH_HEIGHT = 56;

export function Picker<T>(props: PickerProps<T>): JSX.Element {
  const {
    value,
    placeholder = '',
    options,
    renderOption,
    onChange,
    searchable = false,
  } = props;
  const buttonRef = useRef<View>(null);
  const borderColor = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [picker, setPicker] = useState({
    anchor: { x: 0, y: 0 },
    visible: false,
    buttonWidth: 0,
  });

  const selected = options.find((o) => o.value === value);
  const filteredOptions =
    search !== ''
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const contentHeight =
    filteredOptions.length * OPTION_HEIGHT +
    (searchable ? SEARCH_HEIGHT : 0) +
    16 + // vertical padding
    2; // border;

  const [height, setHeight] = useState(contentHeight);

  const handleClosePicker = useCallback(() => {
    setPicker((prevPicker) => ({ ...prevPicker, visible: false }));
    setSearch('');
  }, []);

  const handleOpenPicker = useCallback(() => {
    if (buttonRef.current !== null) {
      buttonRef.current.measure((...measurementsArgs) => {
        const buttonMeasurements = Measurements.fromArray(measurementsArgs);
        const [anchor, popoverHeight] = getPopoverAnchorAndHeight(
          buttonMeasurements,
          contentHeight,
        );

        setHeight(popoverHeight);
        setPicker({
          visible: true,
          buttonWidth: buttonMeasurements.width,
          anchor,
        });
      });
    }
  }, [buttonRef, contentHeight]);

  const handleSelectOption = useCallback(
    (option: PickerOption<T>) => {
      handleClosePicker();

      if (isNonNullish(onChange)) {
        onChange(option.value);
      }
    },
    [onChange, handleClosePicker],
  );

  const handleChangeSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handleSubmitEditing = useCallback(() => {
    if (activeIndex !== null) {
      handleClosePicker();
      const option = options[activeIndex];
      if (isNonNullish(onChange)) {
        onChange(option.value);
      }
    }
  }, [activeIndex, options, handleClosePicker, onChange]);

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      if (key === NavigationKey.ArrowDown) {
        if (activeIndex === null || activeIndex === options.length - 1) {
          setActiveIndex(0);
        } else {
          setActiveIndex(activeIndex + 1);
        }
      } else if (key === NavigationKey.ArrowUp) {
        if (activeIndex === null || activeIndex === 0) {
          setActiveIndex(options.length - 1);
        } else {
          setActiveIndex(activeIndex - 1);
        }
      } else if (key === UIKey.Escape) {
        handleClosePicker();
      }
    },
    [activeIndex, options, handleClosePicker],
  );

  React.useEffect(() => {
    Animated.spring(borderColor, {
      toValue: picker.visible ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [borderColor, picker]);

  return (
    <Fragment>
      <View ref={buttonRef}>
        <Pressable onPress={handleOpenPicker} style={styles.button}>
          <Text>{selected ? selected.label : placeholder}</Text>
          <View style={styles.caretWrapper}>
            <Icon name="CaretDown" color="default" />
          </View>
        </Pressable>
      </View>
      <Popover
        anchor={picker.anchor}
        visible={picker.visible}
        onRequestClose={handleClosePicker}
      >
        <View
          style={[
            styles.popover,
            {
              width: picker.buttonWidth + 40, // space for check icon
              height,
            },
          ]}
        >
          {searchable === true && (
            <View style={styles.searchWrapper}>
              <TextInput
                clearable
                placeholder="Search option"
                autoFocus
                value={search}
                onChange={handleChangeSearch}
                onKeyPress={handleKeyPress}
                onSubmitEditing={handleSubmitEditing}
              />
            </View>
          )}
          <ScrollView>
            <View style={styles.optionsContainer}>
              {filteredOptions.map((o, i) => {
                const active = i === activeIndex;

                return renderOption ? (
                  renderOption(o, active)
                ) : (
                  <Pressable
                    key={String(o.value)}
                    onPress={() => handleSelectOption(o)}
                    style={({ hovered }: any) => [
                      styles.option,
                      {
                        backgroundColor:
                          active || hovered
                            ? tokens.colors.lightBlue[50]
                            : tokens.colors.base.white,
                      },
                    ]}
                  >
                    <Text color={active ? 'contrast' : 'default'}>
                      {o.label}
                    </Text>
                    {selected && selected.value === o.value && (
                      <Icon name="CheckThick" color="primary" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Popover>
    </Fragment>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  button: {
    borderRadius: tokens.border.radius.default,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 24,
  },
  popover: {
    backgroundColor: tokens.colors.base.white,
    borderWidth: 1,
    borderColor: tokens.colors.gray[300],
    borderRadius: tokens.border.radius.default,
  },
  searchWrapper: {
    height: SEARCH_HEIGHT,
    padding: 8,
  },
  caretWrapper: {
    position: 'absolute',
    right: 0,
  },
  optionsContainer: {
    padding: 8,
  },
  option: {
    borderRadius: tokens.border.radius.default,
    height: OPTION_HEIGHT,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
