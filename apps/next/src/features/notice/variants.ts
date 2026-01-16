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

import { uuid } from '@accelint/core';
import type {
  NoticeColor,
  NoticeProps,
} from '@accelint/design-toolkit/components/notice/types';

export type NoticeVariant = Pick<
  NoticeProps,
  'color' | 'size' | 'id' | 'primary' | 'secondary' | 'showClose'
>;

export const COLORS: NoticeColor[] = [
  'info',
  'advisory',
  'normal',
  'serious',
  'critical',
];

function createVariantsForColor(color: NoticeColor): NoticeVariant[] {
  return [
    // Small variants
    { color, size: 'small', id: uuid() },
    { color, size: 'small', id: uuid(), showClose: true },
    // Medium variants
    { color, size: 'medium', id: uuid() },
    {
      color,
      size: 'medium',
      id: uuid(),
      primary: { children: 'Action' },
      secondary: { children: 'Cancel' },
    },
    { color, size: 'medium', id: uuid(), showClose: true },
  ];
}

export const VARIANTS_BY_COLOR: Record<NoticeColor, NoticeVariant[]> =
  Object.fromEntries(
    COLORS.map((color) => [color, createVariantsForColor(color)]),
  ) as Record<NoticeColor, NoticeVariant[]>;

export const SMALL_VARIANTS: NoticeVariant[] = Object.values(
  VARIANTS_BY_COLOR,
).flatMap((variants) => variants.filter((v) => v.size === 'small'));

export const MEDIUM_VARIANTS: NoticeVariant[] = Object.values(
  VARIANTS_BY_COLOR,
).flatMap((variants) => variants.filter((v) => v.size === 'medium'));
