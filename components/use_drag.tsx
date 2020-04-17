import React from 'react';
import { PanResponder, View, ViewProps } from 'react-native';

interface UseDragProps {
  /** Called when the draggable is dropped and accepted by a DragTarget. */
  onDragCompleted?: () => void;

  /** Called when the draggable is dropped. */
  onDragEnd?: () => void;

  /** Called when the draggable is dropped without being accepted by a DragTarget. */
  onDraggableCanceled?: () => void;

  /** Called when the draggable starts being dragged. */
  onDragStarted?: () => void;
}

interface DragState {
  isDragging: boolean;
  startDrag: () => void;
  endDrag: () => void;
}

type UseDragResult = [
  ViewProps & { ref: React.MutableRefObject<View | null> },
  DragState,
];

export function useDrag(props: UseDragProps): UseDragResult {
  const {
    // onDragCompleted,
    // onDragEnd,
    // onDraggableCanceled,
    // onDragStarted,
  } = props;

  const ref = React.useRef<View | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const hasDragStartedRef = React.useRef(false);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('onStartShouldSetPanResponder');
        return true;
      },
      onStartShouldSetPanResponderCapture: () => {
        hasDragStartedRef.current = false;
        console.log('onStartShouldSetPanResponderCapture');

        return false;
      },
      onMoveShouldSetPanResponder: () => {
        console.log('onMoveShouldSetPanResponder');
        return hasDragStartedRef.current;
      },
      onMoveShouldSetPanResponderCapture: () => {
        console.log('onMoveShouldSetPanResponderCapture');
        return hasDragStartedRef.current;
      },
      onPanResponderStart: () => {
        console.log('onPanResponderStart');
      },
      onPanResponderGrant: () => {
        console.log('onPanResponderGrant');
      },
      onPanResponderMove: () => {
        console.log('onPanResponderMove');
      },
      onPanResponderRelease: () => {
        console.log('onPanResponderRelease');
      },
      onPanResponderReject: () => {
        console.log('onPanResponderReject');
      },
      onPanResponderTerminate: () => {
        console.log('onPanResponderTerminate');
      },
      onPanResponderEnd: () => {
        console.log('onPanResponderEnd');
      },
      onPanResponderTerminationRequest: () => {
        console.log('onPanResponderTerminationRequest');
        return false;
      },
      onShouldBlockNativeResponder: () => {
        console.log('onShouldBlockNativeResponder');
        return false;
      },
    }),
  ).current;

  // We need need to force the consumer to manually start drag
  // because only then can we update component state
  const handleStartDrag = React.useCallback(() => {
    setIsDragging(true);
    hasDragStartedRef.current = true;
  }, [setIsDragging, hasDragStartedRef]);

  // We need need to force the consumer to manually end drag
  // because `onStartShouldSetPanResponderCapture` returns false and so
  // `onPanResponderRelease` will not be called when the pan responder did not move
  const handleEndDrag = React.useCallback(() => {
    setIsDragging(false);
    hasDragStartedRef.current = false;
  }, [hasDragStartedRef, setIsDragging]);

  console.log('isDragging', isDragging);

  return [
    {
      ref,
      style: {},
      ...panResponder.panHandlers,
    },
    {
      isDragging,
      startDrag: handleStartDrag,
      endDrag: handleEndDrag,
    },
  ];
}
