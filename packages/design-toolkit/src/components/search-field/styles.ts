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
    field: [
      'group/search-field fg-primary-bold flex items-center gap-s rounded-round p-s outline',
      'focus-visible-within:outline-accent-primary-bold',
      'hover:outline-interactive-hover',
      'pressed:outline-interactive-pressed',
      'disabled:fg-disabled disabled:placeholder:fg-disabled disabled:cursor-not-allowed disabled:outline-interactive-disabled',
    ],
    input: [
      'hide-cancel block w-full font-display text-body-s outline-none',
      'placeholder:fg-primary-muted',
      'disabled:cursor-not-allowed',
    ],
    clear: [
      'fg-info-bold cursor-pointer',
      'focus-visible:fg-info-hover',
      'hover:fg-info-hover',
      'group-empty/search-field:invisible group-disabled/search-field:invisible',
    ],
    loading: 'motion-safe:animate-spin',
    search: '',
  },
  variants: {
    variant: {
      filled: {
        field: 'bg-surface-raised outline-static',
      },
      outlined: {
        field: 'outline-interactive',
      },
    },
  },
  defaultVariants: SearchFieldStylesDefaults,
});
