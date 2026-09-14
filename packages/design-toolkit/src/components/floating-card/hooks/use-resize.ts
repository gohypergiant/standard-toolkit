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

import { clamp } from 'radashi';
import { useCallback, useRef } from 'react';
import { MIN_DIMENSIONS } from '../constants';
import { useMouseInteraction } from './use-mouse-interaction';
import type { Bounds, Dimensions, Position, ResizeHandle } from '../types';

type ResizeSession = {
  pointerX: number;
  pointerY: number;
  origin: Position;
  size: Dimensions;
  handle: ResizeHandle;
  bounds: Bounds;
};

export type UseResizeProps = {
  /** Whether resizing is disabled, e.g. because the card is pinned. */
  disabled: boolean;
  /** Current card position. */
  position: Position;
  /** Current card dimensions. */
  dimensions: Dimensions;
  /** Reads the bounding box once when the gesture starts. */
  getBounds: () => Bounds;
  /** Called with the new geometry during the resize. */
  onResize: (dimensions: Dimensions, position: Position) => void;
  /** Called once when the gesture begins. */
  onResizeStart?: () => void;
};

/**
 * Resizes a card from any of its eight edges and corners.
 *
 * @param props - {@link UseResizeProps}
 * @returns `getHandleProps`, which builds the pointer handler for one handle.
 *
 * @remarks
 * North and west handles move the card's origin as well as its size so the
 * opposite edge stays put. Every result is clamped to {@link MIN_DIMENSIONS}
 * and to the container, so a card can never be resized outside its bounds or
 * collapsed to nothing.
 */
export function useResize({
  disabled,
  position,
  dimensions,
  getBounds,
  onResize,
  onResizeStart,
}: UseResizeProps) {
  const latest = useRef({ position, dimensions, disabled });
  latest.current = { position, dimensions, disabled };

  const { handleStart } = useMouseInteraction<ResizeSession, ResizeHandle>({
    shouldStart: (event) => !latest.current.disabled && event.button === 0,
    onStart: (event, handle) => {
      onResizeStart?.();

      return {
        pointerX: event.clientX,
        pointerY: event.clientY,
        origin: latest.current.position,
        size: latest.current.dimensions,
        handle,
        bounds: getBounds(),
      };
    },
    onMove: (event, session) => {
      const deltaX = event.clientX - session.pointerX;
      const deltaY = event.clientY - session.pointerY;
      const { handle, origin, size, bounds } = session;

      let { x, y } = origin;
      let { width, height } = size;

      // A card that already extends past its bounds must still be resizable, so
      // the limit never falls below the size the gesture started at -- otherwise
      // the first pointermove would snap it inward.
      if (handle.includes('e')) {
        const limit = Math.max(bounds.right - origin.x, size.width);

        width = Math.min(size.width + deltaX, limit);
      }

      if (handle.includes('s')) {
        const limit = Math.max(bounds.bottom - origin.y, size.height);

        height = Math.min(size.height + deltaY, limit);
      }

      if (handle.includes('w')) {
        // Clamping x first keeps the right edge fixed while honouring bounds.
        const right = origin.x + size.width;
        const limit = Math.min(bounds.left, origin.x);

        x = clamp(origin.x + deltaX, limit, right - MIN_DIMENSIONS.width);
        width = right - x;
      }

      if (handle.includes('n')) {
        const bottom = origin.y + size.height;
        const limit = Math.min(bounds.top, origin.y);

        y = clamp(origin.y + deltaY, limit, bottom - MIN_DIMENSIONS.height);
        height = bottom - y;
      }

      onResize(
        {
          width: Math.max(width, MIN_DIMENSIONS.width),
          height: Math.max(height, MIN_DIMENSIONS.height),
        },
        { x, y },
      );
    },
  });

  const getHandleProps = useCallback(
    (handle: ResizeHandle) => ({
      onPointerDown: (event: React.PointerEvent) => {
        handleStart(event.nativeEvent, handle);
      },
    }),
    [handleStart],
  );

  return { getHandleProps };
}
