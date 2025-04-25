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

export const LockOutline = ({ className, ref, ...props }: IconProps) => (
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
      d='M19.5 8H17C17 2 12 2 12 2C12 2 7 2 7 8H4.5C4.5 8 3 8 3 9.5V19.5C3 19.5 3 21 4.5 21H19.5C21 21 21 19.5 21 19.5V9.5C21 8 19.5 8 19.5 8ZM12 3.5C12 3.5 15.5 3.5 15.5 8H8.5C8.5 3.5 12 3.5 12 3.5ZM19.5 19.3989L4.5 19.5V9.5H19.5V19.3989Z'
      fill='currentColor'
    />
    <path
      d='M14 14.5C14 16.5 12 16.5 12 16.5C12 16.5 10 16.5 10 14.5C10 12.5 12 12.5 12 12.5C12 12.5 14 12.5 14 14.5Z'
      fill='currentColor'
    />
  </svg>
);
