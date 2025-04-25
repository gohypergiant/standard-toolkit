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

export const RectangleSelect = ({ className, ref, ...props }: IconProps) => (
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
      d='M2 7.33333V5H4.22222V7H4V7.33333H2ZM10.8889 5H6.44444V7H10.8889V5ZM13.1111 5V7H17.5556V5H13.1111ZM19.7778 5V7H20V7.33333H22V5H19.7778ZM22 9.66667H20V14.3333H22V9.66667ZM22 16.6667H20V17H19.7778V19H22V16.6667ZM17.5556 19V17H13.1111V19H17.5556ZM10.8889 19V17H6.44444V19H10.8889ZM4.22222 19V17H4V16.6667H2V19H4.22222ZM2 14.3333H4V9.66667H2V14.3333Z'
      fill='currentColor'
    />
  </svg>
);
