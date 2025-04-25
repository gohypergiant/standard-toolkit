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

export const Mute = ({ className, ref, ...props }: IconProps) => (
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
      d='M19.8088 17.9446L8.36412 6.36L5.94529 3.91385L4.75 5.08615L7.38529 7.67077V7.68C6.89588 8.59385 6.63235 9.67385 6.63235 10.8369V15.4523L4.75 17.2985V18.2215H17.6724L19.5547 20.0677L20.75 18.8954L19.8088 17.9446ZM12.2794 21C13.3241 21 14.1618 20.1785 14.1618 19.1538H10.3971C10.3971 20.1785 11.2347 21 12.2794 21ZM17.9265 14.2431V10.8462C17.9265 8.00308 16.3829 5.64 13.6912 5.01231V3.00012C13.6912 3.00012 13.0606 3 12.2794 3C11.4982 3 10.8676 3 10.8676 3V5.01231C10.7265 5.04 10.5947 5.08615 10.4724 5.12308C10.3782 5.15077 10.2841 5.18769 10.19 5.22462H10.1806C10.1712 5.22462 10.1712 5.22462 10.1618 5.23385C9.94529 5.31692 9.72882 5.41846 9.52176 5.52C9.52176 5.52 9.51235 5.52 9.51235 5.52923L17.9265 14.2431Z'
      fill='currentColor'
    />
  </svg>
);
