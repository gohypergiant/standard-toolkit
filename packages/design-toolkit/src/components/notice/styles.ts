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

import { tv } from '@accelint/design-foundation/lib/utils';

export const NoticeStyles = tv({
  slots: {
    region: [
      'group/region flex flex-col gap-y-s',
      'data-placement:absolute',
      'data-[placement=top]:-translate-x-1/2 placement-top:top-0 data-[placement=top]:left-1/2',
      'data-[placement=bottom]:-translate-x-1/2 placement-bottom:bottom-0 data-[placement=bottom]:left-1/2',
      'placement-right:right-0 data-[placement=right]:top-1/2',
      'placement-left:left-0 data-[placement=left]:top-1/2',
    ],
    list: ['flex flex-col gap-y-s'],
  },
});
