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
} as const;

export const TreeStyles = tv({
  slots: {
    tree: 'fg-default-light overflow-auto outline-hidden',
    item: [
      'flex items-center justify-items-start rounded-medium border border-transparent px-xs',
      'fg-default-light overflow-x group w-full outline-hidden',
      'data-[drop-target=true]:border-highlight-hover',
      ' hover:bg-interactive-hover-dark',
    ],
    visibility: 'fg-default-light',
    expansion: 'fg-default-light cursor-pointer focus:bg-transparent',
    lines: 'relative self-stretch',
    display:
      'grid flex-1 grid-cols-[auto_auto_1fr_auto] items-center [grid-template-areas:"icon_label_space_action"_"icon_description_space_action"]',
    icon: '[grid-area:icon]',
    label: '[grid-area:label]',
    description: 'fg-default-dark text-body-s [grid-area:description]',
    actions: '[grid-area:action]',
    selection:
      'dtk-selected:fg-default-light dtk-selected:hover:bg-transparent',
  },
  variants: {
    variant: {
      cozy: {
        tree: 'text-body-m',
        item: 'icon-size-xl gap-s text-header-m',
        display: 'gap-x-s',
        label: 'gap-xs',
      },
      compact: {
        tree: 'text-body-s',
        item: 'icon-size-l gap-xs text-header-s',
        display: 'gap-x-xs',
        label: 'gap-xs',
      },
      tight: {
        tree: 'text-body-s',
        item: 'icon-size-l gap-xs text-header-s',
        display: 'gap-x-xs',
        label: 'gap-xs',
      },
    },
    hasRuleLines: {
      false: {
        lines: 'bg-none',
      },
    },
    isBranch: {
      true: {
        lines: 'branching-line [background-repeat:repeat-y,no-repeat]',
      },
      false: {
        lines: 'vert-line',
      },
    },
    isDisabled: {
      true: {
        expansion: 'fg-default-dark',
        selection:
          'not-dtk-selected:bg-transparent not-dtk-selected:hover:bg-interactive-transparent',
      },
    },
    isViewable: {
      false: {
        visibility: 'fg-default-dark',
      },
    },
  },
  defaultVariants: TreeStylesDefaults,
});

export type TreeStyleVariants = VariantProps<typeof TreeStyles>;
