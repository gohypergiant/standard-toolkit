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

export const AttachFile = ({ className, ref, ...props }: IconProps) => (
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
      d='M15.5 7V16C15.5 19.5 11.75 19.5 11.75 19.5C11.75 19.5 8 19.5 8 16V6.99991C8 4.49991 10.25 4.5 10.25 4.5C10.25 4.5 12.5 4.5 12.5 7V15.5C12.5 16.5001 11.75 16.5 11.75 16.5C11.75 16.5 11 16.5 11 15.5V7H9.5V16C9.5 18 11.75 18 11.75 18C11.75 18 14 18 14 16V7.00009C14 3 10.25 3 10.25 3C10.25 3 6.5 2.99991 6.5 7V16C6.5 21 11.75 21 11.75 21C11.75 21 17 21 17 16V7H15.5Z'
      fill='currentColor'
    />
  </svg>
);
