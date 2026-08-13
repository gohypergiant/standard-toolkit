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

import { useRef } from 'react';
import { DRAG_THRESHOLD } from '../constants';
import { useMouseInteraction } from './use-mouse-interaction';
import type { Bounds, Dimensions, Position } from '../types';

/** Elements that own their own pointer behavior and must never begin a drag. */
const INTERACTIVE_SELECTORS = [
  'button',
  'input',
  'select',
  'textarea',
  'a',
  '[role="button"]',
  '[role="link"]',
  '[contenteditable]',
].join(', ');

function isInteractiveElement(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(INTERACTIVE_SELECTORS)
    ? true
    : false;
}

/**
 * Clamps a position so the card stays fully inside its bounds.
 *
 * @param position - Desired top-left position.
 * @param dimensions - Card size, used to keep the far edges inside.
 * @param bounds - Box the card must remain within.
 * @returns The clamped position.
 */
export function constrainPosition(
  position: Position,
  dimensions: Dimensions,
  bounds: Bounds,
): Position {
  return {
    x: Math.max(
      bounds.left,
      Math.min(
        position.x,
        Math.max(bounds.left, bounds.right - dimensions.width),
      ),
    ),
    y: Math.max(
      bounds.top,
      Math.min(
        position.y,
        Math.max(bounds.top, bounds.bottom - dimensions.height),
      ),
    ),
  };
}

type DragSession = {
  isDragging: boolean;
  pointerX: number;
  pointerY: number;
  origin: Position;
  bounds: Bounds;
};

export type UseDragProps = {
  /** Whether dragging is disabled, e.g. because the card is pinned. */
  disabled: boolean;
  /** Current card position. */
  position: Position;
  /** Current card dimensions. */
  dimensions: Dimensions;
  /** Reads the bounding box once when the gesture starts. */
  getBounds: () => Bounds;
  /** Called with each new position during the drag. */
  onPositionChange: (position: Position) => void;
  /** Called once when the drag threshold is first crossed. */
  onDragStart?: () => void;
};

/**
 * Drags a card by a pointer gesture, keeping it inside its container.
 *
 * @param props - {@link UseDragProps}
 * @returns A `handleStart` handler to attach to the card's drag surface.
 *
 * @remarks
 * A drag only begins once the pointer moves past {@link DRAG_THRESHOLD}, so a
 * click on the header still reads as a click. Bounds are read once per gesture
 * rather than per move to keep the drag off the layout path.
 */
export function useDrag({
  disabled,
  position,
  dimensions,
  getBounds,
  onPositionChange,
  onDragStart,
}: UseDragProps) {
  // Read inside the session so a drag in progress always sees current values.
  const latest = useRef({ position, dimensions, disabled });
  latest.current = { position, dimensions, disabled };

  const { handleStart } = useMouseInteraction<DragSession>({
    shouldStart: (event) =>
      !latest.current.disabled &&
      event.button === 0 &&
      !isInteractiveElement(event.target),
    onStart: (event) => ({
      isDragging: false,
      pointerX: event.clientX,
      pointerY: event.clientY,
      origin: latest.current.position,
      bounds: getBounds(),
    }),
    onMove: (event, session) => {
      const deltaX = event.clientX - session.pointerX;
      const deltaY = event.clientY - session.pointerY;

      if (!session.isDragging && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
        return;
      }

      if (!session.isDragging) {
        session.isDragging = true;
        onDragStart?.();
      }

      onPositionChange(
        constrainPosition(
          {
            x: session.origin.x + deltaX,
            y: session.origin.y + deltaY,
          },
          latest.current.dimensions,
          session.bounds,
        ),
      );
    },
    onEnd: () => undefined,
  });

  return { handleStart };
}
