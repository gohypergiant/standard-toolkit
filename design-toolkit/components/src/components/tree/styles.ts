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
    tree: 'overflow-auto outline-hidden',
    item: [
      'group/tree-item rounded-medium hover:bg-interactive-hover-dark',
      'data-[drop-target=true]:border data-[drop-target=true]:border-highlight-hover data-[drop-target=true]:bg-highlight/20',
    ],
    content: [
      'flex items-center justify-items-start px-xs',
      'overflow-x group w-full outline-hidden',
    ],
    display:
      'grid flex-1 grid-cols-[auto_auto_1fr_auto] items-center [grid-template-areas:"icon_label_space_action"_"icon_description_space_action"]',
    icon: '[grid-area:icon]',
    label: 'not-has-[+[data-slot=description]]:row-span-full [grid-area:label]',
    description: 'fg-default-dark text-body-s [grid-area:description]',
    actions: 'flex shrink-0 items-center [grid-area:action]',
    spacing: '',
    visibility: '',
    expansion: '',
    drag: '',
  },
  variants: {
    variant: {
      cozy: {
        content: 'min-h-[42px] text-header-m',
        display: 'gap-x-s px-xs',
        label: 'gap-xs',
        actions: 'gap-x-xs',
        spacing: 'min-h-[44px] w-[28px]',
        item: 'min-h-s',
      },
      compact: {
        content: 'min-h-[36px] gap-xs text-header-s',
        display: 'gap-x-s px-xxs',
        label: 'gap-xs',
        actions: 'gap-x-xxs',
        spacing: 'min-h-[38px] w-[20px]',
        item: 'min-h-l',
      },
      crammed: {
        content: 'gap-xs text-header-s',
        display: 'gap-x-xs px-xxs',
        label: 'gap-xs',
        actions: 'gap-x-xxs',
        spacing: 'min-h-[24px] w-[20px]',
        item: 'min-h-s',
      },
    },
    isDisabled: {
      true: {
        item: 'cursor-not-allowed border-none hover:bg-transparent data-[drop-target=true]:bg-transparent',
      },
    },
    isViewable: {
      false: '',
    },
    isVisible: {
      false: '',
    },
  },
  compoundVariants: [
    {
      isViewable: true,
      isVisible: true,
      className: {
        content: 'fg-default-light',
        visibility: 'fg-default-light',
        expansion: 'fg-default-light',
        drag: 'fg-default-light',
      },
    },
    {
      isViewable: false,
      isVisible: true,
      className: {
        content: 'fg-default-dark',
        visibility: 'enabled:fg-default-dark',
        expansion: 'enabled:fg-default-dark',
        drag: 'enabled:fg-default-dark',
      },
    },
    {
      isViewable: true,
      isVisible: false,
      className: {
        content: 'fg-default-dark',
        visibility: 'enabled:fg-default-dark',
        expansion: 'enabled:fg-default-dark',
        drag: 'enabled:fg-default-dark',
      },
    },
    {
      isViewable: false,
      isVisible: false,
      className: {
        content: 'fg-default-dark',
        visibility: 'enabled:fg-default-dark',
        expansion: 'enabled:fg-default-dark',
        drag: 'enabled:fg-default-dark',
      },
    },
  ],
  defaultVariants: TreeStylesDefaults,
});

export type TreeStyleVariants = VariantProps<typeof TreeStyles>;
