import { Draggable, DraggableCallbacks } from './draggable';
import { DropTarget, DropTargetCallbacks } from './drop_target';

export interface DragDropHandlers {
  registerDraggable: (
    draggable: Draggable,
    callbacks: DraggableCallbacks,
  ) => void;
  unregisterDraggable: (draggable: Draggable) => void;
  registerDropTarget: (
    dropTarget: DropTarget,
    callbacks: DropTargetCallbacks,
  ) => void;
  unregisterDropTarget: (dropTarget: DropTarget) => void;
}

export class DragDrop implements DragDropHandlers {
  _draggables: { [key: string]: Draggable } = {};
  _dropTargets: { [key: string]: DropTarget } = {};

  get dropTargets(): DropTarget[] {
    return Object.values(this._dropTargets);
  }

  registerDraggable = (draggable: Draggable, callbacks: DraggableCallbacks) => {
    const {
      onDragCompleted = () => {},
      onDragEnd = () => {},
      onDragStarted = () => {},
      onDraggableCanceled = () => {},
    } = callbacks;
    this._draggables[draggable.key] = draggable;

    draggable.onDragStart((state) => {
      onDragStarted();
    });

    draggable.onDrag((state) => {
      console.log(this.dropTargets);
      draggable.pan.setValue({
        x: state.dx,
        y: state.dy,
      });
    });

    draggable.onDragEnd((state) => {
      draggable.pan.setValue({
        x: 0,
        y: 0,
      });
      onDragEnd();
      onDragCompleted();
      onDraggableCanceled();
    });
  };

  unregisterDraggable = (draggable: Draggable) => {
    delete this._draggables[draggable.key];
  };

  registerDropTarget = (
    dropTarget: DropTarget,
    callbacks: DropTargetCallbacks,
  ) => {
    const {
      onAccept = () => {},
      onLeave = () => {},
      onHover = () => {},
      onWillAccept = () => {},
    } = callbacks;
    this._dropTargets[dropTarget.key] = dropTarget;
  };

  unregisterDropTarget = (dropTarget: DropTarget) => {
    delete this._dropTargets[dropTarget.key];
  };
}
