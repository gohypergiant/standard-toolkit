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

export const Duplicate = ({ className, ref, ...props }: IconProps) => (
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
      d='M3 10L3 19.25C3 20.35 3.65 21 4.75 21L16 21L16 19.5L4.5 19.5L4.5 10L3 10ZM6 4.75L6 16.25C6 17.35 6.65 18 7.75 18L19.25 18C20.35 18 21 17.35 21 16.25L21 4.75C21 3.65 20.35 3 19.25 3L7.75 3C6.65 3 6 3.65 6 4.75ZM19.5 4.5L19.5 16.5L7.5 16.5L7.5 4.5L19.5 4.5Z'
      fill='currentColor'
    />
    <path
      d='M17.5 9.5L17.5 11.5L14.5 11.5L14.5 14.5L12.5 14.5L12.5 11.5L9.5 11.5L9.5 9.5L12.5 9.5L12.5 6.5L14.5 6.5L14.5 9.5L17.5 9.5Z'
      fill='currentColor'
    />
  </svg>
);
