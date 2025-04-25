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

export const OpenContainer = ({ className, ref, ...props }: IconProps) => (
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
      d='M9.62609 7C9.62609 7 7.1262 7 5.1262 7C3.62609 7 3.62609 8.5 3.62609 8.5C3.62609 8.5 3.62609 17.5 3.62609 19.5C3.62609 21 5.12609 21 5.12609 21H20.1261C20.1261 21 21.6261 21 21.6261 19.5C21.6261 17.5 21.6261 8.5 21.6261 8.5C21.6261 8.5 21.6261 7 20.1261 7C18.1261 7 15.6261 7 15.6261 7V8.5H20.1261V19.5H5.12609V8.5H9.62609V7Z'
      fill='currentColor'
    />
    <path
      d='M13.3788 4.5V12L16.626 12L12.5757 15.8994L8.62598 12L11.8756 12.0075V4.5C11.6261 4.5 7.72205 4.50002 5.62609 4.5L5.626 3.00008C7.62596 3.00008 9.87566 3.00629 11.8756 3.00629C13.3788 3.00629 13.3788 4.5 13.3788 4.5Z'
      fill='currentColor'
    />
  </svg>
);
