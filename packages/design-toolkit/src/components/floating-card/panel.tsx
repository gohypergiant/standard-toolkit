// __private-exports
/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { useCallback, useMemo } from 'react';
import { useDrag } from './hooks/use-drag';
import { useResize } from './hooks/use-resize';
import styles from './styles.module.css';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { ReactNode, RefCallback } from 'react';
import type {
  Bounds,
  Dimensions,
  FloatingCardLayout,
  Position,
  ResizeHandle,
} from './types';

/** Handles rendered around the card, paired with the cursor each one shows. */
const RESIZE_HANDLES: readonly ResizeHandle[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw',
];

export type FloatingCardPanelProps = {
  /** Identifier of the card this panel renders. */
  id: UniqueId;
  /** Current geometry and stacking order. */
  layout: FloatingCardLayout;
  /** Whether the card is pinned, which freezes drag and resize. */
  isPinned: boolean;
  /** Header content rendered before the title. */
  header: ReactNode;
  /** Header content rendered after the title, typically actions. */
  actions: ReactNode;
  /** Reads the provider's box so gestures can be constrained to it. */
  getBounds: () => Bounds;
  /** Registers the portal target that card children render into. */
  contentRef: RefCallback<HTMLDivElement>;
  /** Raises this card above its siblings. */
  onFocus: () => void;
  /** Commits a new position during a drag. */
  onMove: (position: Position) => void;
  /** Commits new geometry during a resize. */
  onResize: (dimensions: Dimensions, position: Position) => void;
  /** Accessible name for the card, taken from its title. */
  label: string;
};

/**
 * Renders one floating card: its chrome, its drag surface, and the portal
 * target its children mount into.
 *
 * @param props - {@link FloatingCardPanelProps}
 * @returns The positioned card element.
 *
 * @remarks
 * Presentational only -- all geometry is owned by the provider and passed in,
 * so this component stays a pure function of its props.
 */
export function FloatingCardPanel({
  id,
  layout,
  isPinned,
  header,
  actions,
  getBounds,
  contentRef,
  onFocus,
  onMove,
  onResize,
  label,
}: FloatingCardPanelProps) {
  const { position, dimensions, zIndex } = layout;

  const { handleStart } = useDrag({
    disabled: isPinned,
    position,
    dimensions,
    getBounds,
    onPositionChange: onMove,
    onDragStart: onFocus,
  });

  const { getHandleProps } = useResize({
    disabled: isPinned,
    position,
    dimensions,
    getBounds,
    onResize,
    onResizeStart: onFocus,
  });

  const handleHeaderPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onFocus();
      handleStart(event.nativeEvent);
    },
    [handleStart, onFocus],
  );

  const style = useMemo(
    () => ({
      left: position.x,
      top: position.y,
      width: dimensions.width,
      height: dimensions.height,
      zIndex,
    }),
    [position.x, position.y, dimensions.width, dimensions.height, zIndex],
  );

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: pointerdown only raises the card; every control inside stays keyboard reachable.
    <div
      aria-label={label}
      // Cards coexist with the rest of the application rather than blocking it,
      // so the dialog is explicitly non-modal.
      aria-modal='false'
      className={styles.panel}
      data-pinned={isPinned || undefined}
      onPointerDown={onFocus}
      role='dialog'
      style={style}
    >
      <div className={styles.header} onPointerDown={handleHeaderPointerDown}>
        {header}
        <div className={styles.headerActions}>{actions}</div>
      </div>

      <div className={styles.content} ref={contentRef} />

      {isPinned
        ? null
        : RESIZE_HANDLES.map((handle) => (
            <div
              aria-hidden='true'
              className={styles[`resize-${handle}`]}
              data-handle={handle}
              key={`${id}-resize-${handle}`}
              {...getHandleProps(handle)}
            />
          ))}
    </div>
  );
}
