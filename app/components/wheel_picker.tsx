import React from 'react';
import { useTheme } from '../theme';
import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { Text } from './text';
import { Button } from './button';
import { Icon } from './icon';
import { Option } from './picker';
import { usePrevious } from '../hooks/use_previous';

const ITEM_HEIGHT = 40;
const ITEM_COUNT = 3;
const SCROLL_PICKER_HEIGHT = ITEM_HEIGHT * ITEM_COUNT;

interface WheelPickerProps<TValue extends any> {
  /**
   * List of options to show.
   */
  options?: Array<Option<TValue>>;

  /**
   * Initial value of the picker.
   *
   * *This is not a controlled component*; you don't need to update the
   * value during dragging.
   */
  value?: TValue;

  /**
   * Callback continuously called while the user is dragging the slider.
   */
  onChange?: (value: TValue) => void;
}

export function WheelPicker<TValue extends any>(
  props: WheelPickerProps<TValue>,
) {
  const {
    value,
    options = [],
    onChange = () => {
      return;
    },
  } = props;
  const theme = useTheme();
  const listRef = React.useRef<FlatList>(null);
  const timeout = React.useRef<number | null>(null);
  const prevValue = usePrevious(value);
  const animatedOptions = React.useRef(
    options.map((o) => ({
      value: o.value,
      label: o.label,
      opacity: new Animated.Value(0.33),
    })),
  ).current;

  const scrollToValue = React.useCallback(
    (val: TValue) => {
      if (!listRef.current) {
        return;
      }

      const index = options.findIndex((o) => o.value === val);

      listRef.current.scrollToOffset({
        animated: true,
        offset: index * ITEM_HEIGHT,
      });
    },
    [listRef, options],
  );

  const handlePressUp = React.useCallback(() => {
    const index = options.findIndex((o) => o.value === value);

    if (index <= 0) {
      return;
    }
    scrollToValue(options[index - 1].value);
  }, [options, scrollToValue, value]);

  const handlePressDown = React.useCallback(() => {
    const index = options.findIndex((o) => o.value === value);

    if (index >= options.length - 1) {
      return;
    }

    scrollToValue(options[index + 1].value);
  }, [options, scrollToValue, value]);

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!listRef) {
        return;
      }

      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      const offset = event.nativeEvent.contentOffset.y;
      const index = Math.round(offset / ITEM_HEIGHT);
      const selected = options[index].value;

      timeout.current = setTimeout(() => {
        if (value !== selected) {
          scrollToValue(selected);
          onChange(selected);
        }
      }, 100);

      animatedOptions.forEach((o) => {
        if (o.value === selected) {
          o.opacity.setValue(1);
        } else {
          o.opacity.setValue(0.33);
        }
      });
    },
    [listRef, options, animatedOptions, scrollToValue, onChange, value],
  );

  React.useEffect(() => {
    if (!prevValue && value) {
      scrollToValue(value);
    }
  }, [value, prevValue, scrollToValue]);

  const initialScrollIndex = options.findIndex((o) => o.value === value);

  return (
    <View style={styles.root}>
      <Button style={styles.arrow} onPress={handlePressUp}>
        <Icon size="lg" name="chevron-up" />
      </Button>
      <View style={styles.listWrapper}>
        <View
          style={[styles.selected, { borderColor: theme.border.color.default }]}
        />
        <FlatList
          ref={listRef}
          data={animatedOptions}
          getItemLayout={(item, index) => ({
            index,
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
          })}
          style={styles.list}
          initialScrollIndex={initialScrollIndex < 0 ? 0 : initialScrollIndex}
          keyExtractor={(item) => `${item.value}`}
          renderItem={({ item }) => (
            <Animated.View
              key={item.value}
              style={[styles.item, { opacity: item.opacity }]}
            >
              <Text align="center">{item.label}</Text>
            </Animated.View>
          )}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
        />
      </View>
      <Button style={styles.arrow} onPress={handlePressDown}>
        <Icon size="lg" name="chevron-down" />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  selected: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    height: ITEM_HEIGHT,
    position: 'absolute',
    top: ITEM_HEIGHT,
    zIndex: -1,
    width: '100%',
  },
  item: {
    alignItems: 'center',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  list: {
    paddingBottom: ITEM_HEIGHT,
    paddingTop: ITEM_HEIGHT,
  },
  listWrapper: {
    flex: 1,
    height: SCROLL_PICKER_HEIGHT,
    width: '100%',
  },
  arrow: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
});
