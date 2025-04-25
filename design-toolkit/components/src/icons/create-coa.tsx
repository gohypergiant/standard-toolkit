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

export const CreateCOA = ({ className, ref, ...props }: IconProps) => (
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
      d='M5 6.45455L12 3L19 6.45455V10.6364C19 11.3592 18.9386 12.075 18.8195 12.7732C17.9024 11.6887 16.5316 11 15 11C12.2386 11 10 13.2386 10 16C10 18.0927 11.2857 19.8852 13.1103 20.6306C12.7534 20.7792 12.3831 20.9031 12 21C7.7 19.9118 5 15.4295 5 10.6364V6.45455Z'
      fill='currentColor'
    />
    <path
      d='M15.75 13.5H14.25V15.25H12.5V16.75H14.25V18.5H15.75V16.75H17.5V15.25H15.75V13.5Z'
      fill='currentColor'
    />
  </svg>
);
