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

export const SelectFieldStyles = tv({
  slots: {
    field: 'group/select-field',
    trigger: [
      'justify-between',
      'size-medium:py-xs group-size-medium/select-field:min-w-[220px]',
      'group-size-small/select-field:fit-content size-small:py-xxs',
      'group-invalid/select-field:enabled:outline-serious-bold',
      'group-focus-visible/select-field:enabled:outline-accent-primary-bold',
      'enabled:hover:color-mono-muted:bg-transparent enabled:hover:color-mono-muted:outline-1',
      'enabled:focus-visible:color-mono-muted:bg-transparent enabled:focus-visible:color-mono-muted:outline-1',
      'enabled:pressed:color-mono-muted:bg-transparent enabled:pressed:color-mono-muted:outline-1 enabled:pressed:color-mono-muted:outline-accent-primary-bold',
    ],
    label: '',
    description:
      'fg-primary-muted group-disabled/select-field:fg-disabled text-body-xs',
    error: 'fg-serious-bold text-body-xs',
    value: [
      'flex grow items-center font-display',
      'group-size-small/select-field:gap-xs group-size-small/select-field:text-body-xs',
      'group-size-medium/select-field:gap-s group-size-medium/select-field:text-body-s',
    ],
  },
});
