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

import { tv } from 'tailwind-variants';

export const PaginationStylesDefaults = {
  variant: 'default',
} as const;

export const PaginationStyles = tv({
  slots: {
    wrapper: 'flex items-center gap-xxs',
    pageToggleButton: 'min-h-[32px] min-w-[32px] rounded-medium',
    pageEllipsis: 'text-default-light',
    pageValueButton: 'min-h-[32px] min-w-[32px] rounded-medium',
    pageInputWrapper: 'flex items-center gap-s text-default-light',
    pageInput:
      'w-16 rounded-medium border border-interactive px-s py-xs font-display',
  },
  variants: {
    variant: {
      selected: {
        pageValueButton:
          'border-1 border-highlight-bold text-highlight-bold data-[selected=true]:disabled:border-highlight-bold data-[selected=true]:disabled:text-highlight-bold',
      },
      default: {
        pageValueButton:
          'border-1 border-transparent bg-transparent px-s font-display text-default-light hover:bg-interactive-hover-dark focus:bg-interactive-hover-dark ',
      },
    },
  },
  defaultVariants: PaginationStylesDefaults,
});
