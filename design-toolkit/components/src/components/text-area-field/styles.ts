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

export const TextAreaStyles = tv({
  slots: {
    field: 'group/text-area-field flex flex-col gap-xs',
    label: '',
    input: [
      'block w-full rounded-medium p-s font-display text-default-light outline outline-interactive placeholder:text-default-dark',
      'group-size-medium/text-area-field:text-body-s group-size-small/text-area-field:text-body-xs',
      'group-enabled/text-area-field:focus:outline-highlight',
      'group-enabled/text-area-field:hover:outline-interactive-hover',
      'group-enabled/text-area-field:group-invalid/text-area-field:outline-serious',
      'group-disabled/text-area-field:text-disabled group-disabled/text-area-field:outline-interactive-disabled group-disabled/text-area-field:placeholder:text-disabled',
    ],
    description: [
      'fg-default-dark text-body-xs',
      'group-disabled/text-area-field:fg-disabled',
    ],
    error: 'fg-serious text-body-xs',
  },
});
