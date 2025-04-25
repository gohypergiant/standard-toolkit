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

export const Person = ({ className, ref, ...props }: IconProps) => (
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
      d='M15.6946 8.53033C16.5397 6.48989 15.5708 4.15063 13.5303 3.30545C11.4899 2.46027 9.15063 3.42922 8.30545 5.46967C7.46027 7.51011 8.42922 9.84937 10.4697 10.6946C12.5101 11.5397 14.8494 10.5708 15.6946 8.53033Z'
      fill='currentColor'
    />
    <path
      d='M5.11304 14.188C5.25924 13.4737 5.88055 12.4737 6.82732 12.4737L17.1619 12.4738C18.1087 12.4738 18.7222 13.4777 18.8762 14.1881L20.5 20C14.8333 20 9.16667 20 3.5 20L5.11304 14.188Z'
      fill='currentColor'
    />
  </svg>
);
