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

export const Hide = ({ className, ref, ...props }: IconProps) => (
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
      fillRule='evenodd'
      clipRule='evenodd'
      d='M4.5924 8.24105C4.5924 8.24105 4.59215 8.24053 5.1551 7.97467C5.71805 7.70881 5.71786 7.7084 5.71786 7.7084L5.72133 7.71554L5.73816 7.74929C5.75391 7.7804 5.77872 7.82825 5.81267 7.89047C5.88062 8.01499 5.98489 8.19649 6.12614 8.41597C6.40931 8.85599 6.83729 9.44269 7.41431 10.0278C8.5692 11.199 10.2869 12.3327 12.626 12.3327C14.965 12.3327 16.6828 11.199 17.8376 10.0278C18.4147 9.44269 18.8426 8.85599 19.1258 8.41597C19.2671 8.19649 19.3713 8.01499 19.4393 7.89047C19.4732 7.82825 19.498 7.7804 19.5138 7.74929L19.5306 7.71554L19.534 7.70868C19.534 7.70868 19.5339 7.70881 20.0969 7.97467C20.6598 8.24053 20.6596 8.24105 20.6596 8.24105L20.6585 8.2433L20.6563 8.24788L20.6493 8.26238C20.6434 8.27438 20.6352 8.29099 20.6246 8.31192C20.6034 8.35378 20.5727 8.41292 20.5323 8.48689C20.4516 8.63475 20.3321 8.84236 20.1729 9.08981C19.8551 9.58365 19.3751 10.2421 18.7242 10.9021C17.4234 12.2213 15.4056 13.5778 12.626 13.5778C9.84632 13.5778 7.8286 12.2213 6.52773 10.9021C5.87687 10.2421 5.39689 9.58365 5.07908 9.08981C4.91983 8.84236 4.80035 8.63475 4.71967 8.48689C4.6793 8.41292 4.64858 8.35378 4.62738 8.31192C4.61678 8.29099 4.60855 8.27438 4.60269 8.26238L4.59566 8.24788L4.59346 8.2433L4.5924 8.24105Z'
      fill='currentColor'
    />
    <path
      d='M4.44613 7.86213L2.62598 7.97588L2.70365 9.2186L5.23638 9.06031L5.71445 7.71237C5.71445 7.71237 5.36425 7.73669 4.44613 7.86213Z'
      fill='currentColor'
    />
    <path
      d='M6.75902 10.8541L4.20624 12.425L4.85882 13.4855L7.72734 11.7202C7.3799 11.4432 7.05691 11.1507 6.75902 10.8541Z'
      fill='currentColor'
    />
    <path
      d='M10.0008 13.0657L8.93204 15.8446L10.0942 16.2916L11.1954 13.4284C10.7801 13.3408 10.3818 13.2174 10.0008 13.0657Z'
      fill='currentColor'
    />
    <path
      d='M14.0565 13.4284L15.1578 16.2916L16.3199 15.8446L15.2511 13.0657C14.8702 13.2174 14.4719 13.3408 14.0565 13.4284Z'
      fill='currentColor'
    />
    <path
      d='M17.5246 11.7202L20.3931 13.4855L21.0457 12.425L18.4929 10.8541C18.195 11.1507 17.8721 11.4432 17.5246 11.7202Z'
      fill='currentColor'
    />
    <path
      d='M20.0156 9.06031L22.5483 9.2186L22.626 7.97588L19.5424 7.71724L19.7904 8.41277L20.0156 9.06031Z'
      fill='currentColor'
    />
  </svg>
);
