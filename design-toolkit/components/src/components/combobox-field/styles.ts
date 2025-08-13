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

export const ComboBoxStyles = tv({
  slots: {
    field: 'group/combobox-field flex flex-col gap-xs',
    label: '',
    control: [
      'flex items-center rounded-medium px-s py-xs outline',
      'group-size-medium/combobox-field:min-w-[160px] group-size-medium/combobox-field:max-w-[400px]',
      'group-size-small/combobox-field:min-w-[80px] group-size-small/combobox-field:max-w-[200px]',
      'group-enabled/combobox-field:fg-default-light group-enabled/combobox-field:outline-interactive',
      'group-enabled/combobox-field:placeholder:fg-default-dark',
      'group-enabled/combobox-field:focus-within:outline-highlight',
      'group-enabled/combobox-field:hover:outline-interactive-hover',
      'group-enabled/combobox-field:group-invalid/combobox-field:outline-serious',
      'group-disabled/combobox-field:fg-disabled group-disabled/combobox-field:outline-interactive-disabled',
    ],
    input: [
      'grow font-display outline-none',
      'group-size-medium/combobox-field:text-body-s',
      'group-size-small/combobox-field:text-body-xs',
    ],
    trigger: [
      'fg-default-light',
      'group-open/combobox-field:rotate-180 group-open/combobox-field:transform',
      'group-disabled/combobox-field:fg-disabled',
    ],
    description: [
      'fg-default-dark text-body-xs',
      'group-disabled/combobox-field:fg-disabled',
    ],
    error: 'fg-serious text-body-xs',
    popover: '-ml-s min-w-[calc(var(--trigger-width)+(var(--spacing-s)*2))]',
  },
});
