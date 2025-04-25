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

export const Filter = ({ className, ref, ...props }: IconProps) => (
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
    <path d='M17 5.75H21V7.25H17V5.75Z' fill='currentColor' />
    <path d='M3 5.75H11V7.25H3V5.75Z' fill='currentColor' />
    <path d='M3 17.75H9V19.25H3V17.75Z' fill='currentColor' />
    <path d='M3 11.75H5V13.25H3V11.75Z' fill='currentColor' />
    <path d='M11 11.75H21V13.25H11V11.75Z' fill='currentColor' />
    <path d='M15 17.75H21V19.25H15V17.75Z' fill='currentColor' />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M15.5 7.5C16.0523 7.5 16.5 7.05228 16.5 6.5C16.5 5.94772 16.0523 5.5 15.5 5.5C14.9477 5.5 14.5 5.94772 14.5 6.5C14.5 7.05228 14.9477 7.5 15.5 7.5ZM15.5 9C16.8807 9 18 7.88071 18 6.5C18 5.11929 16.8807 4 15.5 4C14.1193 4 13 5.11929 13 6.5C13 7.88071 14.1193 9 15.5 9Z'
      fill='currentColor'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M9.5 13.5C10.0523 13.5 10.5 13.0523 10.5 12.5C10.5 11.9477 10.0523 11.5 9.5 11.5C8.94772 11.5 8.5 11.9477 8.5 12.5C8.5 13.0523 8.94772 13.5 9.5 13.5ZM9.5 15C10.8807 15 12 13.8807 12 12.5C12 11.1193 10.8807 10 9.5 10C8.11929 10 7 11.1193 7 12.5C7 13.8807 8.11929 15 9.5 15Z'
      fill='currentColor'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M13.5 19.5C14.0523 19.5 14.5 19.0523 14.5 18.5C14.5 17.9477 14.0523 17.5 13.5 17.5C12.9477 17.5 12.5 17.9477 12.5 18.5C12.5 19.0523 12.9477 19.5 13.5 19.5ZM13.5 21C14.8807 21 16 19.8807 16 18.5C16 17.1193 14.8807 16 13.5 16C12.1193 16 11 17.1193 11 18.5C11 19.8807 12.1193 21 13.5 21Z'
      fill='currentColor'
    />
  </svg>
);
