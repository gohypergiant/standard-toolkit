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

export const PopOut = ({ className, ref, ...props }: IconProps) => (
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
      d='M16 3C16 3 10 3 8.5 3C7 3 7 4.5 7 4.5C7 4.5 7 14 7 15.5C7 17 8.5 17 8.5 17H19.5C19.5 17 21 17 21 15.5C21 14 21 4.5 21 4.5C21 4.5 21 3 19.5 3C18 3 16 3 16 3V4.5H19.5V15.5H8.5V4.5H16V3Z'
      fill='currentColor'
    />
    <path
      d='M7 7H4.50011C3 7 3 8.5 3 8.5V19.5C3 21 4.5 21 4.5 21H15.5C15.5 21 17 21 17 19.5V17H15.5V19.5H4.5V8.5H7V7Z'
      fill='currentColor'
    />
  </svg>
);
