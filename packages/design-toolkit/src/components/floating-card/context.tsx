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
import type { Dimensions, FloatingCardContextValue, Position } from './types';

/**
 * How a `FloatingCard` attaches itself to its provider.
 *
 * @remarks
 * Internal wiring rather than application API, so it is declared here rather
 * than alongside the public types. Every member is stable for the provider's
 * lifetime.
 */
export type FloatingCardRegistryValue = {
  /** Registers a card with the provider so it renders as a panel */
  openCard: (
    id: UniqueId,
    title: string | undefined,
    position: Position,
    dimensions: Dimensions,
  ) => void;

  /** Registers the DOM node a card's children portal into */
  addRef: (id: UniqueId, ref: HTMLDivElement | null) => void;
};

export const FloatingCardContext =
  createContext<FloatingCardContextValue | null>(null);

/**
 * Wiring between `FloatingCard` and its provider.
 *
 * @remarks
 * Deliberately separate from {@link FloatingCardContext}: registering a card is
 * an internal detail, so it stays off the value applications consume. Its
 * members are stable for the provider's lifetime, so reading it never causes a
 * re-render.
 */
export const FloatingCardRegistryContext =
  createContext<FloatingCardRegistryValue | null>(null);

/**
 * Reads the registration channel a `FloatingCard` uses to attach itself.
 *
 * @returns The provider's registration callbacks.
 * @throws {Error} If used outside of a FloatingCardProvider.
 */
export function useFloatingCardRegistry(): FloatingCardRegistryValue {
  const context = useContext(FloatingCardRegistryContext);

  if (!context) {
    // Only FloatingCard reads this, so name that rather than the internal hook.
    throw new Error(
      'FloatingCard must be rendered within a FloatingCardProvider.',
    );
  }

  return context;
}

/**
 * Hook to access floating card management functionality.
 *
 * Provides the card registry and programmatic control over closing and pinning
 * floating cards.
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
