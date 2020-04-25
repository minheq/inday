import { View } from 'react-native';
import { Measurements, measure } from './measurements';

export interface DropTargetCallbacks {
  /** Called when an acceptable draggable was dropped over this drop target. */
  onAccept?: () => void;

  /** Called when a given draggable being dragged over this target leaves the target. */
  onLeave?: () => void;

  /** Called when a draggable is being dragged over this drop target. */
  onEnter?: () => void;

  /** Called when a draggable is hovering over this drop target. */
  onHover?: () => void;

  /** Called to determine whether this widget is interested in receiving a given draggable being dragged over this drop target. */
  onWillAccept?: () => boolean;
}

export interface DropTargetConstructorProps {
  ref: React.MutableRefObject<View | null>;
}

export type EnterCallback = () => Promise<void>;
export type HoverCallback = () => Promise<void>;
export type LeaveCallback = () => Promise<void>;
export type AcceptCallback = () => Promise<void>;

let keySequence = 1;

export class DropTarget {
  key: string;
  ref: React.MutableRefObject<View | null>;
  measurements: Measurements | null = null;

  constructor(props: DropTargetConstructorProps) {
    const { ref } = props;

    this.key = `${keySequence++}`;
    this.ref = ref;
  }

  _hoverListeners: HoverCallback[] = [];
  _enterListeners: EnterCallback[] = [];
  _leaveListeners: LeaveCallback[] = [];
  _acceptListeners: AcceptCallback[] = [];

  onLeave = (fn: LeaveCallback) => {
    this._leaveListeners.push(fn);
  };

  onHover = (fn: HoverCallback) => {
    this._hoverListeners.push(fn);
  };

  onAccept = (fn: AcceptCallback) => {
    this._acceptListeners.push(fn);
  };

  onEnter = (fn: EnterCallback) => {
    this._enterListeners.push(fn);
  };

  leave = () => {
    this._leaveListeners.forEach(async (fn) => {
      await fn();
    });
  };

  hover = () => {
    this._acceptListeners.forEach(async (fn) => {
      await fn();
    });
  };

  accept = () => {
    this._acceptListeners.forEach(async (fn) => {
      await fn();
    });
  };

  enter = () => {
    this._enterListeners.forEach(async (fn) => {
      await fn();
    });
  };

  measure = async () => {
    this.measurements = await measure(this.ref);
  };
}
