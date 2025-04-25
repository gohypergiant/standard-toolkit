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

export const CopyToClipboard = ({ className, ref, ...props }: IconProps) => (
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
      d='M14.626 3L5.37598 3C4.27598 3 3.62598 3.65 3.62598 4.75L3.62598 16H5.12598L5.12598 4.5L14.626 4.5V3ZM19.876 6L8.37598 6C7.27598 6 6.62598 6.65 6.62598 7.75L6.62598 19.25C6.62598 20.35 7.27598 21 8.37598 21L19.876 21C20.976 21 21.626 20.35 21.626 19.25L21.626 7.75C21.626 6.65 20.976 6 19.876 6ZM20.126 19.5L8.12598 19.5L8.12598 7.5L20.126 7.5L20.126 19.5Z'
      fill='currentColor'
    />
  </svg>
);
