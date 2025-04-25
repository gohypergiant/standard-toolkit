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

import { cn } from '../lib/utils';
import type { IconProps } from './types';

export const ArrangeTable = ({ className, ref, ...props }: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={cn(
      '[color:var(--icon-color,currentColor)] [height:var(--icon-size,--spacing-xl)] [width:var(--icon-size,--spacing-xl)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <path
      d='M4 19V5C4 5 4 5 5 5H7C8 5 8 5 8 5C7.99215 9.16974 8 19 8 19H4Z'
      fill='currentColor'
    />
    <path
      d='M10 19V5C10 5 10 5 11 5H13C14 5 14 5 14 5C13.9921 9.16974 14 19 14 19H10Z'
      fill='currentColor'
    />
    <path
      d='M16 19V5C16 5 16 5 17 5H19C20 5 20 5 20 5C19.9921 9.16974 20 19 20 19H16Z'
      fill='currentColor'
    />
  </svg>
);
