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

export const SearchFieldStylesDefaults = {
  variant: 'outlined',
} as const;

export const SearchFieldStyles = tv({
  slots: {
    clearButton: [
      'fg-default-dark hover:fg-interactive-hover absolute top-[6px] right-[8px] cursor-pointer',
      'group-empty/search-field:hidden group-disabled/search-field:hidden',
    ],
    input: [
      'hide-cancel block w-full rounded-round p-s pr-[30px] pl-[35px] font-display text-body-s text-default-light outline',
      'placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
      'disabled:text-disabled disabled:outline-interactive-disabled disabled:placeholder:text-disabled',
    ],
    loadingIcon:
      'fg-interactive-hover absolute top-[6px] right-[8px] animate-spin',
    searchField: 'group/search-field relative',
    searchIcon: 'fg-interactive-hover absolute top-[6px] left-[7px]',
  },
  variants: {
    variant: {
      filled: {
        input: 'bg-surface-raised outline-static-dark',
      },
      outlined: {
        input: 'outline-interactive',
      },
    },
  },
  defaultVariants: SearchFieldStylesDefaults,
});
