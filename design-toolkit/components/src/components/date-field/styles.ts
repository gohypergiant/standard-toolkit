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

export const DateFieldStylesDefault = {
  size: 'medium',
} as const;

export const DateFieldStyles = tv({
  slots: {
    field: 'group/date-field flex flex-col gap-xs',
    dateInput: [
      'group/date-field flex w-full gap-xs rounded-medium px-s py-xs font-display outline outline-interactive',
      'disabled:text-disabled disabled:outline-interactive-disabled disabled:placeholder:text-disabled',
      'text-default-light placeholder:text-default-dark focus-within:outline-highlight hover:outline-interactive-hover',
      'invalid:outline-serious',
      'size-medium:pl-[32px] size-medium:text-body-s',
      'size-small:text-body-xs',
    ],
    dateInputContainer: 'relative flex',
    icon: [
      '-translate-y-1/2 absolute top-1/2 left-s text-default-light',
      'group-disabled/date-field:text-disabled',
    ],
    descriptionText: [
      'fg-default-dark text-body-xs empty:hidden',
      'group-disabled/date-field:fg-disabled',
    ],
    error: 'fg-serious text-body-xs empty:hidden',
    dateSegment:
      'focus:bg-highlight focus:text-inverse-light focus:outline-none',
  },
  defaultVariants: DateFieldStylesDefault,
});
