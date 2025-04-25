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

export const Group = ({ className, ref, ...props }: IconProps) => (
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
      d='M16.5 6C16.5 6 12 6 10.5 6C9 6 9 7.5 9 7.5V9C9 9 9 12 9 13.5C9 15 10.5 15 10.5 15H13.5H15H16.5C16.5 15 18 15 18 13.5C18 12 18 7.5 18 7.5C18 7.5 18 6 16.5 6V7.5V13.5H10.5V7.5H16.5V6Z'
      fill='currentColor'
    />
    <path
      d='M9 9H7.50011C6 9 6.00011 10.5 6.00011 10.5L6 16.5C6 18 7.5 18 7.5 18H13.5C13.5 18 15 18 15 16.5V15H13.5V16.5H7.5V10.5H9V9Z'
      fill='currentColor'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M3 17.25V19.5C3 20.6046 3.39543 21 4.5 21H6.75V19.5H4.5C4.5 19.5 4.5 19.2761 4.5 19V17.25H3ZM3 13.75H4.5V10.25H3V13.75ZM3 6.75H4.5V4.5C4.5 4.5 4.72386 4.5 5 4.5H6.75V3H4.5C3.39543 3 3 3.39543 3 4.5V6.75ZM10.25 3V4.5H13.75V3H10.25ZM17.25 3V4.5H19C19.2761 4.5 19.5 4.5 19.5 4.5V6.75H21V4.5C21 3.39543 20.6046 3 19.5 3H17.25ZM21 10.25H19.5V13.75H21V10.25ZM21 17.25H19.5V19C19.5 19.2761 19.5 19.5 19.5 19.5H17.25V21H19.5C20.6046 21 21 20.6046 21 19.5V17.25ZM13.75 21V19.5H10.25V21H13.75Z'
      fill='currentColor'
    />
  </svg>
);
