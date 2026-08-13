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

  // Which handle is active is only known at pointerdown, so it is stashed here
  // for the shared session to read.
  const handleRef = useRef<ResizeHandle>('se');

  const { handleStart } = useMouseInteraction<ResizeSession>({
    shouldStart: (event) => !latest.current.disabled && event.button === 0,
    onStart: (event) => {
      onResizeStart?.();

      return {
        pointerX: event.clientX,
        pointerY: event.clientY,
        origin: latest.current.position,
        size: latest.current.dimensions,
        handle: handleRef.current,
        bounds: getBounds(),
      };
    },
    onMove: (event, session) => {
      const deltaX = event.clientX - session.pointerX;
      const deltaY = event.clientY - session.pointerY;
      const { handle, origin, size, bounds } = session;

      let { x, y } = origin;
      let { width, height } = size;

      if (handle.includes('e')) {
        width = Math.min(size.width + deltaX, bounds.right - origin.x);
      }

      if (handle.includes('s')) {
        height = Math.min(size.height + deltaY, bounds.bottom - origin.y);
      }

      if (handle.includes('w')) {
        // Clamping x first keeps the right edge fixed while honouring bounds.
        const right = origin.x + size.width;
        x = Math.min(
          Math.max(origin.x + deltaX, bounds.left),
          right - MIN_DIMENSIONS.width,
        );
        width = right - x;
      }

      if (handle.includes('n')) {
        const bottom = origin.y + size.height;
        y = Math.min(
          Math.max(origin.y + deltaY, bounds.top),
          bottom - MIN_DIMENSIONS.height,
        );
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
    onEnd: () => undefined,
  });

  const getHandleProps = useCallback(
    (handle: ResizeHandle) => ({
      onPointerDown: (event: React.PointerEvent) => {
        handleRef.current = handle;
        handleStart(event.nativeEvent);
      },
    }),
    [handleStart],
  );

  return { getHandleProps };
}
