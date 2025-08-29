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

export const HotkeyStylesDefaults = {
  variant: 'outline',
} as const;

export const HotkeyStyles = tv({
  slots: {
    key: 'fg-primary-bold w-fit min-w-xl p-xs text-header-s uppercase',
    set: 'fg-primary-muted flex items-center gap-xs text-header-m',
  },
  variants: {
    variant: {
      flat: {
        key: 'bg-transparent',
      },
      outline: {
        key: 'rounded-medium bg-surface-default shadow-[0_3px] shadow-[color:var(--outline-info-bold)] outline outline-info-bold',
      },
      icon: {
        key: '-mx-xs bg-transparent px-0',
      },
    },
  },
  defaultVariants: HotkeyStylesDefaults,
});
