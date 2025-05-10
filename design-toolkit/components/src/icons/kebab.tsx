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

export const Kebab = ({ className, ref, ...props }: IconProps) => (
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
      d='M11.9958 7.01155C13.0981 7.01155 13.9917 6.11353 13.9917 5.00577C13.9917 3.89801 13.0981 3 11.9958 3C10.8936 3 10 3.89801 10 5.00577C10 6.11353 10.8936 7.01155 11.9958 7.01155Z'
      fill='currentColor'
    />
    <path
      d='M11.9958 14.0116C13.0981 14.0116 13.9917 13.1135 13.9917 12.0058C13.9917 10.898 13.0981 10 11.9958 10C10.8936 10 10 10.898 10 12.0058C10 13.1135 10.8936 14.0116 11.9958 14.0116Z'
      fill='currentColor'
    />
    <path
      d='M11.9958 21.0115C13.0981 21.0115 13.9917 20.1135 13.9917 19.0058C13.9917 17.898 13.0981 17 11.9958 17C10.8936 17 10 17.898 10 19.0058C10 20.1135 10.8936 21.0115 11.9958 21.0115Z'
      fill='currentColor'
    />
  </svg>
);
