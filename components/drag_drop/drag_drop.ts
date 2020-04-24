import { Draggable, DraggableCallbacks } from './draggable';
import { DropTarget } from './drop_target';

export interface DragDropHandlers {
  registerDraggable: (
    draggable: Draggable,
    callbacks: DraggableCallbacks,
  ) => void;
  unregisterDraggable: (draggable: Draggable) => void;
  registerDropTarget: (dropTarget: DropTarget) => void;
  unregisterDropTarget: (dropTarget: DropTarget) => void;
}

export class DragDrop implements DragDropHandlers {
  _draggables: { [key: string]: Draggable } = {};
  _dropTargets: { [key: string]: DropTarget } = {};

  registerDraggable = (draggable: Draggable, callbacks: DraggableCallbacks) => {
    const {
      onDragCompleted = () => {},
      onDragEnd = () => {},
      onDragStarted = () => {},
      onDraggableCanceled = () => {},
    } = callbacks;
    this._draggables[draggable.key] = draggable;

    draggable.onDragStart(() => {
      onDragStarted();
    });

    draggable.onDragEnd(() => {
      onDragEnd();
      onDragCompleted();
      onDraggableCanceled();
    });
  };

  unregisterDraggable = (draggable: Draggable) => {
    delete this._draggables[draggable.key];
  };

  registerDropTarget = (dropTarget: DropTarget) => {
    this._dropTargets[dropTarget.key] = dropTarget;
  };

  unregisterDropTarget = (dropTarget: DropTarget) => {
    delete this._dropTargets[dropTarget.key];
  };
}
