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

export const PopBackIn = ({ className, ref, ...props }: IconProps) => (
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
      d='M17.5 13V5.5H5.5V17.5H13V19H5.5C4 19 4 17.5 4 17.5V5.5C4 4 5.5 4 5.5 4H17.5C19 4 19 5.5 19 5.5V13H17.5Z'
      fill='currentColor'
    />
    <path
      d='M17.5 19.0001C17.1389 19.0001 15.3373 19.0092 15 19V17.5C15.5 17.4991 16.8642 17.5 17.5 17.5C17.5 17.1448 17.4921 15.3369 17.5 15H19C19 15.5 19 16.8147 19 17.5C19.3317 17.5 21.1685 17.4911 21.5 17.5V19C21.1732 19.0071 19.3428 19.0001 19.0001 19.0001C18.9782 19.3243 19.0042 21.1668 19 21.5H17.5C17.4987 21.1882 17.5 19.3349 17.5 19.0001Z'
      fill='currentColor'
    />
  </svg>
);
