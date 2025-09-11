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
 * Standard size variants used across the design system
 * These represent the common sizing scales from most compact to most spacious
 */
export const SIZE_VARIANTS = Object.freeze({
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const);

export type SizeVariant = (typeof SIZE_VARIANTS)[keyof typeof SIZE_VARIANTS];

/**
 * Common size ranges for different component types
 */
export const SIZE_RANGES = Object.freeze({
  /** Full size range for components that support all sizes (Button, Icon) */
  FULL: [
    SIZE_VARIANTS.xsmall,
    SIZE_VARIANTS.small,
    SIZE_VARIANTS.medium,
    SIZE_VARIANTS.large,
  ],

  /** Compact range for form fields and dense interfaces */
  COMPACT: [SIZE_VARIANTS.small, SIZE_VARIANTS.medium],

  /** Standard range for most components */
  STANDARD: [SIZE_VARIANTS.small, SIZE_VARIANTS.medium, SIZE_VARIANTS.large],

  /** Binary range for components with simple size toggle */
  BINARY: [SIZE_VARIANTS.small, SIZE_VARIANTS.large],
} as const);

/**
 * Size ordering from smallest to largest
 */
const ORDER = [
  SIZE_VARIANTS.xsmall,
  SIZE_VARIANTS.small,
  SIZE_VARIANTS.medium,
  SIZE_VARIANTS.large,
] as const;
