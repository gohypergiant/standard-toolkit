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

export const LockFill = ({ className, ref, ...props }: IconProps) => (
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
      fillRule='evenodd'
      clipRule='evenodd'
      d='M17 8H19.5C19.5 8 21 8 21 9.5V19.5C21 19.5 21 21 19.5 21H4.5C3 21 3 19.5 3 19.5V9.5C3 8 4.5 8 4.5 8H7C7 2 12 2 12 2C12 2 17 2 17 8ZM15.5 8C15.5 3.5 12 3.5 12 3.5C12 3.5 8.5 3.5 8.5 8H15.5ZM12 16.375C12 16.375 14 16.375 14 14.375C14 12.375 12 12.375 12 12.375C12 12.375 10 12.375 10 14.375C10 16.375 12 16.375 12 16.375Z'
      fill='currentColor'
    />
  </svg>
);
