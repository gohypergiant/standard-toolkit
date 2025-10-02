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

export const TimeFieldSylesDefaults = {
  isDisabled: false,
} as const;

export const TimeFieldStyles = tv({
  slots: {
    field: 'group/time-field flex flex-col gap-xs',
    label: '',
    control: [
      'flex w-full items-center gap-xs rounded-medium px-s py-xs font-display outline outline-interactive',
      'group-size-medium/time-field:text-body-s',
      'group-size-small/time-field:text-body-xs',
      'fg-primary-bold',
      'hover:outline-interactive-hover',
      'focus-visible-within:outline-accent-primary-bold',
      'group-invalid/time-field:outline-serious-bold',
      'group-disabled/time-field:placeholder:fg-disabled group-disabled/time-field:fg-disabled group-disabled/time-field:outline-interactive-disabled',
    ],
    input: 'flex',
    segment: [
      'text-right',
      'placeholder-shown:fg-primary-muted',
      'focus-visible:fg-a11y-on-accent focus-visible:bg-accent-primary-bold focus-visible:outline-none',
    ],
    description: [
      'fg-primary-muted text-body-xs',
      'group-disabled/time-field:fg-disabled',
    ],
    error: 'fg-serious-bold text-body-xs',
  },
  defaultVariants: TimeFieldSylesDefaults,
});
