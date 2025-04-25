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

export const Move = ({ className, ref, ...props }: IconProps) => (
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
      d='M10.8078 9.27273H14.4442V6.54545H17.1714L12.626 2L8.08052 6.54545H10.8078V9.27273ZM9.8987 10.1818H7.17143V7.45455L2.62598 12L7.17143 16.5455V13.8182H9.8987V10.1818ZM22.626 12L18.0805 7.45455V10.1818H15.3532V13.8182H18.0805V16.5455L22.626 12ZM14.4442 14.7273H10.8078V17.4545H8.08052L12.626 22L17.1714 17.4545H14.4442V14.7273Z'
      fill='currentColor'
    />
  </svg>
);
