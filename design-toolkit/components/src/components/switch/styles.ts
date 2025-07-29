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

export const SwitchStyles = tv({
  slots: {
    switch:
      'group/switch flex cursor-pointer items-center gap-s disabled:cursor-not-allowed',
    control: [
      'flex rounded-round bg-transparent p-xxs outline outline-interactive before:mr-l before:block before:size-m before:rounded-full before:bg-default-dark',
      'group-enabled/switch:group-focus/switch:bg-interactive-hover-dark group-enabled/switch:group-focus/switch:outline-interactive-hover group-enabled/switch:group-focus/switch:before:bg-interactive-hover',
      'group-enabled/switch:group-hover/switch:bg-interactive-hover-dark group-enabled/switch:group-hover/switch:outline-interactive-hover group-enabled/switch:group-hover/switch:before:bg-interactive-hover',
      'group-enabled/switch:group-selected/switch:outline-highlight group-selected/switch:before:mr-0 group-selected/switch:before:ml-l group-enabled/switch:group-selected/switch:before:bg-highlight',
      'group-enabled/switch:group-selected/switch:group-focus/switch:bg-highlight-subtle group-enabled/switch:group-selected/switch:group-focus/switch:outline-interactive-hover group-enabled/switch:group-selected/switch:group-focus/switch:before:bg-highlight',
      'group-enabled/switch:group-selected/switch:group-hover/switch:bg-highlight-subtle group-enabled/switch:group-selected/switch:group-hover/switch:outline-highlight group-enabled/switch:group-selected/switch:group-hover/switch:before:bg-highlight',
      'group-disabled/switch:bg-interactive-disabled group-disabled/switch:outline-interactive-disabled group-disabled/switch:before:bg-disabled',
    ],
    label: [
      'text-body-s text-interactive-default',
      'group-disabled/switch:text-interactive-disabled',
    ],
  },
});
