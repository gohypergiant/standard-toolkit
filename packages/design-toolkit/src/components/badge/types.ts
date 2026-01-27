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

import type { Axis } from '@react-types/overlays';
import type { ComponentPropsWithRef } from 'react';

/**
 * Props for the Badge component.
 *
 * Extends span props with color, positioning, and offset options.
 */
export type BadgeProps = ComponentPropsWithRef<'span'> & {
  /** Badge content. Empty renders as a dot indicator. */
  children?: boolean | null | number | string;
  /** Semantic color variant for the badge. */
  color?: 'info' | 'advisory' | 'normal' | 'serious' | 'critical';
  /** Offset from the positioned edge in pixels. */
  offset?: number | { x?: number; y?: number };
  /** Position of the badge relative to its container. */
  placement?: Axis | `${'top' | 'bottom'} ${'left' | 'right'}`;
};
