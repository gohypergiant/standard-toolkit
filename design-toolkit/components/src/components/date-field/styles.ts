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

export const DateFieldStyles = tv({
  base: 'flex w-full gap-xs rounded-medium px-s py-xs font-display outline outline-interactive',
  variants: {
    isDisabled: {
      true: 'text-disabled outline-interactive-disabled placeholder:text-disabled',
      false:
        'text-default-light placeholder:text-default-dark focus-within:outline-highlight hover:outline-interactive-hover',
    },
    isInvalid: {
      true: 'outline-serious',
    },
    isReadOnly: {
      true: 'rounded-none p-0 outline-none',
    },
    size: {
      medium: ['text-body-s', 'pl-[32px]'],
      small: 'text-body-xs',
    },
  },
  compoundVariants: [
    {
      isDisabled: true,
      isInvalid: true,
      className: 'outline-interactive-disabled',
    },
    {
      isDisabled: false,
      size: 'medium',
    },
  ],
  defaultVariants: {
    size: 'medium',
  },
});
