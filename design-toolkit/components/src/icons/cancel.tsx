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

export const Cancel = ({ className, ref, ...props }: IconProps) => (
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
      d='M18.3641 16.9498C17.657 16.2427 13.4143 12.0001 13.4143 12.0001C13.4143 12.0001 17.6569 7.75749 18.364 7.05038L16.9499 5.63609C16.2428 6.3432 12.0001 10.5859 12.0001 10.5859C12.0001 10.5859 7.75743 6.34312 7.05032 5.63602L5.63611 7.05038C6.34322 7.75749 10.5859 12.0001 10.5859 12.0001C10.5859 12.0001 6.34329 16.2427 5.63619 16.9498L7.0504 18.364C7.75751 17.6569 12.0001 13.4143 12.0001 13.4143C12.0001 13.4143 16.2427 17.657 16.9498 18.3641L18.3641 16.9498Z'
      fill='currentColor'
    />
  </svg>
);
