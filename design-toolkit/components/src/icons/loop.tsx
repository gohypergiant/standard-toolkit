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

export const Loop = ({ className, ref, ...props }: IconProps) => (
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
      d='M11.9958 1.90625L8.99727 4.36988L11.9958 6.83351L11.9958 1.90625Z'
      fill='currentColor'
    />
    <path
      d='M18.9999 11.9931C18.9999 8.21532 15.8879 5.11673 12.0041 5.11672V3.61672C16.6962 3.61673 20.4999 7.36694 20.4999 11.9931C20.4999 14.3062 19.5489 16.4003 18.0115 17.9161L16.9432 16.8628C18.2156 15.6148 18.9999 13.8895 18.9999 11.9931Z'
      fill='currentColor'
    />
    <path
      d='M12.0041 22.0937L15.0026 19.6674L12.0041 17.2411L12.0041 22.0937Z'
      fill='currentColor'
    />
    <path
      d='M5 12.1597C5 15.846 8.09022 18.9092 11.9958 18.9092V20.4092C7.30369 20.4092 3.5 16.7158 3.5 12.1597C3.5 9.8815 4.45104 7.81901 5.98865 6.32612L7.06533 7.37159C5.78565 8.60066 5 10.3009 5 12.1597Z'
      fill='currentColor'
    />
  </svg>
);
