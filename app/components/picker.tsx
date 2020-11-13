import React, { useCallback, useState, useRef, Fragment } from 'react';

import {
  View,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { useTheme } from './theme';
import { tokens } from './tokens';
import { Container } from './container';
import { Row } from './row';
import { Text } from './text';
import { Icon } from './icon';
import { TextInput } from './text_input';
import { Option } from './option';
import { Checkbox } from './checkbox';
import { Popover, initialPopoverAnchor, PopoverAnchor } from './popover';
import {
  measure,
  initialMeasurements,
  Measurements,
} from '../lib/measurements';
import { isNonNullish } from '../../lib/js_utils';
import { DynamicStyleSheet } from './stylesheet';

export interface PickerProps<T> {
  value?: T;
  options: Option<T>[];
  onChange?: (value: T) => void;
  renderOption?: (option: Option<T>, active: boolean) => React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
}

const OPTION_HEIGHT = 40;
const SEARCH_HEIGHT = 56;
const PICKER_OFFSET = 4;
const SCREEN_OFFSET = 16;

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

  const popoverContentHeight =
    filteredOptions.length * OPTION_HEIGHT + (searchable ? SEARCH_HEIGHT : 0);

  const [height, setHeight] = useState(popoverContentHeight);

  const handleClosePicker = useCallback(() => {
    setPicker((prevPicker) => ({ ...prevPicker, visible: false }));
    setSearch('');
  }, []);

  const handleOpenPicker = useCallback(async () => {
    const button = await measure(buttonRef);
    const [anchor, popoverHeight] = getPopoverAnchorAndHeight(
      button,
      popoverContentHeight,
    );

    setHeight(popoverHeight);
    setPicker({
      visible: true,
      button,
      anchor,
    });
  }, [buttonRef, popoverContentHeight]);

  const handleSelectOption = useCallback(
    (option: Option<T>) => {
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
        <Pressable onPress={handleOpenPicker} style={styles.button}>
          <Text>{selected ? selected.label : placeholder}</Text>
          <View style={styles.caretWrapper}>
            <Icon size="lg" name="CaretDown" color="default" />
          </View>
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
                    onPress={() => handleSelectOption(o)}
                    style={({ hovered }) => [
                      styles.option,
                      {
                        backgroundColor:
                          active || hovered
                            ? theme.background.primary
                            : theme.background.content,
                      },
                    ]}
                  >
                    {({ hovered }) => (
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
                          <Text
                            color={hovered || active ? 'contrast' : 'default'}
                          >
                            {o.label}
                          </Text>
                          {selected && selected.value === o.value && (
                            <Checkbox value={true} />
                          )}
                        </Row>
                      </Container>
                    )}
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

function getPopoverAnchorAndHeight(
  opener: Measurements,
  popoverContentHeight: number,
): [PopoverAnchor, number] {
  const screenSize = Dimensions.get('window');

  const bottomY = opener.pageY + opener.height + PICKER_OFFSET;
  const topY = opener.pageY - PICKER_OFFSET - popoverContentHeight;

  const overflowsBottom = bottomY + popoverContentHeight > screenSize.height;

  let anchor: PopoverAnchor = initialPopoverAnchor;
  let popoverHeight = popoverContentHeight;

  if (overflowsBottom) {
    const heightIfBottomY = screenSize.height - bottomY;
    const heightIfTopY = opener.pageY;

    if (heightIfTopY < heightIfBottomY) {
      anchor = {
        x: opener.pageX,
        y: bottomY,
      };

      if (screenSize.height - bottomY < popoverContentHeight) {
        popoverHeight = screenSize.height - bottomY - SCREEN_OFFSET;
      }
    } else {
      if (topY < 0) {
        popoverHeight = opener.pageY - SCREEN_OFFSET;
        anchor = {
          x: opener.pageX,
          y: SCREEN_OFFSET,
        };
      } else {
        anchor = {
          x: opener.pageX,
          y: topY,
        };
      }
    }
  } else {
    anchor = {
      x: opener.pageX,
      y: bottomY,
    };
  }

  return [anchor, popoverHeight];
}

const styles = DynamicStyleSheet.create((theme) => ({
  button: {
    borderRadius: tokens.radius,
    borderWidth: 1,
    borderColor: theme.border.default,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  caretWrapper: {
    position: 'absolute',
    right: 16,
  },
  optionsContainer: {
    position: 'absolute',
    top: 44,
    width: '100%',
  },
  option: {
    borderRadius: tokens.radius,
  },
}));
