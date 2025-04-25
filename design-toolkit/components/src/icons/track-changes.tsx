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

export const TrackChanges = ({ className, ref, ...props }: IconProps) => (
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
      d='M11.25 3.03081C6.63035 3.41192 3 7.282 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 9.51472 19.9926 7.26472 18.364 5.63604L17.3033 6.6967C18.6605 8.05393 19.5 9.92893 19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 8.11099 7.46001 4.91332 11.25 4.53703V6.55071C8.56724 6.9165 6.5 9.21684 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 10.4812 16.8844 9.10622 15.8891 8.11091L14.9168 9.08318C15.6633 9.82966 16.125 10.8609 16.125 12C16.125 14.2782 14.2782 16.125 12 16.125C9.72183 16.125 7.875 14.2782 7.875 12C7.875 9.97795 9.32991 8.29571 11.25 7.94302V10.1468C10.5188 10.445 10 11.1649 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 11.1421 13.5438 10.4058 12.75 10.1233V3H11.25V3.03081Z'
      fill='currentColor'
    />
  </svg>
);
