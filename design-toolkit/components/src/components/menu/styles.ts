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

export const MenuStylesDefaults = {
  variant: 'cozy',
} as const;

export const MenuStyles = tv({
  slots: {
    menu: 'group/menu overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static',
    item: [
      'group/menu-item flex cursor-pointer items-center gap-x-s px-s text-body-s outline outline-transparent',
      'grid grid-cols-[auto_auto_1fr_auto] [grid-template-areas:"icon_label_space_action"_"icon_description_space_action"]',
      'enabled:focus-visible:outline-interactive-hover',

      // Info
      'color-info:enabled:fg-primary-bold',
      'color-info:enabled:focus-visible:fg-a11y-on-accent color-info:enabled:focus-visible:bg-accent-primary-bold',
      'color-info:enabled:hover:fg-a11y-on-accent color-info:enabled:hover:bg-accent-primary-bold',
      'color-info:enabled:open:fg-a11y-on-accent color-info:enabled:open:bg-accent-primary-bold',
      'color-info:enabled:selected:fg-a11y-on-accent color-info:enabled:selected:bg-accent-primary-bold',

      // Serious
      'color-serious:enabled:fg-serious-bold',
      'color-serious:enabled:focus-visible:fg-a11y-on-utility color-serious:enabled:focus-visible:bg-serious-bold',
      'color-serious:enabled:hover:fg-a11y-on-utility color-serious:enabled:hover:bg-serious-bold',
      'color-serious:enabled:open:fg-a11y-on-utility color-serious:enabled:open:bg-serious-bold',
      'color-serious:enabled:selected:fg-a11y-on-utility color-serious:enabled:selected:bg-serious-bold',

      'disabled:fg-disabled disabled:bg-transparent disabled:cursor-not-allowed',
    ],
    icon: '[grid-area:icon]',
    label:
      'truncate [grid-area:label] group-not-has-[>_[slot=description]]/menu-item:row-span-full',
    description: [
      '[grid-area:description]',
      'fg-primary-muted truncate text-body-xs',
      'group-hover/menu-item:fg-a11y-on-accent group-focus-visible/menu-item:fg-a11y-on-accent',
      'group-disabled/menu-item:fg-disabled',
    ],
    more: '[grid-area:action]',
    section: '',
    header: 'fg-primary-muted px-s py-xs text-header-xs',
    separator: 'mx-3 my-1 outline outline-static',
    hotkey: [
      '[grid-area:action]',
      'group-hover/menu-item:fg-a11y-on-accent group-focus-visible/menu-item:fg-a11y-on-accent',
      'group-disabled/menu-item:fg-disabled',
    ],
    popover: 'outline-none',
  },
  variants: {
    variant: {
      cozy: {
        item: 'pt-s pb-s',
      },
      compact: {
        item: 'pt-xs pb-xs',
      },
    },
  },
  defaultVariants: MenuStylesDefaults,
});
