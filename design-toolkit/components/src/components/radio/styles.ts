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

export const RadioStyles = tv({
  slots: {
    group: [
      'group/radio-group flex gap-xs',
      'orientation-horizontal:flex-wrap',
      'orientation-vertical:flex-col',
    ],
    groupLabel: 'w-full',
    radio: [
      'group/radio flex cursor-pointer items-center gap-m group-orientation-horizontal/radio-group:grow group-orientation-horizontal/radio-group:basis-1/3',
      'disabled:cursor-not-allowed',
    ],
    control: [
      'my-xxs flex size-l items-center justify-center rounded-full outline outline-interactive before:block before:size-s before:rounded-full',
      'group-enabled/radio:group-focus-visible/radio:outline-interactive-hover',
      'group-enabled/radio:group-hover/radio:outline-interactive-hover',
      'group-enabled/radio:group-selected/radio:outline-highlight group-enabled/radio:group-selected/radio:before:bg-highlight',
      'group-enabled/radio:group-selected/radio:group-focus-visible/radio:outline-interactive-hover',
      'group-enabled/radio:group-selected/radio:group-hover/radio:outline-interactive-hover',
      'group-disabled/radio:outline-interactive-disabled',
      'group-disabled/radio:group-selected/radio:before:bg-interactive-disabled',
    ],
    label: [
      'text-body-s text-interactive-default',
      'group-disabled/radio:text-interactive-disabled',
    ],
  },
});
