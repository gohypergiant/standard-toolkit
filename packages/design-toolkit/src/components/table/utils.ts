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

import type { DensityVariant } from '@/lib/types';
import type { MenuProps } from '../menu/types';

/**
 * Clamps a table density to the subset the Menu accepts, so the row actions
 * and header cell kebab menus can inherit the table's `variant`. Menu has no
 * `crammed` density, so `crammed` maps to `compact`; the others pass through.
 *
 * @remarks pure function
 *
 * @param variant - The table density from `TableContext`.
 * @returns The matching Menu density (`cozy` or `compact`).
 *
 * @example
 * ```ts
 * toMenuVariant('crammed'); // 'compact'
 * toMenuVariant('cozy'); // 'cozy'
 * ```
 */
export function toMenuVariant(
  variant: DensityVariant,
): NonNullable<MenuProps<object>['variant']> {
  return variant === 'crammed' ? 'compact' : variant;
}
