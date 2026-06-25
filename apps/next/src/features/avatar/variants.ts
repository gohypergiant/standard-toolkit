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

import type { AvatarProps } from '@accelint/design-toolkit/components/avatar/types';

export type AvatarVariant = Pick<AvatarProps, 'size' | 'imageProps'> & {
  hasBadge?: boolean;
  hasLabel?: boolean;
  hasFallback?: boolean;
};

const VALID_IMAGE = './woof.jpg';

const BROKEN_IMAGE =
  // Invalid data URI — fails synchronously, Radix Avatar shows fallback immediately
  'data:image/png;base64,invalid';

export const PROP_COMBOS: AvatarVariant[] = [
  {
    size: 'small',
    imageProps: { alt: 'User avatar', src: VALID_IMAGE },
  },
  {
    size: 'medium',
    imageProps: { alt: 'User avatar', src: VALID_IMAGE },
  },
  {
    size: 'small',
    imageProps: { alt: 'User avatar', src: VALID_IMAGE },
    hasBadge: true,
  },
  {
    size: 'medium',
    imageProps: { alt: 'User avatar', src: VALID_IMAGE },
    hasBadge: true,
  },
  {
    size: 'small',
    imageProps: { alt: 'User avatar', src: VALID_IMAGE },
    hasLabel: true,
  },
  {
    size: 'medium',
    imageProps: { alt: 'User avatar', src: VALID_IMAGE },
    hasLabel: true,
  },
  {
    size: 'small',
    imageProps: { alt: 'User icon', src: BROKEN_IMAGE },
  },
  {
    size: 'medium',
    imageProps: { alt: 'User icon', src: BROKEN_IMAGE },
  },
  {
    size: 'small',
    imageProps: { alt: 'User icon', src: BROKEN_IMAGE },
    hasFallback: true,
  },
  {
    size: 'medium',
    imageProps: { alt: 'User icon', src: BROKEN_IMAGE },
    hasFallback: true,
  },
];
