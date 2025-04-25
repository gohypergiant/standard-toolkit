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

export const JumpTo = ({ className, ref, ...props }: IconProps) => (
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
      d='M20.8709 12.8275L12.8275 20.8708C11.8995 21.7989 10.9714 20.8708 10.9714 20.8708L2.92804 12.8275C1.99997 11.8994 2.92804 10.9714 2.92804 10.9714L10.9714 2.92801C11.8995 1.99993 12.8275 2.92801 12.8275 2.92801L20.8709 10.9714C20.8709 10.9714 21.799 11.8994 20.8709 12.8275ZM3.85612 11.8994L11.8995 19.9428L19.9428 11.8994L11.8995 3.85609L3.85612 11.8994Z'
      fill='currentColor'
    />
    <path
      d='M10.0081 11.0001H13.0041L13 8.00001L17.5 12L13 16V13L10.0082 13.0001L9.9972 14.5C9.9972 14.5 9.9972 13.5 10 14.5H8C8 12.5 7.9972 14.5 7.9972 14.5C7.9972 14.5 7.9972 14.5 7.9972 14C7.99722 13.4946 8 13.5 8 13.5V13.0001C8 11.0001 10.0081 11.0001 10.0081 11.0001Z'
      fill='currentColor'
    />
  </svg>
);
