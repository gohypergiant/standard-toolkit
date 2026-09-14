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

/**
 * A value that can be static or dynamically computed per floating card.
 *
 * Enables per-card customization of props by passing a factory function
 * that receives the card ID and returns the appropriate value.
 *
 * @template T - The type of the static value or factory return type.
 */
export type MaybeFactory<T> = T | ((cardId: string) => T);

/**
 * Reads a value that callers may supply either directly or as a per-card factory.
 *
 * @template T - Type of the resolved value.
 * @param value - The static value or factory.
 * @param cardId - Card the value is being resolved for.
 * @returns The value for this card.
 *
 * @example
 * ```tsx
 * const icon = resolveMaybeFactory(props.icon, cardId);
 * ```
 */
export function resolveMaybeFactory<T>(
  value: MaybeFactory<T> | undefined,
  cardId: string,
): T | undefined {
  return typeof value === 'function'
    ? (value as (cardId: string) => T)(cardId)
    : value;
}
