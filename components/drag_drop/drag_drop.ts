import { Draggable, DraggableCallbacks, DragState } from './draggable';
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

  get draggables(): Draggable[] {
    return Object.values(this._draggables);
  }

  findDropTargetOverlap = (dragState: DragState): DropTarget | null => {
    for (let index = 0; index < this.dropTargets.length; index++) {
      const dropTarget = this.dropTargets[index];

      if (dropTarget.measurements) {
        const { width, height, pageX, pageY } = dropTarget.measurements;

        const isWithinHorizontalBound =
          pageX <= dragState.pageX && dragState.pageX <= pageX + width;
        const isWithinVerticalBound =
          pageY <= dragState.pageY && dragState.pageY <= pageY + height;

        if (isWithinHorizontalBound && isWithinVerticalBound) {
          dropTarget.enter();
          break;
        }
      }
    }

    return null;
  };

  _measureAll = async () => {
    await Promise.all([
      Promise.all(this.draggables.map((draggable) => draggable.measure())),
      Promise.all(this.dropTargets.map((dropTarget) => dropTarget.measure())),
    ]);

    this.draggables.forEach((d) => console.log(d.measurements));
  };

  registerDraggable = (draggable: Draggable, callbacks: DraggableCallbacks) => {
    const {
      onDragCompleted = () => {},
      onDragEnd = () => {},
      onDragStarted = () => {},
      onDraggableCanceled = () => {},
    } = callbacks;
    this._draggables[draggable.key] = draggable;

    draggable.onDragStart(async () => {
      await this._measureAll();
      onDragStarted();
    });

    draggable.onDrag(async (dragState) => {
      draggable.pan.setValue({
        x: dragState.dx,
        y: dragState.dy,
      });

      const dropTarget = this.findDropTargetOverlap(dragState);
    });

    draggable.onDragEnd(async (dragState) => {
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

    dropTarget.onLeave(async () => {
      onLeave();
    });
    dropTarget.onHover(async () => {
      onHover();
    });
    dropTarget.onAccept(async () => {
      onAccept();
    });
  };

  unregisterDropTarget = (dropTarget: DropTarget) => {
    delete this._dropTargets[dropTarget.key];
  };
}
