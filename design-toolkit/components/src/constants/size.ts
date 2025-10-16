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

export type SizeRangeBinary = (typeof SIZE_RANGE.BINARY)[number];
export type SizeRangeCompact = (typeof SIZE_RANGE.COMPACT)[number];
export type SizeRangeFull = (typeof SIZE_RANGE.FULL)[number];
export type SizeRangeStandard = (typeof SIZE_RANGE.STANDARD)[number];

export type SizeVariantKey = keyof typeof SIZE;
export type SizeVariant = (typeof SIZE)[SizeVariantKey];

export const SIZE = Object.freeze({
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const);

/**
 * Common size ranges for different component types
 */
export const SIZE_RANGE = Object.freeze({
  /** Binary range for components with simple size toggle */
  BINARY: Object.freeze([SIZE.SMALL, SIZE.LARGE]),

  /** Compact range for form fields and dense interfaces */
  COMPACT: Object.freeze([SIZE.SMALL, SIZE.MEDIUM]),

  /** Full size range for components that support all sizes (Button, Icon) */
  FULL: Object.freeze([SIZE.XSMALL, SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE]),

  /** Standard range for most components */
  STANDARD: Object.freeze([SIZE.SMALL, SIZE.MEDIUM, SIZE.LARGE]),
} as const);
