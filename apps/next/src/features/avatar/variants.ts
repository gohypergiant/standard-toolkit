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

import type { AvatarProps } from '@accelint/design-toolkit/components/avatar/types';

export type AvatarVariant = Pick<AvatarProps, 'size' | 'imageProps'> & {
  hasBadge?: boolean;
  hasLabel?: boolean;
  hasFallback?: boolean;
};

export const PROP_COMBOS: AvatarVariant[] = [
  {
    size: 'small',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
  },
  {
    size: 'medium',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
  },
  {
    size: 'small',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    hasBadge: true,
  },
  {
    size: 'medium',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    hasBadge: true,
  },
  {
    size: 'small',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    hasLabel: true,
  },
  {
    size: 'medium',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    hasLabel: true,
  },
  {
    size: 'small',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
  },
  {
    size: 'medium',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
  },
  {
    size: 'small',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
    hasFallback: true,
  },
  {
    size: 'medium',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
    hasFallback: true,
  },
];
