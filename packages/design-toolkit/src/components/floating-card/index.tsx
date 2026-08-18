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

import { type PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_DIMENSIONS, DEFAULT_POSITION } from './constants';
import { useFloatingCard, useFloatingCardRegistry } from './context';
import type { FloatingCardProps } from './types';

/**
 * Renders its children into a floating card using React portals.
 *
 * The `FloatingCard` component registers itself with the floating card engine on mount
 * and renders its children into the corresponding DOM node via a portal.
 *
 * @param id - Unique identifier for the floating card.
 * @param title - Optional title displayed in the floating card header.
 * @param isOpen - Whether the floating card is rendered. Defaults to `true`.
 * @param initialDimensions - Initial width and height of the floating card. Defaults to `{ width: 300, height: 400 }`.
 * @param initialPosition - Initial x and y coordinates of the floating card.
 * @param children - React children to render inside the floating card.
 * @returns The floating card component (portaled content) or null.
 *
 * @remarks
 * - Requires `FloatingCardProvider` as an ancestor.
 * - The floating card is only rendered if a valid DOM reference exists for the given `id`.
 * - `initialDimensions` and `initialPosition` are applied each time the card
 *   opens. While it stays open, later changes to them are ignored so a user's
 *   own drag or resize is never overridden; closing and reopening starts the
 *   card from those values again.
 *
 * @example
 * ```tsx
 * import { uuid } from '@accelint/core/utility/uuid';
 *
 * const cardId = uuid();
 * const [isOpen, setIsOpen] = useState(true);
 *
 * <FloatingCardProvider>
 *   <FloatingCard
 *     id={cardId}
 *     title="Settings Panel"
 *     isOpen={isOpen}
 *     initialDimensions={{ width: 400, height: 500 }}
 *   >
 *     <SettingsForm />
 *   </FloatingCard>
 *
 *   <button onClick={() => setIsOpen(!isOpen)}>
 *     Toggle Panel
 *   </button>
 * </FloatingCardProvider>
 * ```
 */
export function FloatingCard({
  id,
  children,
  title,
  isOpen = true,
  initialDimensions,
  initialPosition,
}: PropsWithChildren<FloatingCardProps>) {
  const { cards, closeCard } = useFloatingCard();
  const { openCard } = useFloatingCardRegistry();

  const { width, height } = initialDimensions ?? DEFAULT_DIMENSIONS;
  const { x, y } = initialPosition ?? DEFAULT_POSITION;

  useEffect(() => {
    if (!isOpen) {
      closeCard(id);

      return;
    }

    openCard(id, title, { x, y }, { width, height });
  }, [id, title, isOpen, width, height, x, y, openCard, closeCard]);

  // Unregister on unmount so a card removed from the tree leaves no panel behind.
  useEffect(() => {
    return () => {
      closeCard(id);
    };
  }, [id, closeCard]);

  return isOpen && cards[id] ? createPortal(children, cards[id]) : null;
}
