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

export const Check = ({ className, ref, ...props }: IconProps) => (
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
      d='M11.6168 16.1067C11.6168 16.1067 10.2079 17.5156 8.79359 16.1012C7.3793 14.6867 4.55606 11.8532 3.8436 11.1514L5.25246 9.74256C5.95948 10.4496 10.2022 14.6923 10.2022 14.6923C10.2022 14.6923 17.9807 6.91399 18.6877 6.20692L20.1019 7.62114C19.3948 8.32826 11.6168 16.1067 11.6168 16.1067Z'
      fill='currentColor'
    />
  </svg>
);
