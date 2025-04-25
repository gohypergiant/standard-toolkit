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

export const Search = ({ className, ref, ...props }: IconProps) => (
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
      fillRule='evenodd'
      clipRule='evenodd'
      d='M15.734 13.3484L15.5593 13.5748L15.43 13.73C16.41 12.59 17 11.11 17 9.5C17 5.91 14.09 3 10.5 3C6.91 3 4 5.91 4 9.5C4 13.09 6.91 16 10.5 16C12.11 16 13.59 15.41 14.73 14.43L14.52 14.6031L14.2977 14.7711L20 20.49L21.49 19L15.734 13.3484ZM10.5 14C8.01 14 6 11.99 6 9.5C6 7.01 8.01 5 10.5 5C12.99 5 15 7.01 15 9.5C15 11.99 12.99 14 10.5 14Z'
      fill='currentColor'
    />
  </svg>
);
