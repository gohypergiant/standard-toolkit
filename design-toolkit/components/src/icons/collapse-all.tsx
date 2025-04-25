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

export const CollapseAll = ({ className, ref, ...props }: IconProps) => (
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
      d='M12 8.16885L6.83112 3L5.53895 4.29221L10.7078 9.46109C11.9999 10.7532 13.2921 9.46101 13.2921 9.46101L18.4611 4.29205L17.1688 3L12 8.16885Z'
      fill='currentColor'
    />
    <path
      d='M12 15.8312L17.1689 21L18.461 19.7078L13.2922 14.5389C12.0001 13.2468 10.7079 14.539 10.7079 14.539L5.53891 19.7079L6.83113 21L12 15.8312Z'
      fill='currentColor'
    />
  </svg>
);
