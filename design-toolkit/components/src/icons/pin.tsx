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

export const Pin = ({ className, ref, ...props }: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    className={cn(
      '[height:var(--icon-size,--spacing-xl)] [width:var(--icon-size,--spacing-xl)] [color:var(--icon-color,currentColor)]',
      className,
    )}
    {...props}
    ref={ref}
  >
    <path
      d='M7.37548 3.16546C7.43113 3.1131 7.49725 3.07154 7.57005 3.04314C7.64284 3.01475 7.7209 3.00009 7.79975 3L16.2003 3C16.3594 3.00002 16.5119 3.05928 16.6244 3.16475C16.7369 3.27021 16.8001 3.41325 16.8002 3.5624C16.8002 4.32606 16.3895 4.88289 16.0238 5.22574C15.8736 5.36654 15.7242 5.4779 15.6003 5.56063V10.5467C15.9524 10.7455 16.2854 10.9725 16.5957 11.2252C17.2304 11.747 18 12.5926 18 13.6872C18 13.8364 17.9368 13.9794 17.8243 14.0849C17.7118 14.1903 17.5592 14.2496 17.4001 14.2496L12.5999 14.2504L12.5999 19.3128C12.5999 19.623 12.3309 21 12 21C11.6691 21 11.3992 19.6222 11.4001 19.3128L11.4001 14.2504L6.59991 14.2496C6.44081 14.2496 6.28824 14.1903 6.17574 14.0849C6.06324 13.9794 6.00002 13.8364 6 13.6872C6 12.5926 6.76877 11.7462 7.40433 11.2252C7.71455 10.9725 8.04758 10.7454 8.39966 10.5467L8.40051 5.56143C8.24909 5.4611 8.10689 5.34908 7.97539 5.22653C7.61052 4.88448 7.19983 4.32765 7.19983 3.5624C7.20003 3.41351 7.2632 3.27076 7.37548 3.16546Z'
      fill='currentColor'
    />
  </svg>
);
