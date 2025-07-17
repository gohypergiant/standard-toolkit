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

export const ChipStylesDefaults = {
  size: 'medium',
  variant: 'info',
} as const;

export const BaseChipStyles = tv({
  slots: {
    list: 'flex w-content flex-wrap gap-xs',
    chip: 'fg-default-light inline-flex w-content items-center justify-center rounded-full outline',
  },
  variants: {
    size: {
      medium: {
        chip: 'px-s py-xs text-body-s',
      },
      small: {
        chip: 'px-s py-xs text-body-xs',
      },
    },
  },
  defaultVariants: ChipStylesDefaults,
});

export const ChipStyles = tv({
  extend: BaseChipStyles,
  slots: {
    chip: 'gap-xxs',
  },
  variants: {
    variant: {
      advisory: { chip: 'bg-advisory-subtle outline-advisory-bold' },
      critical: { chip: 'bg-critical-subtle outline-critical' },
      serious: { chip: 'bg-serious-subtle outline-serious' },
      normal: { chip: 'bg-normal-subtle outline-normal' },
      info: { chip: 'bg-info-subtle outline-info-bold' },
    },
  },
});

export const SelectableChipStyles = tv({
  extend: BaseChipStyles,
  slots: {
    chip: [
      'cursor-pointer outline-interactive',
      'enabled:focus:outline-interactive-hover',
      'enabled:hover:outline-interactive-hover',
      'enabled:selected:bg-highlight-subtle enabled:selected:outline-highlight',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:outline-interactive-disabled',
      'disabled:selected:bg-interactive-disabled',
    ],
  },
});

export const DeletableChipStyles = tv({
  extend: BaseChipStyles,
  slots: {
    chip: [
      'group gap-xs outline-interactive',
      'enabled:focus:outline-interactive-hover',
      'enabled:hover:outline-interactive-hover',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:outline-interactive-disabled',
    ],
    remove: ['cursor-pointer', 'disabled:cursor-not-allowed'],
  },
});
