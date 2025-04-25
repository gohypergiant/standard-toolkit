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

export const CollapseWindow = ({ className, ref, ...props }: IconProps) => (
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
      d='M5.12598 12V4.5H20.126V18.5H11.626V20H20.126C20.126 20 21.626 20 21.626 18.5V4.5C21.626 4.5 21.626 3 20.126 3H5.12598C5.12598 3 3.62598 3 3.62598 4.5V12H5.12598Z'
      fill='currentColor'
    />
    <path
      d='M9.62598 17C9.62598 15.34 8.28598 14 6.62598 14C4.96598 14 3.62598 15.34 3.62598 17C3.62598 18.66 4.96598 20 6.62598 20C8.28598 20 9.62598 18.66 9.62598 17Z'
      fill='currentColor'
    />
    <path
      d='M9.62598 14H15.4594L13.626 12L16.626 9L14.626 7L11.626 10L9.62598 8.16667V14Z'
      fill='currentColor'
    />
  </svg>
);
