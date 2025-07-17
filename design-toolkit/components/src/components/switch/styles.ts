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
      'group flex cursor-pointer items-center gap-s disabled:cursor-not-allowed',
    control: [
      'flex rounded-round bg-transparent p-xxs outline outline-interactive before:mr-l before:block before:size-m before:rounded-full before:bg-default-dark',
      'group-enabled:group-focus:bg-interactive-hover-dark group-enabled:group-focus:outline-interactive-hover group-enabled:group-focus:before:bg-interactive-hover',
      'group-enabled:group-hover:bg-interactive-hover-dark group-enabled:group-hover:outline-interactive-hover group-enabled:group-hover:before:bg-interactive-hover',
      'group-enabled:group-selected:outline-highlight group-selected:before:mr-0 group-selected:before:ml-l group-enabled:group-selected:before:bg-highlight',
      'group-enabled:group-selected:group-focus:bg-highlight-subtle group-enabled:group-selected:group-focus:outline-interactive-hover group-enabled:group-selected:group-focus:before:bg-highlight',
      'group-enabled:group-selected:group-hover:bg-highlight-subtle group-enabled:group-selected:group-hover:outline-highlight group-enabled:group-selected:group-hover:before:bg-highlight',
      'group-disabled:bg-interactive-disabled group-disabled:outline-interactive-disabled group-disabled:before:bg-disabled',
    ],
    label: [
      'text-body-s text-interactive-default',
      'group-disabled:text-interactive-disabled',
    ],
  },
});
