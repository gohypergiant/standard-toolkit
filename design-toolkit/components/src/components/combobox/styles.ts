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

export const ComboBoxStylesDefault = {
  size: 'medium',
} as const;

export const ComboBoxStyles = tv({
  slots: {
    textFieldBase: [
      'group/combo-box block w-full rounded-medium py-xs pr-[32px] pl-s font-display outline outline-interactive',
      'text-default-light placeholder:text-default-dark hover:outline-interactive-hover focus:outline-highlight',
      'disabled:text-disabled disabled:outline-interactive-disabled disabled:placeholder:text-disabled',
      'invalid:outline-serious',
      'size-medium:text-body-s',
      'size-small:text-body-xs',
    ],
    comboBox: 'flex flex-col gap-xs',
    input: 'relative flex items-center',
    button: [
      'fg-default-light absolute right-xs transform',
      'disabled:fg-disabled',
      'open:rotate-180',
    ],
    descriptionText: [
      'fg-default-dark text-body-xs empty:hidden',
      'group-disabled/combo-box:fg-disabled',
    ],
    error: 'fg-serious text-body-xs empty:hidden',
    popOver: 'w-(--trigger-width)',
  },
  defaultVariants: ComboBoxStylesDefault,
});
