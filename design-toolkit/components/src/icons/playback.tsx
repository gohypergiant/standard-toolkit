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

export const Playback = ({ className, ref, ...props }: IconProps) => (
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
      d='M7.27855 6.30409C8.73763 4.82881 10.7166 4 12.78 4C14.8434 4 16.8224 4.82881 18.2814 6.30409C19.7405 7.77938 20.5602 9.7803 20.5602 11.8667C20.5602 13.953 19.7405 15.9539 18.2814 17.4292C16.8224 18.9045 14.8434 19.7333 12.78 19.7333C11.7583 19.7346 10.7465 19.5314 9.80282 19.1353C8.85919 18.7393 8.00244 18.1583 7.28198 17.4258L8.50952 16.1846C9.59875 17.2947 11.1116 17.9852 12.78 17.9852C16.1255 17.9852 18.8313 15.2493 18.8313 11.8667C18.8313 8.484 16.1255 5.74815 12.78 5.74815C9.67037 5.74815 7.34508 7.93401 6.99999 11H9.49994L5.99999 14.5L2.49994 11H4.99999C5.24987 8.66813 6.02857 7.56796 7.27855 6.30409Z'
      fill='currentColor'
    />
    <path d='M11 9V15L16 12L11 9Z' fill='currentColor' />
  </svg>
);
