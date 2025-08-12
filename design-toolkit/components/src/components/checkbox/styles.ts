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

export const CheckboxStyles = tv({
  slots: {
    group: [
      'group/checkbox-group flex gap-xs',
      'orientation-horizontal:flex-wrap',
      'orientation-vertical:flex-col',
    ],
    groupLabel: 'w-full',
    checkbox: [
      'group/checkbox flex cursor-pointer items-center gap-m group-orientation-horizontal/checkbox-group:grow group-orientation-horizontal/checkbox-group:basis-1/3',
      'disabled:cursor-not-allowed',
    ],
    control: [
      'my-xxs flex size-l items-center justify-center rounded-small outline outline-interactive',
      'group-enabled/checkbox:fg-info-subtle',
      'group-enabled/checkbox:group-focus/checkbox:outline-interactive-hover',
      'group-enabled/checkbox:group-hover/checkbox:outline-interactive-hover',
      'group-enabled/checkbox:group-indeterminate/checkbox:bg-highlight group-enabled/checkbox:group-indeterminate/checkbox:outline-highlight',
      'group-enabled/checkbox:group-indeterminate/checkbox:group-focus/checkbox:outline-interactive-hover',
      'group-enabled/checkbox:group-indeterminate/checkbox:group-hover/checkbox:outline-interactive-hover',
      'group-enabled/checkbox:group-selected/checkbox:bg-highlight group-enabled/checkbox:group-selected/checkbox:outline-highlight',
      'group-enabled/checkbox:group-selected/checkbox:group-focus/checkbox:outline-interactive-hover',
      'group-enabled/checkbox:group-selected/checkbox:group-hover/checkbox:outline-interactive-hover',
      'group-disabled/checkbox:outline-interactive-disabled',
      'group-disabled/checkbox:group-indeterminate/checkbox:fg-inverse-light group-disabled/checkbox:group-indeterminate/checkbox:bg-interactive-disabled',
      'group-disabled/checkbox:group-selected/checkbox:fg-inverse-light group-disabled/checkbox:group-selected/checkbox:bg-interactive-disabled',
    ],
    label: [
      'text-body-s text-interactive-default',
      'group-disabled/checkbox:text-interactive-disabled',
    ],
  },
});
