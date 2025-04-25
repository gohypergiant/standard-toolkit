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

export const ZoomOut = ({ className, ref, ...props }: IconProps) => (
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
    <path d='M8 9H13V10H8V9Z' fill='currentColor' />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M14.2977 14.7711L20 20.49L21.49 19L15.734 13.3484C16.5307 12.2683 17 10.9359 17 9.5C17 5.91 14.09 3 10.5 3C6.91 3 4 5.91 4 9.5C4 13.09 6.91 16 10.5 16C11.9135 16 13.2267 15.5453 14.2977 14.7711ZM15.734 13.3484L15.5593 13.5748C15.6192 13.5007 15.6774 13.4252 15.734 13.3484ZM15.5593 13.5748C15.5593 13.5748 15.5593 13.5748 15.5593 13.5748V13.5748ZM15.43 13.73C15.4739 13.6789 15.517 13.6272 15.5593 13.5748L15.43 13.73ZM14.2977 14.7711C14.373 14.7167 14.4471 14.6607 14.5199 14.6031L14.2977 14.7711ZM14.5199 14.6031C14.5199 14.6031 14.52 14.6031 14.5199 14.6031V14.6031ZM14.73 14.43L14.5199 14.6031C14.5912 14.5469 14.6612 14.4891 14.73 14.43ZM6 9.5C6 11.99 8.01 14 10.5 14C12.99 14 15 11.99 15 9.5C15 7.01 12.99 5 10.5 5C8.01 5 6 7.01 6 9.5Z'
      fill='currentColor'
    />
  </svg>
);
