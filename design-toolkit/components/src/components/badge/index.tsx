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
import type React from 'react';

const badgeStyles = cva(
  cn([
    'fg-default-light inline-flex h-l min-w-l items-center justify-center rounded-full border px-xs text-body-xs empty:size-s empty:min-w-none empty:px-none',
    '[inset:var(--badge-inset,initial)] [position:var(--badge-position,initial)] empty:[inset:var(--badge-empty-inset,initial)]',
  ]),
  {
    variants: {
      variant: {
        advisory: 'border-advisory-bold bg-advisory-subtle',
        critical: 'border-critical bg-critical-subtle',
        serious: 'border-serious bg-serious-subtle',
        normal: 'border-normal bg-normal-subtle',
        info: 'border-info-bold bg-info-subtle',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export interface BadgeProps
  extends VariantProps<typeof badgeStyles>,
    React.HTMLProps<HTMLSpanElement> {
  className?: string;
}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span
    className={cn(
      badgeStyles({
        variant,
        className,
      }),
    )}
    {...props}
  />
);
Badge.displayName = 'Badge';
Badge.as = (
  props: VariantProps<typeof badgeStyles>,
  className?: string | string[],
) => cn(badgeStyles({ ...props, className }));
