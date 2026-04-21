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
import { useFloatingCard } from './context';
import type { UniqueId } from '@accelint/core';

const defaultDimensions = { width: 300, height: 400 } as const;

/**
 * Props for the FloatingCard component.
 *
 * @example
 * ```tsx
 * const props: FloatingCardProps = {
 *   id: 'panel-123' as UniqueId,
 *   title: 'My Panel',
 *   isOpen: true,
 *   initialDimensions: { width: 350, height: 450 }
 * };
 * ```
 */
export type FloatingCardProps = Readonly<{
  /** Unique identifier for the floating card */
  id: UniqueId;
  /** Optional title displayed in the floating card header */
  title?: string;
  /**
   * Controls whether the floating card is rendered.
   *
   * When `true`, the card registers with the floating card engine and renders its
   * children via a portal. When `false`, the card is closed and removed.
   *
   * @defaultValue true
   */
  isOpen?: boolean;
  /**
   * Initial dimensions of the floating card panel.
   *
   * @defaultValue { width: 300, height: 400 }
   */
  initialDimensions?: Readonly<{ width: number; height: number }>;
  /**
   * Initial position of the floating card panel.
   *
   * When provided, sets the x and y coordinates of the floating card.
   */
  initialPosition?: Readonly<{ x: number; y: number }>;
}>;

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
  const { cards, api: floatingCardApi } = useFloatingCard();

  const { width, height } = initialDimensions ?? defaultDimensions;
  const { x, y } = initialPosition ?? {};

  // Register card with Dockview API when isOpen changes.
  // Early return if API not ready (Dockview not fully initialized).
  useEffect(() => {
    if (!floatingCardApi) {
      return;
    }
    if (!isOpen) {
      floatingCardApi.getPanel(id)?.api.close();
      return;
    }

    if (!floatingCardApi.getPanel(id)) {
      const panel = floatingCardApi.addPanel({
        id,
        title,
        component: 'default',
        floating: { width, height, x, y },
      });

      panel.group.locked = 'no-drop-target';
    }

    // Cleanup not included here. Cleanup is done at the provider level when the card is removed from the `cards` registry.
  }, [id, title, isOpen, width, height, x, y, floatingCardApi]);

  useEffect(() => {
    const panel = floatingCardApi?.getPanel(id);
    if (panel) {
      panel.setTitle(title ?? id);
    }
  }, [title, floatingCardApi, id]);

  return isOpen && cards[id] ? createPortal(children, cards[id]) : null;
}
