import React, {
  useCallback,
  useState,
  useRef,
  Fragment,
  useEffect,
} from 'react';

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
import { Popover, initialPopoverAnchor } from './popover';
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
  const borderColor = React.useRef(new Animated.Value(0)).current;
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [anchor, setAnchor] = useState(initialPopoverAnchor);
  const [button, setButton] = useState(initialMeasurements);
  const [popover, setPopover] = useState(initialMeasurements);
  const [height, setHeight] = useState(0);
  const theme = useTheme();

  const handleClosePicker = useCallback(() => {
    setVisible(false);
    setSearch('');
  }, []);

  const handleOpenPicker = useCallback(async () => {
    const buttonMeasurements = await measure(buttonRef);

    setButton(buttonMeasurements);

    const screenSize = Dimensions.get('window');
    const pickerOffset = 4;
    const screenOffset = 16;

    const bottomY =
      buttonMeasurements.pageY + buttonMeasurements.height + pickerOffset;
    const topY = buttonMeasurements.pageY - pickerOffset - popover.height;

    const overflowsBottom = bottomY + popover.height > screenSize.height;

    if (overflowsBottom) {
      const heightIfBottomY = screenSize.height - bottomY;
      const heightIfTopY = buttonMeasurements.pageY;

      if (heightIfTopY < heightIfBottomY) {
        setAnchor({
          x: buttonMeasurements.pageX,
          y: bottomY,
        });

        if (screenSize.height - bottomY < popover.height) {
          setHeight(screenSize.height - bottomY - screenOffset);
        }
      } else {
        if (topY < 0) {
          setHeight(buttonMeasurements.pageY - screenOffset);
          setAnchor({
            x: buttonMeasurements.pageX,
            y: screenOffset,
          });
        } else {
          setAnchor({
            x: buttonMeasurements.pageX,
            y: topY,
          });
        }
      }
    } else {
      setAnchor({
        x: buttonMeasurements.pageX,
        y: bottomY,
      });
    }

    setVisible(true);
  }, [popover, buttonRef]);

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

  const selected = options.find((o) => o.value === value);
  const filteredOptions =
    search !== ''
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  useEffect(() => {
    measure(popoverRef).then((m) => {
      setPopover(m);
      setHeight(m.height);
    });
    // Include everything that may affect the height
  }, [filteredOptions, searchable, popoverRef]);

  const content = (
    <Container padding={8}>
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
              <Row expanded alignItems="center" justifyContent="space-between">
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
  );

  return (
    <Fragment>
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
        <Container
          width={button.width}
          height={height}
          color="content"
          borderWidth={1}
          borderRadius={tokens.radius}
        >
          {searchable === true && (
            <Container padding={8}>
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
          <ScrollView>{content}</ScrollView>
        </Container>
      </Popover>
      {/* We use this hidden component to calculate height */}
      <View style={styles.hidden} ref={popoverRef}>
        {content}
      </View>
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
  hidden: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
  },
});
