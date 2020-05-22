import React from 'react';
import { DragDrop, DragDropHandlers } from './drag_drop';

interface DragDropProviderProps {
  children?: React.ReactNode;
}

const DragDropContext = React.createContext<DragDropHandlers>({
  registerDraggable: () => {
    return {
      startDrag: () => {},
      drag: () => {},
      endDrag: () => {},
    };
  },
  unregisterDraggable: () => {},
  registerDropTarget: () => {},
  unregisterDropTarget: () => {},
});

export function DragDropProvider(props: DragDropProviderProps) {
  const { children } = props;

  const dragDrop = React.useRef(new DragDrop()).current;
  const {
    registerDraggable,
    unregisterDraggable,
    registerDropTarget,
    unregisterDropTarget,
  } = dragDrop;

  return (
    <DragDropContext.Provider
      value={{
        registerDraggable,
        unregisterDraggable,
        registerDropTarget,
        unregisterDropTarget,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop(): DragDropHandlers {
  return React.useContext(DragDropContext);
}
