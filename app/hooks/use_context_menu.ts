import React from 'react';
import { View, Platform } from 'react-native';

export interface ContextMenuCoordinate {
  x: number;
  y: number;
}

interface UseContextMenuProps {
  ref: React.MutableRefObject<View | null>;
  onOpen: (coordinate: ContextMenuCoordinate) => void;
}

export function useContextMenu(props: UseContextMenuProps) {
  const { ref, onOpen } = props;

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // @ts-ignore
      const el = ref.current as HTMLDivElement;

      function onRightClick(e: MouseEvent) {
        e.preventDefault();

        onOpen({
          x: e.x,
          y: e.y,
        });
      }

      el.addEventListener('contextmenu', onRightClick, { passive: true });

      return () => {
        el.removeEventListener('contextmenu', onRightClick);
      };
    }

    return () => {};
  }, [ref, onOpen]);
}
