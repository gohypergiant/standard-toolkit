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

export const Undo = ({ className, ref, ...props }: IconProps) => (
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
      d='M16.9919 9.50008H9.99595V6L5 10.5001L9.99595 15L10 11.5L16.9918 11.5001C16.9918 11.5001 16.9804 13.4588 16.9918 13.5001C16.9918 15.6667 17 16.8332 17 19H19C19 17 19 14 19 13.5C19 13.5 19.0004 13.0142 19 13C19 12.4946 19 12 19 12C19.0063 11.7216 19 11.7145 19 11.5001C19 9.50008 16.9919 9.50008 16.9919 9.50008Z'
      fill='currentColor'
    />
  </svg>
);
