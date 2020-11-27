import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import Fuse from 'fuse.js';

import { DynamicStyleSheet } from './stylesheet';
import { Text } from './text';
import { Button } from './button';
import { tokens } from './tokens';

import { isNonNullish } from '../../lib/js_utils';
import { Icon } from './icon';
import { TextInput } from './text_input';
import { NavigationKey, UIKey, WhiteSpaceKey } from '../lib/keyboard';
import { Hover } from './hover';

export interface ListPickerOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface ListPickerProps<T> {
  value?: T | null;
  options: ListPickerOption<NonNullable<T>>[];
  onChange?: (value: T) => void;
  onCreateNewOption?: (searchTerm: string) => void;
  onRequestClose?: () => void;
  renderLabel?: (value: NonNullable<T>, selected: boolean) => React.ReactNode;
}

export function ListPicker<T>(props: ListPickerProps<T>): JSX.Element {
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

  const handleSearchTermChange = useCallback((nextSearchTerm: string) => {
    setSearchTerm(nextSearchTerm);
    setActiveIndex(null);
  }, []);

  const handleSelect = useCallback(
    (newVal: T) => {
      if (isNonNullish(onChange)) {
        onChange(newVal);
      }
    },
    [onChange],
  );

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

      if (key === WhiteSpaceKey.Enter) {
        event.preventDefault();
        if (activeIndex !== null) {
          const option = options[activeIndex];

          if (onChange !== undefined) {
            onChange(option.value);
          }

          if (onRequestClose !== undefined) {
            onRequestClose();
          }
        }

        return;
      }

      if (key === UIKey.Escape && onRequestClose !== undefined) {
        onRequestClose();
      }
    },
    [onRequestClose, handleNavigation, activeIndex, onChange, options],
  );

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
            onSelect={handleSelect}
            onHoverChange={handleHoverChange}
            selected={option.value === value}
            active={activeIndex === index}
            renderLabel={renderLabel}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export interface ListPickerItemProps<T> {
  selected: boolean;
  active?: boolean;
  option: ListPickerOption<NonNullable<T>>;
  onSelect: (value: NonNullable<T>, selected: boolean) => void;
  onHoverChange?: (value: NonNullable<T>, hovered: boolean) => void;
  renderLabel?: (value: NonNullable<T>, selected: boolean) => React.ReactNode;
  renderCheck?: (value: NonNullable<T>, selected: boolean) => React.ReactNode;
}

export function ListPickerItem<T>(props: ListPickerItemProps<T>): JSX.Element {
  const {
    active,
    selected,
    option,
    onSelect,
    renderLabel,
    renderCheck,
    onHoverChange,
  } = props;

  const handlePress = useCallback(() => {
    onSelect(option.value, selected);
  }, [onSelect, option, selected]);

  const handleHoverChange = useCallback(
    (hovered: boolean) => {
      if (onHoverChange !== undefined) {
        onHoverChange(option.value, hovered);
      }
    },
    [onHoverChange, option],
  );

  return (
    <Button
      containerStyle={styles.listItemContainer}
      style={[styles.listItem, active && styles.active]}
      onPress={handlePress}
    >
      {({ hovered }) => (
        <Fragment>
          <Hover hovered={hovered} onHoverChange={handleHoverChange} />
          {renderLabel ? (
            renderLabel(option.value, selected)
          ) : (
            <Text>{option.label}</Text>
          )}
          {renderCheck ? (
            renderCheck(option.value, selected)
          ) : selected ? (
            <Icon name="CheckThick" color="primary" />
          ) : null}
        </Fragment>
      )}
    </Button>
  );
}

export function useListKeyboardNavigation<T>(
  activeIndex: number | null,
  setActiveIndex: (index: number) => void,
  options: ListPickerOption<T>[],
): (key: string) => boolean {
  return useCallback(
    (key: string): boolean => {
      switch (key) {
        case NavigationKey.ArrowDown:
          if (activeIndex === null || activeIndex === options.length - 1) {
            setActiveIndex(0);
          } else {
            setActiveIndex(activeIndex + 1);
          }
          return true;
        case NavigationKey.ArrowUp:
          if (activeIndex === null || activeIndex === 0) {
            setActiveIndex(options.length - 1);
          } else {
            setActiveIndex(activeIndex - 1);
          }
          return true;

        default:
          return false;
      }
    },
    [activeIndex, setActiveIndex, options],
  );
}

export function useOptionsSearch<T>(
  options: ListPickerOption<T>[],
  searchTerm: string,
): ListPickerOption<T>[] {
  const fuse = useRef(new Fuse(options, { keys: ['label'] })).current;

  useEffect(() => {
    fuse.setCollection(options);
  }, [fuse, options]);

  if (searchTerm === '') {
    return options;
  }

  const result = fuse.search(searchTerm);

  return result.map((value) => value.item);
}

const styles = DynamicStyleSheet.create(() => ({
  base: {
    flex: 1,
  },
  searchInputWrapper: {
    paddingBottom: 16,
  },
  active: {
    backgroundColor: tokens.colors.lightBlue[50],
  },
  listItemContainer: {
    marginBottom: 4,
  },
  listItem: {
    height: 40,
    borderRadius: tokens.border.radius.default,
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
