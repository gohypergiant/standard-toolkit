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
    menu: 'mt-s overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static-light',
    icon: '[grid-area:icon]',
    item: [
      'group flex items-center gap-x-s px-s text-body-s',
      'grid grid-cols-[auto_auto_1fr_auto] [grid-template-areas:"icon_label_space_action"_"icon_description_space_action"]',
      'data-[disabled]:fg-disabled data-[disabled]:bg-transparent',
    ],
    label:
      'truncate [grid-area:label] group-not-has-data-[slot=description]:row-span-full',
    description:
      'fg-default-dark group-hover:fg-inverse-light group-data-[focused]:fg-inverse-light group-data-[disabled]:fg-disabled truncate text-body-xs [grid-area:description]',
    more: '[grid-area:action]',
    sectionHeader: 'fg-default-dark px-s py-xs text-header-xs',
    separator: 'mx-3 my-1 border border-static-light',
    keyboard: '[grid-area:action]',
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
          'fg-default-light hover:fg-inverse-light data-[focused]:fg-inverse-light data-[open]:fg-inverse-light data-[selected]:fg-inverse-light',
          'hover:bg-highlight-bold data-[focused]:bg-highlight-bold data-[open]:bg-highlight-bold data-[selected]:bg-highlight-bold',
        ],
      },
      serious: {
        item: [
          'fg-serious hover:fg-inverse-light data-[focused]:fg-inverse-light data-[open]:fg-inverse-light data-[selected]:fg-inverse-light',
          'hover:bg-serious-bold data-[focused]:bg-serious-bold data-[open]:bg-serious-bold data-[selected]:bg-serious-bold',
        ],
      },
    },
  },
  defaultVariants: MenuStylesDefaults,
});

export type MenuStyleVariants = VariantProps<typeof MenuStyles> & {
  prefixIcon?: ReactNode;
};
