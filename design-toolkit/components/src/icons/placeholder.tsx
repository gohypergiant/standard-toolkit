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

export const Placeholder = ({ className, ref, ...props }: IconProps) => (
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
      d='M2 17.7143V20C2 21.1046 2.89543 22 4 22H6.28571V20H4L4 17.7143H2ZM6.28571 2H4C2.89543 2 2 2.89543 2 4V6.28571H4V4L6.28571 4V2ZM2 14.2857H4V9.71429H2V14.2857ZM9.71429 2V4H14.2857V2H9.71429ZM17.7143 2V4H20V6.28571H22V4C22 2.89543 21.1046 2 20 2H17.7143ZM22 9.71429H20V14.2857H22V9.71429ZM22 17.7143H20V20H17.7143V22H20C21.1046 22 22 21.1046 22 20V17.7143ZM14.2857 22V20H9.71429V22H14.2857Z'
      fill='currentColor'
    />
  </svg>
);
