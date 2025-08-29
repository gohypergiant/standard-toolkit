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

export const ClassificationBannerStylesDefaults = {
  variant: 'missing',
} as const;

export const ClassificationBannerStyles = tv({
  base: 'flex select-none items-center justify-center font-medium text-header-m uppercase',
  variants: {
    variant: {
      // TODO: dont hard code these strings into the styles
      missing:
        "fg-critical-bold bg-classification-missing [&:empty]:before:content-['Missing']",
      unclassified:
        "fg-a11y-on-utility bg-classification-unclass [&:empty]:before:content-['Unclassified']",
      cui: "fg-a11y-on-utility bg-classification-cui [&:empty]:before:content-['CUI']",
      confidential:
        "fg-a11y-on-utility bg-classification-confidential [&:empty]:before:content-['Confidential']",
      secret:
        "fg-a11y-on-utility bg-classification-secret [&:empty]:before:content-['Secret']",
      'top-secret':
        "fg-inverse-bold light:fg-primary-bold bg-classification-top-secret [&:empty]:before:content-['Top_Secret']",
      'ts-sci':
        "fg-inverse-bold light:fg-primary-bold bg-classification-ts-sci [&:empty]:before:content-['Top_Secret/SCI']",
    },
  },
  defaultVariants: ClassificationBannerStylesDefaults,
});
