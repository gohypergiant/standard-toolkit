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

export const Import = ({ className, ref, ...props }: IconProps) => (
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
    <path d='M11 3H13V11H17L12 16L7 11H11V3Z' fill='currentColor' />
    <path d='M21 19V21H3V19L21 19Z' fill='currentColor' />
  </svg>
);
