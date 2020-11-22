import React, { Fragment, useCallback, useState } from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { isNonNullish } from '../../lib/js_utils';
import { UIKey, WhiteSpaceKey } from '../lib/keyboard';
import { Checkbox } from './checkbox';
import {
  ListPickerItem,
  ListPickerOption,
  useListKeyboardNavigation,
  useOptionsSearch,
} from './list_picker';
import { DynamicStyleSheet } from './stylesheet';
import { TextInput } from './text_input';

interface MultiListPickerProps<T> {
  value?: T[] | null;
  options: ListPickerOption<T>[];
  onChange?: (value: T[]) => void;
  onCreateNewOption?: (searchTerm: string) => void;
  onRequestClose?: () => void;
  renderLabel?: (value: T, selected: boolean) => React.ReactNode;
}

export function MultiListPicker<T>(
  props: MultiListPickerProps<T>,
): JSX.Element {
  const {
    value,
    options: initialOptions,
    onChange,
    onRequestClose,
    renderLabel,
  } = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const options = useOptionsSearch(initialOptions, searchTerm);
  const handleNavigation = useListKeyboardNavigation(
    activeIndex,
    setActiveIndex,
    options,
  );

  const handleSelect = React.useCallback(
    (newVal: T, selected: boolean) => {
      if (isNonNullish(onChange)) {
        if (selected) {
          if (isNonNullish(value)) {
            onChange(value.filter((val) => val !== newVal));
          }
        } else {
          if (value) {
            onChange(value.concat(newVal));
          } else {
            onChange([newVal]);
          }
        }
      }
    },
    [value, onChange],
  );

  const handleSearchTermChange = useCallback((nextSearchTerm: string) => {
    setSearchTerm(nextSearchTerm);
    setActiveIndex(null);
  }, []);

  const handleHoverChange = useCallback(
    (_value: T, hovered: boolean) => {
      const index = options.findIndex((option) => option.value === _value);

      if (hovered && index >= 0) {
        setActiveIndex(index);
      }
    },
    [options],
  );

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;

      const handled = handleNavigation(key);

      if (handled === true) {
        event.preventDefault();
        return;
      }

      if (key === UIKey.Escape && onRequestClose !== undefined) {
        onRequestClose();
      }

      if (key === WhiteSpaceKey.Enter) {
        event.preventDefault();

        if (activeIndex !== null) {
          const option = options[activeIndex];

          if (isNonNullish(value)) {
            const selected = value.some((selVal) => selVal === option.value);
            if (handleSelect !== undefined) {
              handleSelect(option.value, selected);
            }
          } else {
            handleSelect(option.value, true);
          }
        }
      }
    },
    [
      onRequestClose,
      handleNavigation,
      value,
      activeIndex,
      handleSelect,
      options,
    ],
  );

  const renderCheck = useCallback((_value: T, selected: boolean) => {
    return <Checkbox value={selected} />;
  }, []);

  return (
    <View style={styles.base}>
      <View style={styles.searchInputWrapper}>
        <TextInput
          autoFocus
          value={searchTerm}
          onKeyPress={handleKeyPress}
          onChange={handleSearchTermChange}
          clearable
          placeholder="Search"
        />
      </View>
      <ScrollView>
        {options.map((option, index) => (
          <ListPickerItem
            key={option.label}
            option={option}
            selected={
              value ? value.some((selVal) => selVal === option.value) : false
            }
            active={activeIndex === index}
            renderCheck={renderCheck}
            onSelect={handleSelect}
            renderLabel={renderLabel}
            onHoverChange={handleHoverChange}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    flex: 1,
  },
  searchInputWrapper: {
    paddingBottom: 16,
  },
}));
