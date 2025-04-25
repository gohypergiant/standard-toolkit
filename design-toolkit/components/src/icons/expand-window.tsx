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

export const ExpandWindow = ({ className, ref, ...props }: IconProps) => (
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
      d='M4.5 12V4.5H19.5V18.5H11V20H19.5977C19.5977 20 21 19.49 21 18.5V4.5C21 4.5 21 3 19.5 3H4.5C4.5 3 3 3 3 4.5V12H4.5Z'
      fill='currentColor'
    />
    <path
      d='M9 17C9 15.34 7.66 14 6 14C4.34 14 3 15.34 3 17C3 18.66 4.34 20 6 20C7.66 20 9 18.66 9 17Z'
      fill='currentColor'
    />
    <path
      d='M15.5 8H9.5L11.5 10L8.5 13L10.5 15L13.5 12L15.5 13.8333V8Z'
      fill='currentColor'
    />
  </svg>
);
