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
import type { ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

export const MenuStylesDefaults = {
  variant: 'cozy',
  color: 'info',
} as const;

export const MenuStyles = tv({
  slots: {
    menu: 'group/menu mt-s overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static-light',
    icon: '[grid-area:icon]',
    item: [
      'group/menu-item flex items-center gap-x-s px-s text-body-s',
      'grid grid-cols-[auto_auto_1fr_auto] [grid-template-areas:"icon_label_space_action"_"icon_description_space_action"]',
      'disabled:fg-disabled disabled:bg-transparent',
    ],
    label:
      'truncate [grid-area:label] group-not-has-[>_[slot=description]]/menu-item:row-span-full',
    description: [
      '[grid-area:description]',
      'fg-default-dark truncate text-body-xs',
      'group-hover/menu-item:fg-inverse-light group-focus/menu-item:fg-inverse-light',
      'group-disabled/menu-item:fg-disabled',
    ],
    more: '[grid-area:action]',
    sectionHeader: 'fg-default-dark px-s py-xs text-header-xs',
    separator: 'mx-3 my-1 border border-static-light',
    hotkey: [
      '[grid-area:action]',
      'group-hover/menu-item:fg-inverse-light group-focus/menu-item:fg-inverse-light',
      'group-disabled/menu-item:fg-disabled',
    ],
    popover: '',
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
    color: {
      info: {
        item: [
          'fg-default-light hover:fg-inverse-light focus:fg-inverse-light open:fg-inverse-light selected:fg-inverse-light',
          'selected:bg-highlight-bold open:bg-highlight-bold hover:bg-highlight-bold focus:bg-highlight-bold',
        ],
      },
      serious: {
        item: [
          'fg-serious hover:fg-inverse-light focus:fg-inverse-light open:fg-inverse-light selected:fg-inverse-light',
          'selected:bg-serious-bold open:bg-serious-bold hover:bg-serious-bold focus:bg-serious-bold',
        ],
      },
    },
  },
  defaultVariants: MenuStylesDefaults,
});

export type MenuStyleVariants = VariantProps<typeof MenuStyles> & {
  prefixIcon?: ReactNode;
};
