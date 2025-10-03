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
      'flex rounded-round bg-transparent p-xxs outline outline-interactive before:mr-l before:block before:size-m before:rounded-full before:transition-[margin,background-color] before:duration-150 before:ease-out before:[background-color:var(--fg-primary-muted)]',
      //focus-visible
      'group-enabled/switch:group-focus-visible/switch:bg-interactive-muted-hover group-enabled/switch:group-focus-visible/switch:outline-interactive-hover group-enabled/switch:group-focus-visible/switch:before:[background-color:var(--fg-primary-bold)]',
      //hover
      'group-enabled/switch:group-hover/switch:bg-interactive-muted-hover group-enabled/switch:group-hover/switch:outline-interactive-hover group-enabled/switch:group-hover/switch:before:[background-color:var(--fg-primary-bold)]',
      //pressed
      'group-enabled/switch:group-pressed/switch:bg-interactive-pressed group-enabled/switch:group-pressed/switch:outline-interactive-pressed group-enabled/switch:group-pressed/switch:outline-interactive-pressed group-enabled/switch:group-pressed/switch:before:[background-color:var(--fg-primary-bold)]',
      //selected
      'group-enabled/switch:group-selected/switch:outline-accent-primary-bold group-selected/switch:before:mr-0 group-selected/switch:before:ml-l group-enabled/switch:group-selected/switch:before:[background-color:var(--fg-accent-primary-bold)]',
      //focus-visble
      'group-enabled/switch:group-selected/switch:group-focus-visible/switch:bg-accent-primary-muted group-enabled/switch:group-selected/switch:group-focus-visible/switch:outline-interactive-hover group-enabled/switch:group-selected/switch:group-focus-visible/switch:before:[background-color:var(--fg-accent-primary-hover)]',
      //hover
      'group-enabled/switch:group-selected/switch:group-hover/switch:bg-accent-primary-muted group-enabled/switch:group-selected/switch:group-hover/switch:outline-accent-primary-bold group-enabled/switch:group-selected/switch:group-hover/switch:before:[background-color:var(--fg-accent-primary-hover)]',
      //pressed
      'group-enabled/switch:group-selected/switch:group-pressed/switch:bg-accent-primary-pressed group-enabled/switch:group-selected/switch:group-pressed/switch:outline-accent-primary-pressed group-enabled/switch:group-selected/switch:group-pressed/switch:before:[background-color:var(--fg-accent-primary-pressed)]',
      //disabled
      'group-disabled/switch:bg-interactive-disabled group-disabled/switch:outline-interactive-disabled group-disabled/switch:before:[background-color:var(--fg-disabled)]',
    ],
    label: ['fg-primary-bold text-body-s', 'group-disabled/switch:fg-disabled'],
  },
  variants: {
    labelPosition: {
      start: {
        switch: 'flex-row-reverse',
      },
      end: {
        switch: 'flex-row',
      },
    },
  },
});
