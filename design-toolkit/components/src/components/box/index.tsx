import { cx } from 'cva';
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
import type React from 'react';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** When true, apply flex display */
  flex?: boolean;
  /** Flex direction: 'row' or 'col' */
  direction?: 'row' | 'col';
  /** Horizontal alignment in flex container */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Vertical alignment in flex container */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Gap between children (matches Tailwind's spacing scale) */
  gap?: number;
}

export const Box = ({
  as: Component = 'div',
  className,
  flex,
  direction = 'row',
  justify,
  align,
  gap,
  children,
  ...rest
}: BoxProps) => {
  const classes = cx(
    flex && 'flex',
    flex && (direction === 'col' ? 'flex-col' : 'flex-row'),
    justify &&
      {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      }[justify],
    align &&
      {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      }[align],
    gap !== undefined && `gap-${gap}`,
    className,
  );

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};
