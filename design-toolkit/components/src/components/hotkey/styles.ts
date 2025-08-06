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

import { tv } from '../../lib/utils';

export const HotkeyStyles = tv({
  slots: {
    key: ['fg-default-light', 'text-header-s uppercase', 'w-fit min-w-xl p-xs'],
    set: 'fg-default-dark flex items-center gap-xs text-header-m',
  },
  variants: {
    variant: {
      flat: {
        key: 'bg-transparent',
      },
      outline: {
        key: 'bg-surface-default rounded-medium border border-info border-b-[3px]',
      },
      icon: {
        key: '-mx-xs px-0 bg-transparent',
      },
    },
  },
});
