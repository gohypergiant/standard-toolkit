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

export const CenterOn = ({ className, ref, ...props }: IconProps) => (
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
      d='M4.5 4.5H9V3L4.5 3C4.5 3 3 3 3 4.5L3 9H4.5V4.5Z'
      fill='currentColor'
    />
    <path
      d='M19.5 9V4.5L15 4.5V3L19.5 3C21 3 21 4.5 21 4.5V9L19.5 9Z'
      fill='currentColor'
    />
    <path
      d='M15 19.5H19.5V15H21V19.5C21 21 19.5 21 19.5 21H15V19.5Z'
      fill='currentColor'
    />
    <path
      d='M4.5 15L4.5 19.5H9L9 21H4.5C3 21 3 19.5 3 19.5L3 15H4.5Z'
      fill='currentColor'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.49999 12 9.49999C10.6193 9.49999 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79085 14.2091 7.99999 12 7.99999C9.79086 7.99999 8 9.79085 8 12C8 14.2091 9.79086 16 12 16Z'
      fill='currentColor'
    />
  </svg>
);
