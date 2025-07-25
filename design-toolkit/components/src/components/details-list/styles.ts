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

export const DetailsListStyles = tv({
  slots: {
    label: 'fg-default-dark col-start-1',
    list: 'fg-default-light grid grid-cols-[auto_1fr]',
    value: 'col-start-2',
  },
  variants: {
    spacing: {
      large: { list: 'gap-x-l gap-y-m' },
      medium: { list: 'gap-x-m gap-y-s' },
      small: { list: 'gap-x-s gap-y-0' },
    },
    justifyLabel: {
      left: { label: 'text-left' },
      center: { label: 'text-center' },
      right: { label: 'text-right' },
    },
    justifyValue: {
      left: { value: 'text-left' },
      center: { value: 'text-center' },
      right: { value: 'text-right' },
    },
  },
  defaultVariants: {
    spacing: 'medium',
    justifyLabel: 'left',
    justifyValue: 'left',
  },
});
