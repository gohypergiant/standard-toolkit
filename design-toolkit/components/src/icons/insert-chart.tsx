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

export const InsertChart = ({ className, ref, ...props }: IconProps) => (
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
      d='M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 17C7.45 17 7 17 7 17V10C7 10 7.45 10 8 10C8.55 10 9 10 9 10V17C9 17 8.55 17 8 17ZM12 17C11.45 17 11 17 11 17V7C11 7 11.45 7 12 7C12.55 7 13 7 13 7V17C13 17 12.55 17 12 17ZM16 17C15.45 17 15 17 15 17V13C15 13 15.45 13 16 13C16.55 13 17 13 17 13V17C17 17 16.55 17 16 17Z'
      fill='currentColor'
    />
  </svg>
);
