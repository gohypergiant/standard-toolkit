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

export const AddToList = ({ className, ref, ...props }: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={cn(
      '[height:var(--icon-size,--spacing-xl)] [width:var(--icon-size,--spacing-xl)] [color:var(--icon-color,currentColor)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <path
      d='M16 20.975V17.975H13V15.975H16V12.975H18V15.975H21V17.975H18V20.975H16ZM3 18V16H5V18H3ZM7 18V16H11.075C11.025 16.35 11.0042 16.6833 11.0125 17C11.0208 17.3167 11.05 17.65 11.1 18H7ZM3 14V12H5V14H3ZM7 14V12H13.65C13.2667 12.2667 12.9208 12.5667 12.6125 12.9C12.3042 13.2333 12.0333 13.6 11.8 14H7ZM3 10V8H5V10H3ZM7 10V8H19V10H7ZM3 6V4H5V6H3ZM7 6V4H19V6H7Z'
      fill='currentColor'
    />
  </svg>
);
