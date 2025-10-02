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

export const OptionsStyles = tv({
  slots: {
    list: 'group/options max-h-[200px] overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static',
    section: 'mt-s',
    header: 'fg-primary-muted m-xs my-s text-header-xs',
    item: [
      'group/options-item fg-primary-bold flex items-center gap-s p-s text-body-s outline outline-transparent',
      'group-size-small/options:pt-xs group-size-small/options:pb-xs',
      'group-size-large/options:pt-s group-size-large/options:pb-s',
      'enabled:cursor-pointer',
      'enabled:hover:fg-a11y-on-accent',
      'enabled:focus-visible:fg-a11y-on-accent enabled:focus-visible:outline-interactive-hover',
      'enabled:focus-visible:color-info:bg-accent-primary-bold',
      'enabled:hover:color-info:bg-accent-primary-bold',
      'enabled:hover:color-serious:bg-serious-bold',
      'enabled:focus-visible:color-serious:bg-serious-bold',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:bg-transparent',
    ],
    content: 'flex min-w-0 flex-auto flex-col gap-xxs',
    icon: [
      'group-enabled/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-a11y-on-accent',
    ],
    label: [
      'truncate',
      'group-enabled/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-a11y-on-accent',
    ],
    description: [
      'group-enabled/options-item:fg-primary-muted truncate text-body-xs',
      'group-enabled/options-item:group-hover/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-focus-visible/options-item:fg-a11y-on-accent',
      'group-disabled/options-item:fg-disabled',
    ],
  },
});
