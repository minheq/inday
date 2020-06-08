import React from 'react';
import { useTheme } from '../theme';
import { View, StyleSheet } from 'react-native';
import { Text } from './text';
import { Button } from './button';
import { Icon } from './icon';

interface WheelPickerProps<TValue extends any> {
  /**
   * List of options to show.
   */
  options?: Array<WheelPickerOption<TValue>>;

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

export const WheelPicker = React.forwardRef(
  <TValue extends any>(
    props: WheelPickerProps<TValue>,
    ref: React.Ref<WheelPickerRef<TValue>>,
  ) => {
    const {
      value,
      options = [],
      onChange = () => {
        return;
      },
    } = props;
    const theme = useTheme();

    const listRef = React.useRef<HTMLDivElement>(null);

    const {
      optionsWithClones,
      handlePressDown,
      handlePressUp,
      handleScroll,
      scrollToValue,
    } = useWheelPicker({
      onChange,
      options,
      ref,
      scrollContainer: {
        scrollTo: ({ animated, offset }) =>
          listRef.current &&
          listRef.current.scrollTo({
            behavior: animated ? 'smooth' : 'auto',
            top: offset,
          }),
      },
      value,
    });

    React.useLayoutEffect(() => {
      setTimeout(() => {
        if (listRef.current && value) {
          scrollToValue(value, false);
        }
      }, 50);
    }, [scrollToValue, value]);

    return (
      <View style={styles.root}>
        <Button style={styles.arrow} onPress={handlePressUp}>
          <Icon size="lg" name="chevron-up" />
        </Button>
        <View style={styles.listWrapper}>
          <div
            ref={listRef}
            onScroll={(event) => handleScroll(event.currentTarget.scrollTop)}
            style={styles.list}
          >
            {optionsWithClones.map((o) => (
              <View key={o.value} style={styles.item}>
                <Text align="center">{o.label}</Text>
              </View>
            ))}
          </div>
          <View
            style={[
              styles.upperOverlay,
              { borderColor: theme.border.color.default },
            ]}
          />
          <View
            style={[
              styles.bottomOverlay,
              { borderColor: theme.border.color.default },
            ]}
          />
        </View>

        <Button style={styles.arrow} onPress={handlePressDown}>
          <Icon size="lg" name="chevron-down" />
        </Button>
      </View>
    );
  },
);

interface WheelPickerRef<TValue extends any> {
  selectValue: (value: TValue) => void;
}

const ITEM_HEIGHT = 40;
const ITEM_COUNT = 3;
const SCROLL_PICKER_HEIGHT = ITEM_HEIGHT * ITEM_COUNT;

interface WheelPickerOption<TValue extends any> {
  label: string;
  value: TValue;
}

const DEBOUNCE_TIME = 300;

const makePaddedOptions = <TValue extends any>(
  options: WheelPickerOption<TValue>[],
) => {
  return [
    { value: 'emptyStart', label: '' },
    ...options,
    { value: 'emptyEnd', label: '' },
  ] as WheelPickerOption<TValue>[];
};

const getOptionFromOptions = <TValue extends any>(
  options: WheelPickerOption<TValue>[],
) => (scrollPosition: number) => {
  const index = Math.round(scrollPosition / ITEM_HEIGHT);

  const finalIndex = Math.abs(
    index >= options.length ? options.length - index : index,
  );

  return options[finalIndex];
};

interface ScrollContainer {
  scrollTo: (params: { animated?: boolean; offset: number }) => void;
}

interface UseWheelPickerProps<TValue extends any> {
  /**
   * List of options to show.
   */
  options: WheelPickerOption<TValue>[];

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

  /**
   * Scroll container
   */
  scrollContainer: ScrollContainer | null;

  /**
   * Methods of the WheelPicker
   */
  ref: React.Ref<WheelPickerRef<TValue>>;
}

const useWheelPicker = <TValue extends any>(
  props: UseWheelPickerProps<TValue>,
) => {
  const {
    options,
    onChange = () => {
      return;
    },
    value: initialValue = options[0].value,
    scrollContainer,
    ref,
  } = props;
  const optionsWithClones = makePaddedOptions(options);
  const [value, setValue] = React.useState<TValue>(initialValue);
  const getOption = React.useMemo(() => getOptionFromOptions(options), [
    options,
  ]);
  const timeout = React.useRef<number | null>(null);

  const scrollToValue = React.useCallback(
    (toValue: TValue, animated = true) => {
      if (!scrollContainer) {
        return;
      }

      const index = optionsWithClones.findIndex((o) => o.value === toValue);

      scrollContainer.scrollTo({
        animated,
        offset: index * ITEM_HEIGHT - ITEM_HEIGHT,
      });
    },
    [scrollContainer, optionsWithClones],
  );

  const handleChange = React.useCallback(
    (newValue: TValue) => {
      if (newValue !== value) {
        onChange(newValue);
        setValue(newValue);
      }
    },
    [onChange, value],
  );

  const handleScroll = React.useCallback(
    (offset: number) => {
      if (!scrollContainer) {
        return;
      }

      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      // @ts-ignore
      timeout.current = setTimeout(() => {
        const selectedOption = getOption(offset);
        handleChange(selectedOption.value);
      }, DEBOUNCE_TIME);
    },
    [scrollContainer, getOption, handleChange],
  );

  const handleEndDrag = React.useCallback(
    (offset: number) => {
      if (!scrollContainer) {
        return;
      }

      const scrollPosition = Math.round(offset / ITEM_HEIGHT) * ITEM_HEIGHT;

      scrollContainer.scrollTo({
        offset: scrollPosition,
      });

      const selectedOption = getOption(scrollPosition);

      handleChange(selectedOption.value);
    },
    [scrollContainer, getOption, handleChange],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      selectValue: (newValue: TValue) => scrollToValue(newValue),
    }),
    [scrollToValue],
  );

  const handlePressUp = React.useCallback(() => {
    if (!scrollContainer) {
      return;
    }
    const currentIndex = options.findIndex((o) => o.value === value);

    if (currentIndex <= 0) {
      return;
    }
    scrollToValue(options[currentIndex - 1].value);
  }, [options, scrollContainer, scrollToValue, value]);

  const handlePressDown = React.useCallback(() => {
    if (!scrollContainer) {
      return;
    }

    const currentIndex = options.findIndex((o) => o.value === value);

    if (currentIndex >= options.length - 1) {
      return;
    }
    scrollToValue(options[currentIndex + 1].value);
  }, [options, scrollContainer, scrollToValue, value]);

  return {
    handleEndDrag,
    handlePressDown,
    handlePressUp,
    handleScroll,
    optionsWithClones,
    scrollToValue,
  };
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  upperOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    height: ITEM_HEIGHT,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bottomOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderStyle: 'solid',
    borderTopWidth: 1,
    height: ITEM_HEIGHT,
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    width: '100%',
  },
  item: {
    alignItems: 'center',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 4,
    scrollSnapAlign: 'start',
  },
  listWrapper: {
    flex: 1,
    height: SCROLL_PICKER_HEIGHT,
    width: '100%',
  },
  list: {
    height: SCROLL_PICKER_HEIGHT,
    overflowY: 'scroll' as const,
    scrollSnapType: 'y mandatory',
    width: '100%',
  },
  arrow: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
});
