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

import { type VariantProps, cva } from 'cva';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

const classificationBanner = cva(
  'flex items-center justify-center text-header-m font-medium uppercase select-none',
  {
    variants: {
      variant: {
        missing:
          "bg-classification-missing text-critical [&:empty]:before:content-['Missing_Classification']",
        unclassified:
          "bg-classification-unclass text-default-light [&:empty]:before:content-['Unclassified']",
        cui: "bg-classification-cui text-default-light [&:empty]:before:content-['CUI']",
        confidential:
          "bg-classification-confidential text-default-light [&:empty]:before:content-['Confidential']",
        secret:
          "bg-classification-secret text-default-light [&:empty]:before:content-['Secret']",
        'top-secret':
          "bg-classification-top-secret text-inverse-light [&:empty]:before:content-['Top_Secret']",
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
  children?: ReactNode;
}

const ClassificationBanner = ({
  className,
  variant,
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

export { ClassificationBanner };
