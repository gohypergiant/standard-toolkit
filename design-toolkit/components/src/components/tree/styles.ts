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
import type { VariantProps } from 'tailwind-variants';

export const TreeStylesDefaults = {
  variant: 'cozy',
  hasRuleLines: true,
  selectionType: 'visibility',
} as const;

export const TreeStyles = tv({
  slots: {
    tree: 'fg-default-light flex flex-col overflow-auto outline-hidden',
    lines: 'relative self-stretch',
    item: 'fg-default-light overflow-x group flex w-full items-center justify-items-start rounded-medium outline-hidden hover:bg-interactive-hover-dark',
    label: 'flex flex-1 items-center',
    selection:
      'dtk-selected:fg-default-light dtk-selected:hover:bg-transparent',
    expansion: 'fg-default-light cursor-pointer focus:bg-transparent',
  },
  variants: {
    variant: {
      cozy: {
        tree: 'text-body-m',
        lines: 'group-data-[variant=cozy]:w-xl',
        item: 'icon-size-xl gap-s text-header-m',
        label: 'min-h-xxl gap-xs',
      },
      compact: {
        tree: 'text-body-s',
        lines: 'group-data-[variant=compact]:w-l',
        item: 'icon-size-l gap-xs text-header-s',
        label: 'min-h-[36px] gap-xs',
      },
      tight: {
        tree: 'text-body-s',
        lines: 'group-data-[variant=tight]:w-l',
        item: 'icon-size-l gap-xs text-header-s',
        label: 'min-h-xl gap-xs',
      },
    },
    hasRuleLines: {
      false: {
        lines: 'bg-none',
      },
    },
    isBranch: {
      true: {
        lines: 'branching-line',
      },
      false: {
        lines: 'vert-line',
      },
    },
    selectionType: {
      visibility: {},
      checkbox: {},
      none: {},
    },
    isDisabled: {
      true: {
        expansion: 'fg-default-dark',
        selection:
          'not-dtk-selected:bg-transparent not-dtk-selected:hover:bg-interactive-transparent',
      },
    },
    isParentVisible: {
      false: {
        selection:
          'fg-default-dark not-dtk-selected:bg-transparent not-dtk-selected:hover:bg-interactive-transparent',
      },
    },
  },
  defaultVariants: TreeStylesDefaults,
});

export type TreeStyleVariants = VariantProps<typeof TreeStyles>;
