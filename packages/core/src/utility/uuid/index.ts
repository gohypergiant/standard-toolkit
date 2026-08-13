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

import { v4, v5, validate } from 'uuid';
import type { Tagged } from 'type-fest';

export type UniqueId = Tagged<string, 'UUID'>;

export type UniqueIdOptions = {
  namespace?: UniqueId;
  path: (number | string)[];
};

/**
 * Generates a new UUID
 *
 * @returns A unique identifier string.
 *
 * @example
 * ```typescript
 * import { uuid } from '@accelint/core';
 *
 * // To create a new uuid, use:
 * const dynamicId = uuid();
 *
 * // To create a stable static uuid, use:
 * const stableId = uuid({ path: ['foo', 'bar'] });
 *
 * // To create a stable dynamic uuid, use:
 * const stableDynamicId = uuid({ path: ['foo', entity.id] }); // Will always result in the same id, if the input is the same
 *
 * // To establish a namespace, create a static const or use the `stableId` example to create a uuid
 * const namespace = '550e8400-e29b-41d4-a716-446655440000'; // Completely static
 * // OR
 * const namespace = uuid({ path: ['my', 'app']}); // Created at runtime, but stable
 *
 * // These will be equal because all inputs match
 * uuid({ path: ['foo', 'bar'] }) === uuid({ path: ['foo', 'bar'] });
 *
 * uuid({ namespace, path: ['foo', 'bar'] }) === uuid({ namespace, path: ['foo', 'bar'] });
 *
 * // These will not be equal, even though their path's match
 * uuid({
 *   namespace: '550e8400-e29b-41d4-a716-446655440000',
 *   path: ['foo', 'bar']
 * })
 *
 * uuid({
 *   namespace: uuid({ path: ['my', 'app']}),
 *   path: ['foo', 'bar']
 * })
 * ```
 */
export function uuid(
  { namespace = v5.URL as UniqueId, path = [] }: UniqueIdOptions = { path: [] },
) {
  return (path.length ? v5(path.join('::'), namespace) : v4()) as UniqueId;
}

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
  return validate(value);
}
