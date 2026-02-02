/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { v4 } from 'uuid';
import { z } from 'zod';
import type { Tagged } from 'type-fest';

export type UniqueId = Tagged<string, 'UUID'>;

/**
 * Generates a new UUID v4.
 *
 * ⚠️ **React/SSR Warning**: Do NOT call this function inside React components
 * or hooks, as it will generate different IDs during server-side rendering
 * and client hydration, causing React hydration errors.
 *
 * For React components, use React's `useId()` hook instead:
 * ```typescript
 * import { useId } from 'react';
 * import type { UniqueId } from '@accelint/core';
 *
 * function MyComponent() {
 *   const id = useId() as UniqueId; // ✅ Stable across server/client
 *   return <div id={id}>...</div>;
 * }
 * ```
 *
 * This function is safe to use:
 * - At module level (outside components)
 * - In Node.js/server-side code
 * - In client-only code that never runs during SSR
 *
 * @returns A unique identifier string.
 *
 * @example
 * ```typescript
 * import { uuid } from '@accelint/core';
 *
 * // ✅ CORRECT - Module-level constant
 * const FEATURE_ID = uuid();
 *
 * export function MyComponent() {
 *   return <Feature id={FEATURE_ID}>...</Feature>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // ❌ WRONG - Inside component (causes hydration mismatch)
 * function MyComponent() {
 *   const id = uuid(); // Different ID on server vs client!
 *   return <div id={id}>...</div>;
 * }
 *
 * // ❌ STILL WRONG - Even with useMemo/useState
 * function MyComponent() {
 *   const id = useMemo(() => uuid(), []); // Still different on server vs client!
 *   return <div id={id}>...</div>;
 * }
 *
 * // ✅ CORRECT - Use React's useId() instead
 * import { useId } from 'react';
 * import type { UniqueId } from '@accelint/core';
 *
 * function MyComponent() {
 *   const id = useId() as UniqueId;
 *   return <div id={id}>...</div>;
 * }
 * ```
 */
export function uuid() {
  return v4() as UniqueId;
}

const validator = z.uuid();

/**
 * Checks if a value is a valid UUID.
 *
 * @param value - The value to validate.
 * @returns true if the value is a valid UUID, false otherwise.
 *
 * @example
 * ```typescript
 * import { isUUID } from '@accelint/core';
 *
 * isUUID('550e8400-e29b-41d4-a716-446655440000');
 * // true
 *
 * isUUID('not-a-uuid');
 * // false
 * ```
 */
export function isUUID(value: unknown): value is UniqueId {
  return validator.safeParse(value).success;
}
