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

import { getSafeEnumValues, type SafeEnum } from '@accelint/core';

/** Sort direction options for table columns. */
export const SortDirection = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
} as const);

/** Special header column action types. */
export const HeaderColumnAction = Object.freeze({
  NUMERAL: 'numeral',
  KEBAB: 'kebab',
  SELECTION: 'selection',
} as const);

/** Type representing a valid sort direction value. */
export type SortDirectionState = SafeEnum<typeof SortDirection>;

/** Array of valid sort direction values. */
export const sortDirectionValues = getSafeEnumValues(SortDirection);

/** Type representing a valid header column action key. */
export type HeaderColumnActionKey = SafeEnum<typeof HeaderColumnAction>;

/** Array of valid header column action values. */
export const headerColumnActionValues = getSafeEnumValues(HeaderColumnAction);
