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

import { createContext, useContext } from 'react';
import type { UniqueId } from '@accelint/core/utility/uuid';
import type { DockviewApi } from 'dockview-react';

/**
 * Context value providing floating card management functionality.
 *
 * @remarks
 * Exposed via FloatingCardProvider to child components. Use useFloatingCard() hook to access.
 */
export type FloatingCardContextValue = {
  /** Registry mapping card IDs to their rendered DOM containers */
  cards: Record<UniqueId, HTMLDivElement>;

  /** Registers a DOM ref for a card container after it mounts */
  addRef: (id: UniqueId, ref: HTMLDivElement | null) => void;

  /** Unregisters a card's DOM ref when it's removed */
  removeRef: (view: UniqueId) => void;

  /** Programmatically closes a floating card by ID */
  closeCard: (id: UniqueId) => void;

  /** Toggles pin state for a floating card, disabling drag when pinned */
  togglePinCard: (id: UniqueId) => void;

  /** Checks if a floating card is currently pinned */
  isPinned: (id: UniqueId) => boolean;

  /** Dockview API instance, null until FloatingCardProvider's onReady fires */
  api: DockviewApi | null;
};

export const FloatingCardContext =
  createContext<FloatingCardContextValue | null>(null);
/**
 * Hook to access floating card management functionality.
 *
 * Provides access to card registry, ref management, and programmatic control
 * over opening, closing, and pinning floating cards.
 *
 * @returns Context value with card management methods and state.
 * @throws {Error} If used outside of a FloatingCardProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { closeCard, togglePinCard } = useFloatingCard();
 *
 *   return (
 *     <button onClick={() => closeCard('my-card-id' as UniqueId)}>
 *       Close Card
 *     </button>
 *   );
 * }
 * ```
 */
export function useFloatingCard(): FloatingCardContextValue {
  const context = useContext(FloatingCardContext);
  if (!context) {
    throw new Error(
      'useFloatingCard must be used within a FloatingCardProvider.',
    );
  }
  return context;
}
