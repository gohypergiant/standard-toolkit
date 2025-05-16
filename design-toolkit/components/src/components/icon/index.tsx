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

const iconStyles = cva(
  'inline-block [color:var(--icon-color,currentColor)] [height:var(--icon-size)] [width:var(--icon-size)]',
  {
    variants: {
      size: {
        large: 'h-[var(--icon-size,24px)] w-[var(--icon-size,24px)]',
        medium: 'h-[var(--icon-size,20px)] w-[var(--icon-size,20px)]',
        small: 'h-[var(--icon-size,16px)] w-[var(--icon-size,16px)]',
        xsmall: 'h-[var(--icon-size,12px)] w-[var(--icon-size,12px)]',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

export interface IconProps extends VariantProps<typeof iconStyles> {
  className?: string;
  children: ReactNode;
}

export const Icon = ({ children, className, size, ...rest }: IconProps) => {
  return (
    <span
      className={cn(
        iconStyles({
          size,
        }),
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};
Icon.displayName = 'Icon';
Icon.as = (
  props: VariantProps<typeof iconStyles>,
  className?: string | string[],
) => cn(iconStyles({ ...props, className }));
