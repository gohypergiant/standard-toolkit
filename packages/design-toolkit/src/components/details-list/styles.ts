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

export const DetailsListStylesDefaults = {
  align: 'justify',
} as const;

export const DetailsListStyles = tv({
  slots: {
    list: 'grid grid-cols-[auto_1fr] gap-x-m font-display text-body-m',
    label: 'fg-primary-muted col-start-1',
    value: 'fg-primary-bold col-start-2',
  },
  variants: {
    align: {
      left: { label: 'text-left', value: 'text-left' },
      center: { label: 'text-right', value: 'text-left' },
      justify: { label: 'text-left', value: 'text-right' },
    },
  },
  defaultVariants: DetailsListStylesDefaults,
});
