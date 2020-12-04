import React, { createContext, useContext, useRef } from 'react';
import { Draggable, DragState } from './draggable';
import { DropTarget } from './drop_target';

export interface DragDropHandlers {
  registerDraggable: <T>(draggable: Draggable<T>) => void;
  unregisterDraggable: <T>(draggable: Draggable<T>) => void;
  registerDropTarget: (dropTarget: DropTarget) => void;
  unregisterDropTarget: (dropTarget: DropTarget) => void;
}

export class DragDrop implements DragDropHandlers {
  _draggables: { [key: string]: Draggable<unknown> } = {};
  _dropTargets: { [key: string]: DropTarget } = {};

  _activeDraggable: Draggable<unknown> | null = null;
  _activeDropTarget: DropTarget | null = null;

  get dropTargets(): DropTarget[] {
    return Object.values(this._dropTargets);
  }

  get draggables(): Draggable<unknown>[] {
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

  _handleDragStart = (draggable: Draggable<any>): void => {
    draggable.onStart();
    this._activeDraggable = draggable;
  };

  _handleDrag = (draggable: Draggable<any>, dragState: DragState): void => {
    const dropTarget = this.getDropTarget(dragState);

    if (dropTarget) {
      if (!this._activeDropTarget) {
        dropTarget.onEnter(draggable);
        this._activeDropTarget = dropTarget;
      } else if (this._activeDropTarget.key === dropTarget.key) {
        dropTarget.onHover(draggable, dragState);
      } else {
        // Ensures that when drop targets are next to each other
        // it will leave the first one first
        this._activeDropTarget.onLeave(draggable);
        this._activeDropTarget = null;
      }
    } else {
      if (this._activeDropTarget) {
        this._activeDropTarget.onLeave(draggable);
        this._activeDropTarget = null;
      }
    }
  };

  _handleDragEnd = (draggable: Draggable<any>): void => {
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

  registerDraggable = (draggable: Draggable<any>): void => {
    this._draggables[draggable.key] = draggable;

    draggable.addDragStartListener(() => this._handleDragStart(draggable));

    draggable.addDragListener((dragState) =>
      this._handleDrag(draggable, dragState),
    );

    draggable.addDragEndListener(() => this._handleDragEnd(draggable));
  };

  unregisterDraggable = (draggable: Draggable<any>): void => {
    delete this._draggables[draggable.key];
  };

  registerDropTarget = (dropTarget: DropTarget): void => {
    this._dropTargets[dropTarget.key] = dropTarget;
  };

  unregisterDropTarget = (dropTarget: DropTarget): void => {
    delete this._dropTargets[dropTarget.key];
  };
}

interface DragDropProviderProps {
  children?: React.ReactNode;
}

const DragDropContext = createContext<DragDropHandlers>({
  registerDraggable: () => {
    return {
      startDrag: () => {
        return;
      },
      drag: () => {
        return;
      },
      endDrag: () => {
        return;
      },
    };
  },
  unregisterDraggable: () => {
    return;
  },
  registerDropTarget: () => {
    return;
  },
  unregisterDropTarget: () => {
    return;
  },
});

export function DragDropProvider(props: DragDropProviderProps): JSX.Element {
  const { children } = props;

  const dragDrop = useRef(new DragDrop()).current;
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
  return useContext(DragDropContext);
}
