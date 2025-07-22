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

import { type VariantProps, tv } from 'tailwind-variants';

export const OptionsStyles = tv({
  slots: {
    list: 'max-h-[200px] overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static-light',
    section: 'mt-s border-default-dark border-t first:border-none',
    sectionHeader: 'm-xs my-s text-default-dark text-header-xs',
    item: [
      'fg-default-light flex items-center gap-s p-s text-body-s ',
      '**:data-[slot=description]:fg-default-dark **:data-[slot=description]:text-body-xs',
      'hover:fg-inverse-light hover:**:data-[slot=description]:fg-inverse-light',
      'focus:fg-inverse-light focus:**:data-[slot=description]:fg-inverse-light ',
      'disabled:fg-disabled disabled:**:data-[slot=description]:fg-disabled disabled:bg-transparent',
      'hover:bg-highlight-bold focus:bg-highlight-bold',
    ],
    itemContent: 'flex min-w-0 flex-auto flex-col gap-xxs',
    itemIcon: 'flex w-[16px] items-center',
  },
  variants: {
    type: {
      destructive: {
        item: 'hover:bg-serious-bold focus:bg-serious-bold',
      },
      default: {
        item: 'hover:bg-highlight-bold focus:bg-highlight-bold',
      },
    },
    size: {
      large: {
        item: 'pt-s pb-s',
      },
      small: { item: 'pt-xs pb-xs' },
    },
  },
  defaultVariants: {
    size: 'large',
  },
});

export type OptionsStyleVariants = VariantProps<typeof OptionsStyles>;
