import { Draggable, DragState } from './draggable';
import { DropTarget } from './drop_target';

export interface DragDropHandlers {
  registerDraggable: (draggable: Draggable) => void;
  unregisterDraggable: (draggable: Draggable) => void;
  registerDropTarget: (dropTarget: DropTarget) => void;
  unregisterDropTarget: (dropTarget: DropTarget) => void;
}

export class DragDrop implements DragDropHandlers {
  _draggables: { [key: string]: Draggable } = {};
  _dropTargets: { [key: string]: DropTarget } = {};

  _activeDraggable: Draggable | null = null;
  _activeDropTarget: DropTarget | null = null;

  get dropTargets(): DropTarget[] {
    return Object.values(this._dropTargets);
  }

  get draggables(): Draggable[] {
    return Object.values(this._draggables);
  }

  getDropTarget = (dragState: DragState): DropTarget | null => {
    for (let index = 0; index < this.dropTargets.length; index++) {
      const dropTarget = this.dropTargets[index];

      if (dropTarget.measurements) {
        const { width, height, pageX, pageY } = dropTarget.measurements;

        const isWithinHorizontalBound =
          pageX <= dragState.pageX && dragState.pageX <= pageX + width;
        const isWithinVerticalBound =
          pageY <= dragState.pageY && dragState.pageY <= pageY + height;

        if (isWithinHorizontalBound && isWithinVerticalBound) {
          return dropTarget;
        }
      } else {
        throw new Error(
          `DragDrop: dropTarget(${dropTarget.key}) has not been provided measurements`,
        );
      }
    }

    return null;
  };

  _handleDragStart = async (draggable: Draggable) => {
    draggable.onStart();
    this._activeDraggable = draggable;
  };

  _handleDrag = async (draggable: Draggable, dragState: DragState) => {
    const dropTarget = this.getDropTarget(dragState);

    if (dropTarget) {
      if (!this._activeDropTarget) {
        dropTarget.onEnter(draggable);
        this._activeDropTarget = dropTarget;
      } else if (this._activeDropTarget.key === dropTarget.key) {
        dropTarget.onHover(draggable, dragState);
      }
    } else {
      if (this._activeDropTarget) {
        this._activeDropTarget.onLeave(draggable);
        this._activeDropTarget = null;
      }
    }
  };

  _handleDragEnd = async (draggable: Draggable) => {
    draggable.onEnd();

    if (!this._activeDropTarget) {
      draggable.onCancel();
    } else {
      if (this._activeDropTarget.onWillAccept(draggable)) {
        this._activeDropTarget.onAccept(draggable);
        draggable.onComplete();
      } else {
        draggable.onCancel();
      }
    }

    this._activeDraggable = null;
    this._activeDropTarget = null;
  };

  registerDraggable = (draggable: Draggable) => {
    this._draggables[draggable.key] = draggable;

    draggable.addDragStartListener(() => this._handleDragStart(draggable));

    draggable.addDragListener((dragState) =>
      this._handleDrag(draggable, dragState),
    );

    draggable.addDragEndListener(() => this._handleDragEnd(draggable));
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
