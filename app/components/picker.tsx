import React, { useCallback, useState, useRef, Fragment } from 'react';

import {
  StyleSheet,
  View,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { tokens, useTheme } from './theme';
import { Container } from './container';
import { Pressable } from './pressable';
import { Row } from './row';
import { Text } from './text';
import { Icon } from './icon';
import { TextInput } from './text_input';
import { Option } from './option';
import { Checkbox } from './checkbox';
import { Popover, initialPopoverAnchor, PopoverAnchor } from './popover';
import { measure, initialMeasurements } from '../lib/measurements';

export interface PickerProps<TValue = any> {
  value?: TValue;
  options: Option<TValue>[];
  onChange?: (value: TValue) => void;
  renderOption?: (option: Option<TValue>, active: boolean) => React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
}

const OPTION_HEIGHT = 40;
const SEARCH_HEIGHT = 56;
const PICKER_OFFSET = 4;
const SCREEN_OFFSET = 16;

export function Picker<TValue = any>(props: PickerProps<TValue>): JSX.Element {
  const {
    value,
    placeholder = '',
    options,
    renderOption,
    onChange = () => {},
    searchable = false,
  } = props;
  const buttonRef = useRef<View>(null);
  const borderColor = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [picker, setPicker] = useState({
    anchor: initialPopoverAnchor,
    visible: false,
    button: initialMeasurements,
  });
  const theme = useTheme();

  const selected = options.find((o) => o.value === value);
  const filteredOptions =
    search !== ''
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const popoverHeight = filteredOptions.length * OPTION_HEIGHT + SEARCH_HEIGHT;
  const [height, setHeight] = useState(popoverHeight);

  const handleClosePicker = useCallback(() => {
    setPicker((prevPicker) => ({ ...prevPicker, visible: false }));
    setSearch('');
  }, []);

  const handleOpenPicker = useCallback(async () => {
    const button = await measure(buttonRef);

    const screenSize = Dimensions.get('window');

    const bottomY = button.pageY + button.height + PICKER_OFFSET;
    const topY = button.pageY - PICKER_OFFSET - popoverHeight;

    const overflowsBottom = bottomY + popoverHeight > screenSize.height;

    let anchor: PopoverAnchor = initialPopoverAnchor;

    if (overflowsBottom) {
      const heightIfBottomY = screenSize.height - bottomY;
      const heightIfTopY = button.pageY;

      if (heightIfTopY < heightIfBottomY) {
        anchor = {
          x: button.pageX,
          y: bottomY,
        };

        if (screenSize.height - bottomY < popoverHeight) {
          setHeight(screenSize.height - bottomY - SCREEN_OFFSET);
        }
      } else {
        if (topY < 0) {
          setHeight(button.pageY - SCREEN_OFFSET);
          anchor = {
            x: button.pageX,
            y: SCREEN_OFFSET,
          };
        } else {
          anchor = {
            x: button.pageX,
            y: topY,
          };
        }
      }
    } else {
      anchor = {
        x: button.pageX,
        y: bottomY,
      };
    }

    setPicker({
      visible: true,
      button,
      anchor,
    });
  }, [buttonRef, popoverHeight]);

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
      toValue: picker.visible ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  }, [borderColor, picker]);

  return (
    <Fragment>
      <View ref={buttonRef}>
        <Pressable
          onPress={handleOpenPicker}
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
        anchor={picker.anchor}
        visible={picker.visible}
        onRequestClose={handleClosePicker}
      >
        <Container
          width={picker.button.width}
          height={height}
          color="content"
          borderWidth={1}
          borderRadius={tokens.radius}
        >
          {searchable === true && (
            <Container height={SEARCH_HEIGHT} padding={8}>
              <TextInput
                clearable
                placeholder="Search option"
                autoFocus
                value={search}
                onChange={handleChangeSearch}
                onKeyPress={handleKeyPress}
                onSubmitEditing={handleSubmitEditing}
              />
            </Container>
          )}
          <ScrollView>
            <Container padding={8}>
              {filteredOptions.map((o, i) => {
                const active = i === activeIndex;

                return renderOption ? (
                  renderOption(o, active)
                ) : (
                  <Pressable
                    key={String(o.value)}
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
          </ScrollView>
        </Container>
      </Popover>
    </Fragment>
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
