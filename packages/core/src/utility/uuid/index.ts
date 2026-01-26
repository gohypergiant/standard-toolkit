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
 * @returns A unique identifier string.
 *
 * @example
 * import { uuid } from '@accelint/core';
 *
 * const id = uuid();
 * // '550e8400-e29b-41d4-a716-446655440000'
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
 * import { isUUID } from '@accelint/core';
 *
 * isUUID('550e8400-e29b-41d4-a716-446655440000');
 * // true
 *
 * isUUID('not-a-uuid');
 * // false
 */
export function isUUID(value: unknown): value is UniqueId {
  return validator.safeParse(value).success;
}
