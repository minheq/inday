import { Draggable } from './draggable';
import { DropTarget } from './drop_target';

export interface DragDropHandlers {
  registerDraggable: (draggable: Draggable) => DraggableHandlers;
  unregisterDraggable: (draggable: Draggable) => void;
  registerDropTarget: (dropTarget: DropTarget) => void;
  unregisterDropTarget: (dropTarget: DropTarget) => void;
}

export interface DraggableHandlers {
  startDrag: () => void;
  drag: () => void;
  endDrag: () => void;
}

export class DragDrop implements DragDropHandlers {
  _draggables: Draggable[] = [];
  _dropTargets: DropTarget[] = [];

  registerDraggable = (draggable: Draggable): DraggableHandlers => {
    this._draggables.push(draggable);

    return {
      startDrag: () => {
        draggable.onDragStarted();
      },
      drag: () => {
        // if ([x, y].indroptarget) {
        //   willAccept;
        // }
      },
      endDrag: () => {
        draggable.onDragEnd();
      },
    };
  };

  unregisterDraggable = (draggable: Draggable) => {
    this._draggables = this._draggables.filter((d) => d.key === draggable.key);
  };

  registerDropTarget = (dropTarget: DropTarget) => {
    this._dropTargets.push(dropTarget);
  };

  unregisterDropTarget = (dropTarget: DropTarget) => {
    this._dropTargets = this._dropTargets.filter(
      (d) => d.key === dropTarget.key,
    );
  };
}
