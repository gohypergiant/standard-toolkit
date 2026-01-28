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

/**
 * NTDS standard color for assumed friend entities.
 *
 * This green color (#0E8F37) indicates units that are likely friendly based on
 * available intelligence but not definitively confirmed.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_ASSUMED_FRIEND } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_ASSUMED_FRIEND; // '#0E8F37'
 * ```
 */
export const NTDS_COLOR_ASSUMED_FRIEND = '#0E8F37';

/**
 * NTDS standard color for friendly entities.
 *
 * This blue color (#1484F4) indicates units that are confirmed as friendly forces.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_FRIEND } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_FRIEND; // '#1484F4'
 * ```
 */
export const NTDS_COLOR_FRIEND = '#1484F4';

/**
 * NTDS standard color for hostile entities.
 *
 * This red color (#FF0033) indicates units that are confirmed as hostile or enemy forces.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_HOSTILE } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_HOSTILE; // '#FF0033'
 * ```
 */
export const NTDS_COLOR_HOSTILE = '#FF0033';

/**
 * NTDS standard color for neutral entities.
 *
 * This purple color (#5B137A) indicates units that are confirmed as neutral, neither
 * friendly nor hostile.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_NEUTRAL } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_NEUTRAL; // '#5B137A'
 * ```
 */
export const NTDS_COLOR_NEUTRAL = '#5B137A';

/**
 * NTDS standard color for pending entities.
 *
 * This dark gray color (#404040) indicates units whose status is pending classification
 * or awaiting further information.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_PENDING } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_PENDING; // '#404040'
 * ```
 */
export const NTDS_COLOR_PENDING = '#404040';

/**
 * NTDS standard color for suspect entities.
 *
 * This orange color (#FFAD38) indicates units that are suspected to be hostile but not
 * yet confirmed.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_SUSPECT } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_SUSPECT; // '#FFAD38'
 * ```
 */
export const NTDS_COLOR_SUSPECT = '#FFAD38';

/**
 * NTDS standard color for unknown entities.
 *
 * This yellow color (#EDDA0A) indicates units whose affiliation or status is completely
 * unknown.
 *
 * @example
 * ```typescript
 * import { NTDS_COLOR_UNKNOWN } from '@accelint/ntds/constants';
 *
 * const iconColor = NTDS_COLOR_UNKNOWN; // '#EDDA0A'
 * ```
 */
export const NTDS_COLOR_UNKNOWN = '#EDDA0A';
