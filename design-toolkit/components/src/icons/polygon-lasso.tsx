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

export const PolygonLasso = ({ className, ref, ...props }: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={cn(
      'size-[var(--icon-size,var(--spacing-xl))] [color:var(--icon-color,currentColor)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M21.4924 2L13.0762 7.04971H2.50757L7.89404 13.5648C7.47361 14.1149 7.22386 14.8024 7.22386 15.5482C7.22386 16.4725 7.60742 17.3071 8.22405 17.9017C7.35758 19.0421 6.27262 20.0671 4.96612 20.6982L5.59496 22C7.21092 21.2194 8.49157 19.9672 9.46762 18.6533C9.79014 18.7598 10.1349 18.8174 10.4931 18.8174C12.1414 18.8174 13.5048 17.5975 13.7297 16.0113L19.7099 14.6874L21.4924 2ZM13.6094 14.5572L18.4178 13.4927L19.6394 4.79782L13.4767 8.49545H5.57874L9.0032 12.6374C9.44999 12.4083 9.95643 12.279 10.4931 12.279C11.9531 12.279 13.1897 13.2361 13.6094 14.5572ZM10.4931 17.3716C11.5001 17.3716 12.3165 16.5553 12.3165 15.5482C12.3165 15.0367 12.106 14.5745 11.7668 14.2434C11.4788 15.1128 11.0021 16.2288 10.3255 17.3641C10.3807 17.3691 10.4366 17.3716 10.4931 17.3716ZM8.6696 15.5482C8.6696 14.5673 9.4441 13.7673 10.4149 13.7264C10.159 14.5151 9.70983 15.5822 9.05577 16.6705C8.81381 16.361 8.6696 15.9714 8.6696 15.5482Z'
      fill='currentColor'
    />
  </svg>
);
