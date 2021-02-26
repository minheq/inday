import { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  EditingKey,
  KeyBinding,
  NavigationKey,
  UIKey,
  useKeyboard,
  WhiteSpaceKey,
} from '../../lib/keyboard';
import {
  getDocumentID,
  getLeafRowCellTop,
  getLeafRowCellBottom,
  getLeafRowCellBottomMost,
  getLeafRowCellLeft,
  getLeafRowCellLeftMost,
  getLeafRowCellRight,
  getLeafRowCellRightMost,
  getLeafRowCellTopMost,
} from './list_view_map';
import { activeCellState, useListViewViewContext } from './list_view_view';
import { useLeafRowCellContext } from './leaf_row_cell';

interface UseCellKeyBindingsProps {
  onDelete?: () => void;
  onPrintableKey?: (key: string) => void;
  onEnter?: () => void;
}

export function useCellKeyBindings(props: UseCellKeyBindingsProps = {}): void {
  const {
    onEnter: onEnterOverride,
    onPrintableKey: onPrintableKeyOverride,
    onDelete: onDeleteOverride,
  } = props;
  const { listViewMap, onOpenDocument } = useListViewViewContext();
  const { cell } = useLeafRowCellContext();
  const setActiveCell = useSetRecoilState(activeCellState);

  // Listen for keyboard strokes only when the cell is focused
  const active = cell !== null && cell.state === 'focused';

  const onArrowDown = useCallback(() => {
    const cellBelow = getLeafRowCellBottom(listViewMap, cell);

    if (!cellBelow) {
      return;
    }

    setActiveCell({ ...cellBelow, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onArrowUp = useCallback(() => {
    const cellAbove = getLeafRowCellTop(listViewMap, cell);

    if (!cellAbove) {
      return;
    }

    setActiveCell({ ...cellAbove, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onArrowLeft = useCallback(() => {
    const cellLeft = getLeafRowCellLeft(listViewMap, cell);

    if (!cellLeft) {
      return;
    }

    setActiveCell({ ...cellLeft, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onArrowRight = useCallback(() => {
    const cellRight = getLeafRowCellRight(listViewMap, cell);

    if (!cellRight) {
      return;
    }

    setActiveCell({ ...cellRight, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onMetaArrowDown = useCallback(() => {
    const cellBottomMost = getLeafRowCellBottomMost(listViewMap, cell);
    setActiveCell({ ...cellBottomMost, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onMetaArrowUp = useCallback(() => {
    const cellTopMost = getLeafRowCellTopMost(listViewMap, cell);
    setActiveCell({ ...cellTopMost, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onMetaArrowLeft = useCallback(() => {
    const cellLeftMost = getLeafRowCellLeftMost(listViewMap, cell);
    setActiveCell({ ...cellLeftMost, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onMetaArrowRight = useCallback(() => {
    const cellRightMost = getLeafRowCellRightMost(listViewMap, cell);
    setActiveCell({ ...cellRightMost, state: 'focused' });
  }, [cell, setActiveCell, listViewMap]);

  const onEscape = useCallback(() => {
    setActiveCell(null);
  }, [setActiveCell]);

  const onDelete = useCallback(() => {
    if (onDeleteOverride) {
      onDeleteOverride();
    }
  }, [onDeleteOverride]);

  const onPrintableKey = useCallback(
    (key: string) => {
      if (onPrintableKeyOverride !== undefined) {
        onPrintableKeyOverride(key);
      }
    },
    [onPrintableKeyOverride],
  );

  const onEnter = useCallback(() => {
    if (onEnterOverride !== undefined) {
      onEnterOverride();
      return;
    }

    setActiveCell({ ...cell, state: 'editing' });
  }, [cell, setActiveCell, onEnterOverride]);

  const onSpace = useCallback(() => {
    const documentID = getDocumentID(listViewMap, cell);

    onOpenDocument(documentID);
  }, [cell, onOpenDocument, listViewMap]);

  const focusedCellKeyBindings = useMemo((): KeyBinding[] => {
    return [
      {
        key: NavigationKey.ArrowDown,
        handler: onArrowDown,
      },
      {
        key: NavigationKey.ArrowUp,
        handler: onArrowUp,
      },
      {
        key: NavigationKey.ArrowLeft,
        handler: onArrowLeft,
      },
      {
        key: NavigationKey.ArrowRight,
        handler: onArrowRight,
      },
      {
        key: NavigationKey.ArrowDown,
        meta: true,
        handler: onMetaArrowDown,
      },
      {
        key: NavigationKey.ArrowUp,
        meta: true,
        handler: onMetaArrowUp,
      },
      {
        key: NavigationKey.ArrowLeft,
        meta: true,
        handler: onMetaArrowLeft,
      },
      {
        key: NavigationKey.ArrowRight,
        meta: true,
        handler: onMetaArrowRight,
      },
      {
        key: UIKey.Escape,
        handler: onEscape,
      },
      {
        key: WhiteSpaceKey.Enter,
        handler: onEnter,
      },
      {
        key: WhiteSpaceKey.Space,
        handler: onSpace,
      },
      {
        key: EditingKey.Backspace,
        handler: onDelete,
      },
      {
        key: EditingKey.Delete,
        handler: onDelete,
      },
      {
        key: 'PrintableKey',
        handler: onPrintableKey,
      },
    ];
  }, [
    onArrowDown,
    onArrowUp,
    onArrowLeft,
    onArrowRight,
    onMetaArrowDown,
    onMetaArrowUp,
    onMetaArrowLeft,
    onMetaArrowRight,
    onEscape,
    onEnter,
    onSpace,
    onDelete,
    onPrintableKey,
  ]);

  useKeyboard(focusedCellKeyBindings, active);
}
