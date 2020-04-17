import React from 'react';

interface DragDropProviderProps {
  children?: React.ReactNode;
}

interface DragDropContext {
  /** Called when the draggable is dropped and accepted by a DragTarget. */
  onDragCompleted: () => void;

  /** Called when the draggable is dropped. */
  onDragEnd: () => void;

  /** Called when the draggable is dropped without being accepted by a DragTarget. */
  onDraggableCanceled: () => void;

  /** Called when the draggable starts being dragged. */
  onDragStarted: () => void;
}

const DragDropContext = React.createContext<DragDropContext>({
  onDragCompleted: () => {},
  onDragEnd: () => {},
  onDraggableCanceled: () => {},
  onDragStarted: () => {},
});

export function DragDropProvider(props: DragDropProviderProps) {
  const { children } = props;

  const handleDragCompleted = React.useCallback(() => {}, []);
  const handleDragEnd = React.useCallback(() => {}, []);
  const handleDraggableCanceled = React.useCallback(() => {}, []);
  const handleDragStarted = React.useCallback(() => {}, []);

  return (
    <DragDropContext.Provider
      value={{
        onDragCompleted: handleDragCompleted,
        onDragEnd: handleDragEnd,
        onDraggableCanceled: handleDraggableCanceled,
        onDragStarted: handleDragStarted,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
}
