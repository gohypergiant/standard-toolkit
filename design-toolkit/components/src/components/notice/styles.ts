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

import { tv } from '@/lib/utils';

export const NoticeStyles = tv({
  slots: {
    notice: [
      'group/notice fg-primary-bold flex rounded-medium text-body-s shadow-elevation-overlay outline',
      'size-small-min-h-[54px] size-small:min-w-[120px] size-small:max-w-[320px] size-small:flex-col size-small:gap-m size-small:p-m',
      'size-medium:min-h-[64px] size-medium:min-w-[200px] size-medium:max-w-[640px] size-medium:gap-l size-medium:p-l',
      'color-info:bg-info-muted color-info:outline-info-bold',
      'color-advisory:bg-advisory-muted color-advisory:outline-accent-primary-bold',
      'color-normal:bg-normal-muted color-normal:outline-normal-bold',
      'color-serious:bg-serious-muted color-serious:outline-serious-bold',
      'color-critical:bg-critical-muted color-critical:outline-critical-bold',
    ],
    content: [
      'flex flex-1 items-center group-size-medium/notice:gap-l group-size-small/notice:gap-m',
    ],
    region: [
      'absolute flex flex-col gap-y-s',
      'data-[placement=top]:-translate-x-1/2 placement-top:top-0 data-[placement=top]:left-1/2',
      'data-[placement=bottom]:-translate-x-1/2 placement-bottom:bottom-0 data-[placement=bottom]:left-1/2',
      'placement-right:right-0 data-[placement=right]:top-1/2',
      'placement-left:left-0 data-[placement=left]:top-1/2',
    ],
    list: ['flex flex-col gap-y-s'],
    actions: 'flex items-center gap-s group-size-small/notice:justify-end',
  },
});
