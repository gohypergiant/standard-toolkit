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

export const StackCards = ({ className, ref, ...props }: IconProps) => (
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
      d='M3.54233 8.9542L11.6492 12.9466C11.7597 13.0008 11.8785 13.0288 11.9985 13.0288C12.1186 13.0288 12.2374 13.0008 12.3478 12.9466L20.4577 8.9542C20.6186 8.87512 20.7558 8.74323 20.8522 8.57492C20.9486 8.40661 21 8.2093 21 8.00754C21 7.80579 20.9486 7.60848 20.8522 7.44017C20.7558 7.27186 20.6186 7.13996 20.4577 7.06089L12.3508 3.08221C12.2403 3.02796 12.1215 3 12.0015 3C11.8815 3 11.7626 3.02796 11.6522 3.08221L3.54233 7.06089C3.38145 7.13996 3.24427 7.27186 3.14784 7.44017C3.05142 7.60848 3.00001 7.80579 3.00001 8.00754C3.00001 8.2093 3.05142 8.40661 3.14784 8.57492C3.24427 8.74323 3.38145 8.87512 3.54233 8.9542Z'
      fill='currentColor'
    />
    <path
      d='M19.7588 11.0527L11.9997 14.8737L4.24063 11.0527C2.99995 10.5 2.5646 12.0225 3.50002 12.5L11.6507 16.4178C11.7612 16.4721 11.88 16.5 12 16.5C12.1201 16.5 12.2389 16.4721 12.3493 16.4178L20.4999 12.5C21.5159 11.9814 20.9999 10.5 19.7588 11.0527Z'
      fill='currentColor'
    />
    <path
      d='M19.7954 14.2725L12.0364 18.0935L4.27729 14.2725C3.03661 13.7198 2.60126 15.2423 3.53668 15.7198L11.6874 19.6376C11.7978 19.6919 11.9166 19.7198 12.0367 19.7198C12.1567 19.7198 12.2755 19.6919 12.386 19.6376L20.5366 15.7198C21.5526 15.2012 21.0366 13.7198 19.7954 14.2725Z'
      fill='currentColor'
    />
  </svg>
);
