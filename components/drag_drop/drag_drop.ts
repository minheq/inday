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

  get draggables(): Draggable[] {
    return Object.values(this._draggables);
  }

  findDropTargetOverlap = (draggable: Draggable): DropTarget | null => {
    // for (let index = 0; index < this.dropTargets.length; index++) {
    //   const dropTarget = this.dropTargets[index];

    //   // if () {
    //   //   break;
    //   // }
    // }

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

    draggable.onDrag((state) => {
      draggable.pan.setValue({
        x: state.dx,
        y: state.dy,
      });

      const dropTarget = this.findDropTargetOverlap(draggable);
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
