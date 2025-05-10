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

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import type { ReactNode } from 'react';

const classificationBanner = cva(
  'flex select-none items-center justify-center font-medium text-header-m uppercase',
  {
    variants: {
      variant: {
        missing:
          "fg-critical bg-classification-missing [&:empty]:before:content-['Missing_Classification']",
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
          "fg-inverse-light bg-classification-ts-sci [&:empty]:before:content-['Top_Secret//SCI']",
      },
    },
    defaultVariants: {
      variant: 'missing',
    },
  },
);

export interface ClassificationBannerProps
  extends VariantProps<typeof classificationBanner> {
  className?: string;
  /** If no text is provided, the system will fallback to safe defaults. You can override the text with children. */
  children?: ReactNode;
}

export const ClassificationBanner = ({
  className,
  variant = 'missing',
  ...props
}: ClassificationBannerProps) => (
  <span
    className={cn(
      classificationBanner({
        variant,
        className,
      }),
    )}
    {...props}
  />
);
ClassificationBanner.displayName = 'ClassificationBanner';
ClassificationBanner.as = (
  props: VariantProps<typeof classificationBanner>,
  className?: string | string[],
) => cn(classificationBanner({ ...props, className }));
