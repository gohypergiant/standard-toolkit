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

export const Share = ({ className, ref, ...props }: IconProps) => (
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
      d='M4.99988 20L4.99988 12H2.99988L2.99988 20C2.99988 21.1 3.89988 22 4.99988 22H18.9999C20.0999 22 20.9999 21.1 20.9999 20V12H18.9999V20H4.99988Z'
      fill='currentColor'
    />
    <path
      d='M8.39988 8.4L6.99988 7L11.9999 2L16.9999 7L15.5999 8.4L12.9999 5.8V16H10.9999V5.8L8.39988 8.4Z'
      fill='currentColor'
    />
  </svg>
);
