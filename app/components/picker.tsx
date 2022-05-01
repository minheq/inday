import React, { useCallback, useState, useRef, Fragment } from "react";

import {
  View,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from "react-native";
import { tokens } from "./tokens";
import { Text } from "./text";
import { Icon } from "./icon";
import { Popover } from "./popover";
import { NavigationKey, UIKey, WhiteSpaceKey } from "../lib/keyboard";
import { theme } from "./theme";
import { TextField } from "./text_field";
import { Pressable } from "./pressable";

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

// eslint-disable-next-line sonarjs/cognitive-complexity
export function Picker<T>(props: PickerProps<T>): JSX.Element {
  const {
    value,
    placeholder = "",
    options,
    renderOption,
    onChange,
    searchable = false,
  } = props;
  const targetRef = useRef<View>(null);
  const popoverContentRef = useRef<View>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const selected = options.find((o) => o.value === value);
  const filteredOptions =
    search !== ""
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase())
        )
      : options;

  const handleClosePicker = useCallback(() => {
    setVisible(false);
    setSearch("");
  }, []);

  const handleOpenPicker = useCallback(() => {
    setVisible(true);
  }, []);

  const handleSelectOption = useCallback(
    (option: PickerOption<T>) => {
      handleClosePicker();

      if (onChange !== undefined) {
        onChange(option.value);
      }
    },
    [onChange, handleClosePicker]
  );

  const handleChangeSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handleSubmitEditing = useCallback(() => {
    if (activeIndex !== null) {
      handleClosePicker();
      const option = options[activeIndex];

      if (onChange !== undefined) {
        onChange(option.value);
      }
    }

    targetRef.current?.focus?.();
  }, [activeIndex, options, handleClosePicker, onChange]);

  const handleKey = useCallback(
    (key: string) => {
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
      } else if (key === WhiteSpaceKey.Enter) {
        handleSubmitEditing();
      }
    },
    [activeIndex, options, handleClosePicker, handleSubmitEditing]
  );

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      handleKey(event.nativeEvent.key);
    },
    [handleKey]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      handleKey(event.nativeEvent.key);
    },
    [handleKey]
  );

  const handlePopoverShow = useCallback(() => {
    if (searchable === false) {
      popoverContentRef.current?.focus?.();
    }
  }, [searchable]);

  return (
    <Fragment>
      <Pressable
        ref={targetRef}
        onPress={handleOpenPicker}
        style={styles.button}
      >
        <Text>{selected ? selected.label : placeholder}</Text>
        <View style={styles.caretWrapper}>
          <Icon name="CaretDown" color="default" />
        </View>
      </Pressable>
      <Popover
        targetRef={targetRef}
        onShow={handlePopoverShow}
        visible={visible}
        onRequestClose={handleClosePicker}
        content={
          <View
            accessible
            // @ts-ignore available on the web
            onKeyDown={handleKeyDown}
            ref={popoverContentRef}
            style={styles.popover}
          >
            {searchable === true && (
              <View style={styles.searchWrapper}>
                <TextField
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
                        !!(active || hovered) && styles.selectedOption,
                      ]}
                    >
                      <Text color="default">{o.label}</Text>
                      {selected && selected.value === o.value && (
                        <Icon name="CheckThick" color="primary" />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        }
      />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: tokens.border.radius,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 24,
    borderColor: theme.neutral[200],
  },
  popover: {
    borderWidth: 1,
    borderRadius: tokens.border.radius,
    borderColor: theme.primary[600],
    backgroundColor: theme.primary[100],
  },
  searchWrapper: {
    height: SEARCH_HEIGHT,
    padding: 8,
  },
  caretWrapper: {
    position: "absolute",
    right: 0,
  },
  optionsContainer: {
    padding: 8,
  },
  option: {
    borderRadius: tokens.border.radius,
    height: OPTION_HEIGHT,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.base.white,
  },
  selectedOption: {
    backgroundColor: theme.primary[100],
  },
});
