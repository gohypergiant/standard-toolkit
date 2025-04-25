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

export const ExpandAll = ({ className, ref, ...props }: IconProps) => (
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
      d='M11.9297 4.86647L17.0985 10.0352L18.3907 8.74306L13.2219 3.57425C11.9298 2.28215 10.6376 3.57432 10.6376 3.57432L5.46875 8.74321L6.76095 10.0352L11.9297 4.86647Z'
      fill='currentColor'
    />
    <path
      d='M11.9298 19.1335L6.76095 13.9648L5.46879 15.2569L10.6376 20.4258C11.9297 21.7179 13.2218 20.4257 13.2218 20.4257L18.3907 15.2568L17.0985 13.9648L11.9298 19.1335Z'
      fill='currentColor'
    />
  </svg>
);
