import React from 'react';
import { TouchableOpacity } from 'react-native';

interface ListItemProps<T extends any> {
  children?: React.ReactNode;
  item: T;
  onLongPress: () => void;
  onPressOut: () => void;
}

export class ListItem<T extends any> extends React.Component<ListItemProps<T>> {
  render() {
    const { children, onLongPress, onPressOut } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={200}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        onPress={() => {
          console.log('Pressed');
        }}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
