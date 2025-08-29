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

export const DateFieldStylesDefaults = {
  shortMonth: true,
} as const;

export const DateFieldStyles = tv({
  slots: {
    field: 'group/date-field flex flex-col gap-xs',
    label: '',
    control: [
      'flex w-full items-center gap-xs rounded-medium px-s py-xs font-display outline outline-interactive',
      'group-size-medium/date-field:text-body-s',
      'group-size-small/date-field:text-body-xs',
      'fg-primary-bold',
      'hover:outline-interactive-hover',
      'focus-visible-within:outline-accent-primary-bold',
      'group-invalid/date-field:outline-serious-bold',
      'group-disabled/date-field:placeholder:fg-disabled group-disabled/date-field:fg-disabled group-disabled/date-field:outline-interactive-disabled',
    ],
    input: 'flex gap-xs',
    segment: [
      'text-right',
      'placeholder-shown:fg-primary-muted',
      'focus-visible:fg-a11y-on-accent focus-visible:bg-accent-primary-bold focus-visible:outline-none',
    ],
    description: [
      'fg-primary-muted text-body-xs',
      'group-disabled/date-field:fg-disabled',
    ],
    error: 'fg-serious-bold text-body-xs',
  },
  variants: {
    shortMonth: {
      true: {
        segment: [
          'group-size-medium/date-field:type-month:w-[calc(3ch+(3*var(--typography-body-s-spacing)))]',
          'group-size-small/date-field:type-month:w-[calc(3ch+(3*var(--typography-body-xs-spacing)))]',
        ],
      },
      false: {
        segment: [
          'group-size-medium/date-field:type-month:w-[calc(2ch+(2*var(--typography-body-s-spacing)))]',
          'group-size-small/date-field:type-month:w-[calc(2ch+(2*var(--typography-body-xs-spacing)))]',
        ],
      },
    },
  },
  defaultVariants: DateFieldStylesDefaults,
});
