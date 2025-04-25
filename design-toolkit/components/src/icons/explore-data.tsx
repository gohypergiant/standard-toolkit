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

export const ExploreData = ({ className, ref, ...props }: IconProps) => (
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
      d='M6.71541 4.28459L5.5 1L4.28459 4.28459L1 5.5L4.28459 6.71541L5.5 10L6.71541 6.71541L10 5.5L6.71541 4.28459Z'
      fill='currentColor'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M10.7191 16.2977L5.00023 22L6.49023 23.49L12.1418 17.734C13.2219 18.5307 14.5544 19 15.9902 19C19.5802 19 22.4902 16.09 22.4902 12.5C22.4902 8.91 19.5802 6 15.9902 6C12.4002 6 9.49023 8.91 9.49023 12.5C9.49023 13.9135 9.94497 15.2267 10.7191 16.2977ZM11.9154 17.5593L12.1418 17.734C12.0108 17.6374 11.8835 17.536 11.7602 17.43L11.9154 17.5593ZM10.7191 16.2977C10.7736 16.373 10.8296 16.4471 10.8871 16.5199L10.7191 16.2977ZM10.8871 16.5199C10.8871 16.5199 10.8871 16.52 10.8871 16.5199V16.5199ZM11.0602 16.73L10.8871 16.5199C10.9434 16.5912 11.0011 16.6612 11.0602 16.73ZM15.9902 8C13.5002 8 11.4902 10.01 11.4902 12.5C11.4902 14.99 13.5002 17 15.9902 17C18.4802 17 20.4902 14.99 20.4902 12.5C20.4902 10.01 18.4802 8 15.9902 8Z'
      fill='currentColor'
    />
  </svg>
);
