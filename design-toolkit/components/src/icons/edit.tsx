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

export const Edit = ({ className, ref, ...props }: IconProps) => (
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
      d='M5.84977 15.3647L5.14258 18.9002L8.67811 18.1931L17.1634 9.70781L14.335 6.87943L5.84977 15.3647ZM19.6384 7.23291C20.699 6.17225 19.6383 5.1116 19.6383 5.1116L18.9312 4.4045C18.9312 4.4045 17.8706 3.34385 16.8099 4.40451C15.7492 5.46517 15.7492 5.46517 15.7492 5.46517L18.5776 8.2936L19.6384 7.23291Z'
      fill='currentColor'
    />
  </svg>
);
