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

import { tv } from 'tailwind-variants';

export const ClassificationBadgeStylesDefaults = {
  variant: 'missing',
  size: 'medium',
} as const;

export const ClassificationBadgeStyles = tv({
  base: 'inline-flex items-center justify-center rounded-full px-s py-xs uppercase',
  variants: {
    variant: {
      // TODO: dont hard code these strings into the styles
      missing:
        "fg-critical bg-classification-missing [&:empty]:before:content-['Missing']",
      unclassified:
        "fg-default-light bg-classification-unclass [&:empty]:before:content-['Unclassified']",
      cui: "fg-default-light bg-classification-cui [&:empty]:before:content-['CUI']",
      confidential:
        "fg-default-light bg-classification-confidential [&:empty]:before:content-['Confidential']",
      secret:
        "fg-default-light bg-classification-secret [&:empty]:before:content-['Secret']",
      'top-secret':
        "fg-inverse-light bg-classification-top-secret [&:empty]:before:content-['Top_Secret']",
      'ts-sci':
        "fg-inverse-light bg-classification-ts-sci [&:empty]:before:content-['TS/SCI']",
    },
    size: {
      small: 'text-header-xs',
      medium: 'text-header-s',
    },
  },
  defaultVariants: ClassificationBadgeStylesDefaults,
});
