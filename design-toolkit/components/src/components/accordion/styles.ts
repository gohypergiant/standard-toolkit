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

export const AccordionStylesDefaults = {
  variant: 'cozy',
  isDisabled: false,
  isExpanded: false,
} as const;

export const AccordionStyles = tv({
  slots: {
    group: 'flex w-full flex-col',
    accordion: 'group flex w-full flex-col bg-transparent',
    header:
      'fg-default-light flex w-full items-center gap-s rounded-medium p-s outline-none',
    heading: 'grow',
    trigger: [
      'flex w-full cursor-pointer dtk-disabled:cursor-default items-center rounded-medium outline-none',
    ],
    panel: 'p-s',
  },
  variants: {
    variant: {
      cozy: {
        trigger: 'gap-s text-header-m',
      },
      compact: {
        trigger: 'gap-xs text-header-s',
      },
    },
    isDisabled: {
      false: {
        header:
          'focus-within:bg-interactive-hover-dark hover:bg-interactive-hover-dark',
      },
      true: {
        header:
          'fg-disabled cursor-default focus-within:bg-transparent hover:bg-transparent',
      },
    },
    isExpanded: {
      false: {},
      true: {},
    },
  },
  defaultVariants: AccordionStylesDefaults,
});

export type AccordionStyleVariants = VariantProps<typeof AccordionStyles>;
