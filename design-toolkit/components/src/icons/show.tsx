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

export const Show = ({ className, ref, ...props }: IconProps) => (
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
      d='M2 12C2 12 4.10546 5 12.0001 5C19.8947 5 22 12 22 12C22 12 19.8948 19 12 19C4.1052 19 2 12 2 12ZM12 16.3077C14.3254 16.3077 16.2105 14.3791 16.2105 12C16.2105 9.62093 14.3254 7.69231 12 7.69231C9.67459 7.69231 7.78947 9.62093 7.78947 12C7.78947 14.3791 9.67459 16.3077 12 16.3077Z'
      fill='currentColor'
    />
  </svg>
);
