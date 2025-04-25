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

export const DragVert = ({ className, ref, ...props }: IconProps) => (
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
      d='M11 19C11 20.1 10.1 21 9 21C7.9 21 7 20.1 7 19C7 17.9 7.9 17 9 17C10.1 17 11 17.9 11 19ZM9 10C7.9 10 7 10.9 7 12C7 13.1 7.9 14 9 14C10.1 14 11 13.1 11 12C11 10.9 10.1 10 9 10ZM9 3C7.9 3 7 3.9 7 5C7 6.1 7.9 7 9 7C10.1 7 11 6.1 11 5C11 3.9 10.1 3 9 3ZM15 7C16.1 7 17 6.1 17 5C17 3.9 16.1 3 15 3C13.9 3 13 3.9 13 5C13 6.1 13.9 7 15 7ZM15 10C13.9 10 13 10.9 13 12C13 13.1 13.9 14 15 14C16.1 14 17 13.1 17 12C17 10.9 16.1 10 15 10ZM15 17C13.9 17 13 17.9 13 19C13 20.1 13.9 21 15 21C16.1 21 17 20.1 17 19C17 17.9 16.1 17 15 17Z'
      fill='currentColor'
    />
  </svg>
);
