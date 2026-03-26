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

export type FloatingCardProps = Readonly<{
  id: UniqueId;
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
 * @param children - React children to render inside the floating card.
 *
 * @remarks
 * - Requires `FloatingCardProvider` as an ancestor.
 * - The floating card is only rendered if a valid DOM reference exists for the given `id`.
 */
export function FloatingCard({
  id,
  children,
  title,
  isOpen = true,
  initialDimensions,
}: PropsWithChildren<FloatingCardProps>) {
  const floatingCardContext = useFloatingCard();

  const { width, height } = initialDimensions ?? defaultDimensions;

  useEffect(() => {
    // If the API is not available, we cannot register the card. This can happen if Dockview is not fully initialized yet.
    if (!floatingCardContext.api) {
      return;
    }
    if (!isOpen) {
      floatingCardContext.api.getPanel(id)?.api.close();
      return;
    }

    if (!floatingCardContext.api.getPanel(id)) {
      const panel = floatingCardContext.api.addPanel({
        id,
        title,
        component: 'default',
        floating: { width, height },
      });

      panel.group.locked = 'no-drop-target';
    }

    // Cleanup not included here. Cleanup is done at the provider level when the card is removed from the `cards` registry.
  }, [id, title, isOpen, width, height, floatingCardContext.api]);

  useEffect(() => {
    const panel = floatingCardContext.api?.getPanel(id);
    if (panel) {
      panel.setTitle(title ?? id);
    }
  }, [title, floatingCardContext.api, id]);

  return isOpen && floatingCardContext.cards[id]
    ? createPortal(children, floatingCardContext.cards[id])
    : null;
}
