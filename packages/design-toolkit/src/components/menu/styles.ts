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

export const MenuStylesDefaults = {
  variant: 'cozy',
} as const;

export const MenuStyles = tv({
  slots: {
    menu: 'group/menu overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static',
    item: [
      'group/menu-item relative flex cursor-pointer items-center gap-x-s px-s text-body-s outline outline-transparent',
      'grid grid-cols-[auto_auto_1fr_auto] [grid-template-areas:"icon_label_space_action"_"icon_description_space_action"]',
      'before:pointer-events-none before:absolute before:top-0 before:left-0 before:h-full before:w-[4px]',
      'enabled:fg-primary-bold',
      // info
      'color-info:enabled:focus-visible:bg-accent-primary-muted',
      'color-info:enabled:hover:bg-accent-primary-muted',
      'color-info:enabled:open:bg-accent-primary-muted',
      'color-info:enabled:selected:bg-accent-primary-muted',
      'color-info:enabled:pressed:fg-accent-primary-bold color-info:enabled:pressed:bg-accent-primary-pressed',
      // info + selected
      'color-info:enabled:selected:bg-accent-primary-muted color-info:enabled:selected:before:bg-accent-primary-bold',
      'color-info:enabled:selected:hover:fg-a11y-on-accent color-info:enabled:selected:hover:bg-accent-primary-bold color-info:enabled:selected:hover:before:bg-(--outline-accent-primary-hover)',
      'color-info:enabled:selected:focus-visible:fg-a11y-on-accent color-info:enabled:selected:focus-visible:bg-accent-primary-bold color-info:enabled:selected:hover:before:bg-(--outline-accent-primary-hover)',
      'color-info:enabled:selected:pressed:fg-accent-primary-bold color-info:enabled:selected:pressed:bg-accent-primary-pressed color-info:enabled:selected:pressed:before:bg-accent-primary-pressed color-info:enabled:selected:hover:before:bg-(--outline-accent-primary-pressed)',
      // serious
      'color-serious:enabled:fg-serious-bold',
      'color-serious:enabled:focus-visible:fg-primary-bold color-serious:enabled:focus-visible:bg-serious-muted',
      'color-serious:enabled:hover:fg-primary-bold color-serious:enabled:hover:bg-serious-muted',
      'color-serious:enabled:open:bg-serious-muted',
      'color-serious:enabled:selected:bg-serious-muted',
      'color-serious:enabled:pressed:fg-serious-bold color-serious:enabled:pressed:bg-serious-pressed',
      // serious + selected
      'color-serious:enabled:selected:fg-primary-bold color-serious:enabled:selected:bg-serious-muted color-serious:enabled:selected:before:bg-serious-bold',
      'color-serious:enabled:selected:hover:fg-a11y-on-accent color-serious:enabled:selected:hover:bg-serious-bold color-serious:enabled:selected:hover:before:bg-(--outline-serious-hover)',
      'color-serious:enabled:selected:focus-visible:fg-a11y-on-accent color-serious:enabled:selected:focus-visible:bg-serious-bold color-serious:enabled:selected:focus-visible:before:bg-(--outline-serious-hover)',
      'color-serious:enabled:selected:pressed:fg-serious-bold color-serious:enabled:selected:pressed:bg-serious-pressed color-serious:enabled:selected:pressed:before:bg-(--outline-serious-pressed)',
      // critical
      'color-critical:enabled:fg-critical-bold',
      'color-critical:enabled:focus-visible:fg-primary-bold color-critical:enabled:focus-visible:bg-critical-muted',
      'color-critical:enabled:hover:fg-primary-bold color-critical:enabled:hover:bg-critical-muted',
      'color-critical:enabled:hover:fg-primary-bold color-critical:enabled:open:bg-critical-muted',
      'color-critical:enabled:pressed:fg-critical-bold color-critical:enabled:pressed:bg-critical-pressed',
      // critical + selected
      'color-critical:enabled:selected:fg-primary-bold color-critical:enabled:selected:bg-critical-muted',
      'color-critical:enabled:selected:bg-critical-muted color-critical:enabled:selected:before:bg-(--outline-critical-bold)',
      'color-critical:enabled:selected:hover:bg-critical-bold',
      'color-critical:enabled:selected:hover:fg-a11y-on-accent color-critical:enabled:selected:hover:bg-critical-bold',
      'color-critical:enabled:selected:focus-visible:fg-a11y-on-accent color-critical:enabled:selected:focus-visible:bg-critical-bold',
      'color-critical:enabled:selected:pressed:fg-critical-bold color-critical:enabled:selected:pressed:bg-critical-pressed color-critical:enabled:selected:pressed:before:bg-(--outline-critical-pressed)',

      'disabled:fg-disabled disabled:cursor-not-allowed disabled:bg-transparent',
      'disabled:selected:bg-interactive-disabled disabled:selected:before:bg-(--outline-interactive)',
    ],
    icon: '[grid-area:icon]',
    label:
      'truncate [grid-area:label] group-not-has-[>_[slot=description]]/menu-item:row-span-full',
    description: [
      '[grid-area:description]',
      'fg-primary-muted truncate text-body-xs',
      'group-hover/menu-item:fg-primary-bold group-focus-visible/menu-item:fg-primary-bold',
      'group-hover/menu-item:group-selected/menu-item:fg-a11y-on-accent',
      'group-focus-visible/menu-item:group-selected/menu-item:fg-a11y-on-accent',
      'group-focus-visible/menu-item:group-selected/menu-item:fg-a11y-on-accent',
      'group-disabled/menu-item:fg-disabled',
      // info
      'group-enabled/menu-item:group-pressed/menu-item:group-color-info/menu-item:fg-accent-primary-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-pressed/menu-item:group-color-info/menu-item:fg-accent-primary-bold',
      // serious
      'group-enabled/menu-item:group-hover/menu-item:group-color-serious/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-focus-visible/menu-item:group-color-serious/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-pressed/menu-item:group-color-serious/menu-item:fg-serious-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-color-serious/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-hover/menu-item:group-color-serious/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-focus-visible/menu-item:group-color-serious/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-pressed/menu-item:group-color-serious/menu-item:fg-serious-bold',
      // critical
      'group-enabled/menu-item:group-hover/menu-item:group-color-critical/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-focus-visible/menu-item:group-color-critical/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-pressed/menu-item:group-color-critical/menu-item:fg-critical-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-color-critical/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-hover/menu-item:group-color-critical/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-focus-visible/menu-item:group-color-critical/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-pressed/menu-item:group-color-critical/menu-item:fg-critical-bold',
    ],
    more: '[grid-area:action]',
    section: '',
    header: 'fg-primary-muted px-s py-xs text-header-xs',
    separator: 'mx-3 my-1 outline outline-static',
    hotkey: [
      '[grid-area:action]',
      'group-hover/menu-item:fg-primary-bold group-focus-visible/menu-item:fg-primary-bold',
      'group-disabled/menu-item:fg-disabled',
      // info
      'group-enabled/menu-item:group-pressed/menu-item:group-color-info/menu-item:fg-accent-primary-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-hover/menu-item:group-color-info/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-focus-visible/menu-item:group-color-info/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-pressed/menu-item:group-color-info/menu-item:fg-accent-primary-bold',
      // serious
      'group-enabled/menu-item:group-color-serious/menu-item:fg-serious-bold',
      'group-enabled/menu-item:group-hover/menu-item:group-color-serious/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-focus-visible/menu-item:group-color-serious/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-pressed/menu-item:group-color-serious/menu-item:fg-serious-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-hover/menu-item:group-color-serious/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-focus-visible/menu-item:group-color-serious/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-pressed/menu-item:group-color-serious/menu-item:fg-serious-bold',
      // critical
      'group-enabled/menu-item:group-color-critical/menu-item:fg-critical-bold',
      'group-enabled/menu-item:group-hover/menu-item:group-color-critical/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-focus-visible/menu-item:group-color-critical/menu-item:fg-primary-bold',
      'group-enabled/menu-item:group-pressed/menu-item:group-color-critical/menu-item:fg-critical-bold',
      'group-enabled/menu-item:group-selected/menu-item:group-hover/menu-item:group-color-critical/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-focus-visible/menu-item:group-color-critical/menu-item:fg-a11y-on-accent',
      'group-enabled/menu-item:group-selected/menu-item:group-pressed/menu-item:group-color-critical/menu-item:fg-critical-bold',
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
