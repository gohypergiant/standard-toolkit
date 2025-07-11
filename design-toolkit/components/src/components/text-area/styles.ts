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

export const TextAreaStylesDefaults = {
  size: 'medium',
  isDisabled: false,
  isInvalid: false,
  isReadOnly: false,
  isClearable: false,
  selectOnFocus: false,
} as const;

export const TextAreaStyles = tv({
  slots: {
    field: 'flex flex-col gap-xs',
    input: [
      'block w-full rounded-medium p-s font-display outline outline-interactive',
      'text-default-light placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
    ],
    label: '',
    description: 'fg-default-dark text-body-xs empty:hidden',
    error: 'fg-serious text-body-xs empty:hidden',
  },
  variants: {
    size: {
      medium: {
        input: 'text-body-s',
      },
      small: {
        input: 'text-body-xs',
      },
    },
    isInvalid: {
      true: {
        input: 'outline-serious',
      },
      false: {},
    },
    isDisabled: {
      true: {
        input:
          'text-disabled outline-interactive-disabled placeholder:text-disabled',
        description: 'fg-disabled',
      },
      false: {},
    },
    isReadOnly: {
      true: {
        input: 'rounded-none p-0 outline-none',
      },
      false: {},
    },
    isClearable: {
      true: {
        input: 'pr-xl',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      isClearable: true,
      isDisabled: false,
      size: 'medium',
      className: {
        input: 'pr-xl',
      },
    },
  ],
  defaultVariants: TextAreaStylesDefaults,
});

export type TextAreaStyleVariants = VariantProps<typeof TextAreaStyles>;
