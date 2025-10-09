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
      'group-enabled/checkbox:group-selected/checkbox:outline-accent-primary-bold·group-enabled/checkbox:fg-info-bold·group-enabled/checkbox:group-indeterminate/checkbox:fg-a11y-on-accent·group-enabled/checkbox:group-selected/checkbox:fg-a11y-on-accent·group-enabled/checkbox:group-indeterminate/checkbox:bg-accent-primary-bold·group-enabled/checkbox:group-indeterminate/checkbox:outline-accent-primary-bold·group-enabled/checkbox:group-selected/checkbox:bg-accent-primary-bold',
      //focus-visible
      'group-enabled/checkbox:group-focus-visible/checkbox:outline-interactive-hover·group-enabled/checkbox:group-indeterminate/checkbox:group-focus-visible/checkbox:bg-accent-primary-hover·group-enabled/checkbox:group-indeterminate/checkbox:group-focus-visible/checkbox:outline-accent-primary-hover·group-enabled/checkbox:group-selected/checkbox:group-focus-visible/checkbox:bg-accent-primary-hover·group-enabled/checkbox:group-selected/checkbox:group-focus-visible/checkbox:outline-accent-primary-hover',
      //hover
      'group-enabled/checkbox:group-hover/checkbox:outline-interactive-hover·group-enabled/checkbox:group-indeterminate/checkbox:group-hover/checkbox:bg-accent-primary-hover·group-enabled/checkbox:group-indeterminate/checkbox:group-hover/checkbox:outline-accent-primary-hover·group-enabled/checkbox:group-selected/checkbox:group-hover/checkbox:bg-accent-primary-hover·group-enabled/checkbox:group-selected/checkbox:group-hover/checkbox:outline-accent-primary-hover',
      //pressed
      'group-enabled/checkbox:group-selected/checkbox:group-pressed/checkbox:bg-accent-primary-pressed·group-enabled/checkbox:group-selected/checkbox:group-pressed/checkbox:outline-accent-primary-pressed·group-enabled/checkbox:group-pressed/checkbox:outline-interactive-pressed·group-enabled/checkbox:group-indeterminate/checkbox:group-pressed/checkbox:bg-accent-primary-pressed·group-enabled/checkbox:group-indeterminate/checkbox:group-pressed/checkbox:outline-accent-primary-pressed',
      //disabled
      'group-disabled/checkbox:group-indeterminate/checkbox:fg-inverse-bold·group-disabled/checkbox:group-selected/checkbox:fg-inverse-bold·group-disabled/checkbox:outline-interactive-disabled·group-disabled/checkbox:group-indeterminate/checkbox:bg-interactive-disabled·group-disabled/checkbox:group-selected/checkbox:bg-interactive-disabled',
    ],
    label: [
      'fg-primary-bold text-body-s',
      'group-disabled/checkbox:fg-disabled',
    ],
  },
});
