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

export const Screenshot = ({ className, ref, ...props }: IconProps) => (
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
      d='M4.5 4.50001H9V3.00001L4.5 3.00001C4.5 3.00001 3 3.00001 3 4.50001L3 9.00001H4.5V4.50001Z'
      fill='currentColor'
    />
    <path
      d='M19.5 9.00001V4.50001L15 4.50001V3.00001L19.5 3.00001C21 3.00001 21 4.50001 21 4.50001V9.00001L19.5 9.00001Z'
      fill='currentColor'
    />
    <path
      d='M4.5 15L4.5 19.5H7L7 21H4.5C3 21 3 19.5 3 19.5L3 15H4.5Z'
      fill='currentColor'
    />
    <path
      d='M17 17C17 17.8284 16.3284 18.5 15.5 18.5C14.6716 18.5 14 17.8284 14 17C14 16.1716 14.6716 15.5 15.5 15.5C16.3284 15.5 17 16.1716 17 17Z'
      fill='currentColor'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M14 11H17L18.5 12.5C18.7928 12.5005 19.5 12.5 19.5 12.5C20.5 12.5 21 13 21 14C21 15 21 18 21 18C21 18 21 18.5 21 20C21 21.5 19.5 21.5 19.5 21.5H11.5001C10.5001 21.5 10 21 10 20L10 14C10 13 10.5 12.5 11.5 12.4993L12.5 12.5L14 11ZM18 14L16.5 12.5H14.5L13 14C12.655 14 11.5 14 11.5 14V20H19.5V14C18.8333 14.0006 18.6667 14 18 14Z'
      fill='currentColor'
    />
  </svg>
);
