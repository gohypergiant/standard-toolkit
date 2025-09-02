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

export const DialogStyles = tv({
  slots: {
    overlay: 'group/dialog absolute inset-0 flex items-center justify-center',
    modal: [
      'flex flex-col justify-center bg-surface-overlay align-start',
      'group-size-small/dialog:rounded-medium',
      'group-size-large/dialog:rounded-large',
      'shadow-elevation-overlay',
    ],
    dialog: [
      'focus-visible:outline-none',
      'fg-primary-muted flex flex-col align-end font-light text-body-m',
      'group-size-small/dialog:w-[280px] group-size-small/dialog:rounded-medium group-size-small/dialog:p-l',
      'group-size-large/dialog:min-w-[320px] group-size-small/dialog:max-w-[720px] group-size-large/dialog:rounded-medium group-size-large/dialog:p-xl',
    ],
    title: [
      'fg-primary-bold',
      'group-size-small/dialog:mb-s group-size-small/dialog:text-header-m',
      'group-size-large/dialog:mb-m group-size-large/dialog:text-header-l',
    ],
    content: [
      'flex flex-col',
      'fg-primary-muted',
      'group-size-small/dialog:gap-xs',
      'group-size-large/dialog:gap-l',
    ],
    footer: [
      'flex justify-end gap-xs',
      'group-size-small/dialog:mt-l',
      'group-size-large/dialog:mt-xl',
    ],
  },
});
