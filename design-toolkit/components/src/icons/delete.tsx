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

export const Delete = ({ className, ref, ...props }: IconProps) => (
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
      d='M7.00011 4.5C7.00011 4.5 7 3 8.5 3H15.5C17.0001 3 17.0001 4.5 17.0001 4.5V7H19.0001C19.2388 7 19.0001 7 20.0001 7V8.5H19.0001L18 19.5C17.9325 20.5082 17.5 21 16.5 21H8C6.5 21 6.17675 20.461 6.00011 19L5 8.5H4L4.00011 7C5.00011 7 4.76141 7 5.00011 7H7.00011V4.5ZM8.5 7H15.5V4.5H8.5V7ZM6.5 8.5L7.5 19.5H16.5L17.5 8.5H6.5ZM10.9999 11V17H9.49989V11H10.9999Z'
      fill='currentColor'
    />
    <path
      d='M14.5001 17L14.5002 11H13.0001L13 17H14.5001Z'
      fill='currentColor'
    />
  </svg>
);
