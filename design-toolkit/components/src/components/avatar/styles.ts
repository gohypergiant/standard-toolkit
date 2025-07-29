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

export const AvatarStyles = tv({
  slots: {
    avatar: [
      `group/avatar grid [grid-template-areas:'content'] rounded-full bg-surface-overlay fg-default-dark`,
      'size-medium:size-[32px] size-medium:text-header-m',
      'size-small:size-xl size-small:text-header-xs',
    ],
    image:
      'size-full overflow-hidden rounded-full object-cover object-center [grid-area:content]',
    fallback: 'flex size-full items-center justify-center [grid-area:content]',
    content:
      'relative flex size-full items-center justify-center [grid-area:content]',
  },
});
