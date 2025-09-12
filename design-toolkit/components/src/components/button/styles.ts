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

export const ButtonStylesDefaults = {
  color: 'mono-muted',
  variant: 'filled',
} as const;

const BaseButtonStyles = tv({
  base: [
    'group/button flex w-content cursor-pointer items-center justify-center rounded-medium outline outline-transparent',
    'disabled:cursor-not-allowed',
    'size-large:gap-xs size-large:px-m size-large:py-s size-large:text-button-l',
    'size-medium:gap-xs size-medium:px-m size-medium:py-s size-medium:text-button-m',
    'size-small:gap-xxs size-small:px-s size-small:py-xs size-small:text-button-s',
    'size-xsmall:gap-xxs size-xsmall:px-s size-xsmall:py-xs size-xsmall:text-button-xs',
  ],
  variants: {
    variant: {
      filled: [
        'disabled:fg-disabled disabled:bg-interactive-disabled',

        // Mono Muted
        'enabled:color-mono-muted:fg-primary-bold enabled:color-mono-muted:bg-interactive-muted',
        'enabled:hover:color-mono-muted:bg-interactive-muted-hover',
        'enabled:focus-visible:color-mono-muted:bg-interactive-muted-hover',
        'enabled:pressed:color-mono-muted:fg-primary-muted enabled:pressed:color-mono-muted:bg-interactive-muted-pressed',

        // Mono Bold
        'enabled:color-mono-bold:fg-inverse-bold enabled:color-mono-bold:bg-interactive-bold',
        'enabled:hover:color-mono-bold:bg-interactive-bold-hover',
        'enabled:focus-visible:color-mono-bold:bg-interactive-bold-hover',
        'enabled:pressed:color-mono-bold:fg-inverse-muted enabled:pressed:color-mono-bold:bg-interactive-bold-pressed',

        // Accent
        'enabled:color-accent:fg-a11y-on-accent enabled:color-accent:bg-accent-primary-bold',
        'enabled:hover:color-accent:bg-accent-primary-hover',
        'enabled:focus-visible:color-accent:bg-accent-primary-hover',
        'enabled:pressed:color-accent:fg-accent-primary-bold enabled:pressed:color-accent:bg-accent-primary-pressed',

        // Serious
        'enabled:color-serious:fg-a11y-on-utility enabled:color-serious:bg-serious-bold',
        'enabled:hover:color-serious:bg-serious-hover',
        'enabled:focus-visible:color-serious:bg-serious-hover',
        'enabled:pressed:color-serious:fg-serious-bold enabled:pressed:color-serious:bg-serious-pressed',

        // Critical
        'enabled:color-critical:fg-a11y-on-utility enabled:color-critical:bg-critical-bold',
        'enabled:hover:color-critical:bg-critical-hover',
        'enabled:focus-visible:color-critical:bg-critical-hover',
        'enabled:pressed:color-critical:fg-critical-bold enabled:pressed:color-critical:bg-critical-pressed',
      ],
      outline: [
        'disabled:fg-disabled disabled:outline-interactive-disabled',

        // Mono Muted
        'enabled:color-mono-muted:fg-primary-bold enabled:color-mono-muted:outline-interactive',
        'enabled:hover:color-mono-muted:bg-interactive-hover enabled:hover:color-mono-muted:outline-interactive-hover',
        'enabled:focus-visible:color-mono-muted:outline-interactive-hover',
        'enabled:pressed:color-mono-muted:fg-pressed enabled:pressed:color-mono-muted:bg-interactive-muted-pressed enabled:pressed:color-mono-muted:outline-interactive-pressed',

        // Mono Bold
        'enabled:color-mono-bold:fg-primary-bold enabled:color-mono-bold:outline enabled:color-mono-bold:outline-mono-bold',
        'enabled:hover:color-mono-bold:bg-interactive-muted-hover enabled:hover:color-mono-bold:outline-interactive-hover',
        'enabled:focus-visible:color-mono-bold:bg-interactive-muted-hover enabled:focus-visible:color-mono-bold:outline-interactive-hover',
        'enabled:pressed:color-mono-bold:fg-pressed enabled:pressed:color-mono-bold:bg-interactive-muted-pressed enabled:pressed:color-mono-bold:outline-mono-bold-pressed',

        // Accent
        'enabled:color-accent:fg-primary-bold enabled:color-accent:outline-accent-primary-bold',
        'enabled:hover:color-accent:bg-accent-primary-hover enabled:hover:color-accent:outline-interactive-hover',
        'enabled:focus-visible:color-accent:bg-accent-primary-hover enabled:focus-visible:color-accent:outline-accent-primary-hover',
        'enabled:pressed:color-accent:fg-accent-primary-bold enabled:pressed:color-accent:bg-accent-primary-pressed enabled:pressed:color-accent:outline-accent-primary-pressed',

        // Serious
        'enabled:color-serious:fg-primary-bold enabled:color-serious:outline-serious-bold',
        'enabled:hover:color-serious:fg-a11y-on-accent enabled:hover:color-serious:bg-serious-hover enabled:hover:color-serious:outline-serious-hover',
        'enabled:focus-within:color-serious:fg-a11y-on-accent enabled:focus-within:color-serious:bg-serious-hover enabled:focus-within:color-serious:outline-serious-hover',
        'enabled:pressed:color-serious:fg-serious-bold enabled:pressed:color-serious:bg-serious-pressed enabled:pressed:color-serious:outline-serious-pressed',

        // Critical
        'enabled:color-critical:fg-primary-bold enabled:color-critical:outline-critical-bold',
        'enabled:hover:color-critical:fg-a11y-on-accent enabled:hover:color-critical:bg-critical-hover enabled:hover:color-critical:outline-critical-hover',
        'enabled:focus-within:color-critical:fg-a11y-on-accent enabled:focus-within:color-critical:bg-critical-hover enabled:focus-within:color-critical:outline-critical-hover',
        'enabled:pressed:color-critical:fg-critical-pressed enabled:pressed:color-critical:bg-critical-pressed enabled:pressed:color-critical:outline-critical-pressed',
      ],
      flat: [
        'disabled:fg-disabled disabled:bg-transparent',

        // Mono Muted
        'enabled:color-mono-muted:fg-primary-muted',
        'enabled:hover:color-mono-muted:bg-interactive-hover',
        'enabled:focus-visible:color-mono-muted:bg-interactive-hover',
        'enabled:pressed:color-mono-muted:fg-pressed enabled:pressed:color-mono-muted:bg-interactive-muted-pressed',

        // Mono Bold
        'enabled:color-mono-bold:fg-primary-bold',
        'enabled:hover:color-mono-bold:bg-interactive-muted-hover',
        'enabled:focus-within:color-mono-bold:bg-interactive-muted-hover',
        'enabled:pressed:color-mono-bold:fg-pressed enabled:pressed:color-mono-bold:bg-interactive-muted-pressed',

        // Accent
        'enabled:color-accent:fg-accent-primary-bold',
        'enabled:hover:color-accent:fg-a11y-on-accent enabled:hover:color-accent:bg-accent-primary-hover',
        'enabled:focus-within:color-accent:fg-a11y-on-accent enabled:focus-within:color-accent:bg-accent-primary-hover',
        'enabled:pressed:color-accent:fg-accent-primary-pressed enabled:pressed:color-accent:bg-accent-primary-pressed',

        // Serious
        'enabled:color-serious:fg-serious-bold',
        'enabled:hover:color-serious:fg-a11y-on-accent enabled:hover:color-serious:bg-serious-hover',
        'enabled:focus-within:color-serious:fg-a11y-on-accent enabled:focus-within:color-serious:bg-serious-hover',
        'enabled:pressed:color-serious:fg-serious-pressed enabled:pressed:color-serious:bg-serious-pressed',

        // Critical
        'enabled:color-critical:fg-critical-bold',
        'enabled:hover:color-critical:fg-a11y-on-accent enabled:hover:color-critical:bg-critical-hover',
        'enabled:focus-within:color-critical:fg-a11y-on-accent enabled:focus-within:color-critical:bg-critical-hover',
        'enabled:pressed:color-critical:fg-critical-pressed enabled:pressed:color-critical:bg-critical-pressed',
      ],
      icon: [
        'size-small:rounded-small size-xsmall:rounded-small size-large:p-xs size-medium:p-xs size-small:p-xxs size-xsmall:p-xxs',
        'disabled:fg-disabled disabled:bg-transparent',
        'disabled:hover:bg-interactive-disabled',
        'disabled:focus-within:bg-interactive-disabled',

        // Mono Muted
        'enabled:color-mono-muted:fg-primary-muted',
        'enabled:hover:color-mono-muted:bg-interactive-muted-hover',
        'enabled:focus-visible:color-mono-muted:bg-interactive-muted-hover',
        'enabled:pressed:color-mono-muted:fg-pressed enabled:pressed:color-mono-muted:bg-interactive-muted-pressed',
        // Mono Bold
        'enabled:color-mono-bold:fg-primary-bold',
        'enabled:hover:color-mono-bold:bg-interactive-muted-hover',
        'enabled:focus-within:color-mono-bold:bg-interactive-muted-hover',
        'enabled:pressed:color-mono-bold:fg-pressed enabled:pressed:color-mono-bold:bg-interactive-muted-pressed',

        // Accent
        'enabled:color-accent:fg-accent-primary-bold',
        'enabled:hover:color-accent:fg-accent-primary-hover enabled:hover:color-accent:bg-interactive-muted-hover',
        'enabled:focus-within:color-accent:fg-accent-primary-hover enabled:focus-within:color-accent:bg-interactive-muted-hover',
        'enabled:pressed:color-accent:fg-accent-primary-pressed enabled:pressed:color-accent:bg-interactive-muted-pressed',

        // Serious
        'enabled:color-serious:fg-serious-bold',
        'enabled:hover:color-serious:fg-serious-hover enabled:hover:color-serious:bg-interactive-muted-hover',
        'enabled:focus-within:color-serious:fg-serious-hover enabled:focus-within:color-serious:bg-interactive-muted-hover',
        'enabled:pressed:color-serious:fg-serious-pressed enabled:pressed:color-serious:bg-interactive-muted-pressed',

        // Critical
        'enabled:color-critical:fg-critical-bold',
        'enabled:hover:color-critical:fg-critical-hover enabled:hover:color-critical:bg-interactive-muted-hover',
        'enabled:focus-within:color-critical:fg-critical-hover enabled:focus-within:color-critical:bg-interactive-muted-hover',
        'enabled:pressed:color-critical:fg-critical-pressed enabled:pressed:color-critical:bg-interactive-muted-pressed',
      ],
      floating: [
        'rounded-full',
        'size-large:p-xs size-medium:p-xs size-small:p-xxs size-xsmall:p-xxs',
        'disabled:fg-disabled disabled:bg-interactive-disabled disabled:outline-interactive-disabled',

        // Mono Muted
        'enabled:color-info:fg-info-bold enabled:color-info:bg-surface-default enabled:color-info:outline-interactive',
        'enabled:hover:color-info:fg-info-hover enabled:hover:color-info:outline-interactive-hover',
        'enabled:focus-visible:color-info:fg-info-hover enabled:focus-visible:color-info:outline-interactive-hover',

        // Mono Bold
        'enabled:color-info:fg-info-bold enabled:color-info:bg-surface-default enabled:color-info:outline-interactive',
        'enabled:hover:color-info:fg-info-hover enabled:hover:color-info:outline-interactive-hover',
        'enabled:focus-visible:color-info:fg-info-hover enabled:focus-visible:color-info:outline-interactive-hover',

        // Info
        'enabled:color-info:fg-info-bold enabled:color-info:bg-surface-default enabled:color-info:outline-interactive',
        'enabled:hover:color-info:fg-info-hover enabled:hover:color-info:outline-interactive-hover',
        'enabled:focus-visible:color-info:fg-info-hover enabled:focus-visible:color-info:outline-interactive-hover',

        // Serious
        'enabled:color-serious:fg-serious-bold enabled:color-serious:bg-serious-muted enabled:color-serious:outline-serious-bold',
        'enabled:hover:color-serious:fg-info-hover enabled:hover:color-serious:outline-interactive-hover',
        'enabled:focus-visible:color-serious:fg-info-hover enabled:focus-visible:color-serious:outline-interactive-hover',

        // Critical
        'enabled:color-critical:fg-critical-bold enabled:color-critical:bg-critical-muted enabled:color-critical:outline-critical-bold',
        'enabled:hover:color-critical:fg-info-hover enabled:hover:color-critical:outline-interactive-hover',
        'enabled:focus-visible:color-critical:fg-info-hover enabled:focus-visible:color-critical:outline-interactive-hover',
      ],
    },
  },
  compoundVariants: [
    // TODO: What compound variants do we need with updated styles?
  ],
  defaultVariants: ButtonStylesDefaults,
});

export const ButtonStyles = tv({
  extend: BaseButtonStyles,
});

export const LinkButtonStyles = tv({
  extend: BaseButtonStyles,
});

export const ToggleButtonStyles = tv({
  extend: BaseButtonStyles,
  base: [
    // TODO: Do we want accent as the default styling?
    'enabled:color-accent:fg-accent-primary-bold enabled:color-accent:bg-transparent',
    'enabled:hover:color-accent:fg-accent-primary-hover enabled:hover:color-accent:bg-accent-primary-muted',
    'enabled:focus-within:color-accent:fg-accent-primary-hover enabled:focus-within:color-accent:bg-accent-primary-muted',
    'enabled:pressed:color-accent:fg-accent-primary-bold enabled:pressed:color-accent:bg-accent-primary-pressed',
  ],
  variants: {
    variant: {
      flat: [
        // Mono Muted
        'enabled:color-mono-muted:fg-primary-muted enabled:color-mono-muted:bg-transparent',
        'enabled:hover:color-mono-muted:bg-interactive-muted-hover',
        'enabled:focus-visible:color-mono-muted:bg-interactive-muted-hover',
        'enabled:pressed:color-mono-muted:fg-pressed enabled:pressed:color-mono-muted:bg-interactive-muted-pressed',

        // Mono Muted - Selected
        'enabled:selected:color-mono-muted:fg-primary-muted enabled:selected:color-mono-muted:bg-interactive-muted enabled:selected:color-mono-muted:outline enabled:selected:color-mono-muted:outline-interactive-hover',
        'enabled:selected:hover:color-mono-muted:bg-interactive-muted-hover enabled:selected:hover:color-mono-muted:outline-2',
        'enabled:selected:focus-visible:color-mono-muted:bg-interactive-muted-hover enabled:selected:focus-within:color-mono-muted:outline-2',
        'enabled:selected:pressed:color-mono-muted:fg-pressed enabled:selected:pressed:color-mono-muted:bg-interactive-muted-pressed enabled:selected:pressed:color-mono-muted:outline-2',

        // Mono Bold
        'enabled:color-mono-bold:fg-primary-bold',
        'enabled:hover:color-mono-bold:bg-interactive-muted-hover',
        'enabled:focus-within:color-mono-bold:bg-interactive-muted-hover',
        'enabled:pressed:color-mono-bold:fg-pressed enabled:pressed:color-mono-bold:bg-interactive-muted-pressed',

        // Mono Bold - Selected
        'enabled:selected:color-mono-bold:fg-primary-bold enabled:selected:color-mono-bold:outline enabled:selected:color-mono-bold:outline-mono-bold',
        'enabled:selected:hover:color-mono-bold:fg-hover enabled:selected:hover:color-mono-bold:bg-interactive-muted-hover enabled:selected:hover:color-mono-bold:outline-2',
        'enabled:selected:hover:color-mono-bold:outline-2 enabled:selected:focus-within:color-mono-bold:bg-interactive-muted-hover enabled:selected:focus-within:color-mono-bold:outline-2',
        'enabled:selected:pressed:color-mono-bold:fg-pressed enabled:selected:pressed:color-mono-bold:bg-interactive-muted-pressed',

        // Accent
        'enabled:color-accent:fg-accent-primary-bold enabled:color-accent:bg-transparent',
        'enabled:hover:color-accent:fg-accent-primary-hover enabled:hover:color-accent:bg-accent-primary-muted',
        'enabled:focus-within:color-accent:fg-accent-primary-hover enabled:focus-within:color-accent:bg-accent-primary-muted',
        'enabled:pressed:color-accent:fg-accent-primary-bold enabled:pressed:color-accent:bg-accent-primary-pressed',

        // Accent - Selected
        'enabled:selected:color-accent:fg-accent-primary-bold enabled:selected:color-accent:bg-accent-primary-bold enabled:color-accent:outline enabled:selected:color-accent:outline-accent-primary-bold ',
        'enabled:selected:hover:color-accent:fg-a11y-on-accent enabled:selected:hover:color-accent:bg-accent-primary-hover enabled:selected:hover:color-accent:outline-2',
        'enabled:selected:focus-within:color-accent:fg-a11y-on-accent enabled:selected:focus-within:color-accent:bg-accent-primary-hover enabled:selected:focus-within:color-accent:outline-2',
        'enabled:selected:pressed:color-accent:fg-accent-primary-bold enabled:selected:pressed:color-accent:bg-accent-primary-pressed enabled:selected:pressed:color-accent:outline-2',

        // Serious
        'enabled:color-serious:fg-serious-bold enabled:color-serious:bg-transparent',
        'enabled:hover:color-serious:fg-serious-hover enabled:hover:color-serious:bg-serious-bold',
        'enabled:focus-within:color-serious:fg-serious-hover enabled:focus-within:color-serious:bg-serious-muted',
        'enabled:pressed:color-serious:fg-serious-bold enabled:pressed:color-serious:bg-serious-pressed',

        // Serious - Selected
        'enabled:selected:color-serious:fg-serious-bold enabled:selected:color-serious:bg-serious-muted enabled:selected:color-serious:outline-serious-bold',
        'enabled:selected:hover:color-serious:fg-primary-bold enabled:selected:hover:color-serious:bg-serious-hover enabled:selected:hover:color-serious:outline-serious-hover',
        'enabled:selected:focus-within:color-serious:fg-primary-bold enabled:selected:focus-within:color-serious:bg-serious-hover enabled:selected:focus-within:color-serious:outline-serious-hover',
        'enabled:selected:pressed:color-serious:fg-serious-pressed enabled:selected:pressed:color-serious:bg-serious-pressed',

        // Critical
        'enabled:color-critical:fg-critical-bold enabled:color-critical:bg-transparent',
        'enabled:hover:color-critical:fg-critical-hover enabled:hover:color-critical:bg-critical-muted',
        'enabled:focus-within:color-critical:fg-critical-hover enabled:focus-within:color-critical:bg-critical-muted',
        'enabled:pressed:color-critical:fg-critical-bold enabled:pressed:color-critical:bg-critical-pressed',

        // Critical - Selected
        'enabled:selected:color-critical:fg-primary-bold enabled:selected:color-critical:bg-critical-muted enabled:selected:color-critical:outline enabled:selected:color-critical:outline-critical-bold',
        'enabled:selected:hover:color-critical:fg-a11y-on-accent enabled:selected:hover:color-critical:bg-critical-hover enabled:selected:hover:color-critical:outline-2',
        'enabled:selected:focus-within:color-critical:fg-a11y-on-accent enabled:selected:focus-within:color-critical:bg-critical-hover enabled:selected:focus-within:color-critical:outline-2',
        'enabled:selected:pressed:color-critical:fg-critical-bold enabled:selected:pressed:color-critical:bg-critical-pressed enabled:selected:pressed:color-critical:outline-2 enabled:selected:pressed:color-critical:outline-critical-pressed',
      ],
      outline: [
        // Mono Muted
        'enabled:color-mono-muted:fg-primary-bold enabled:color-mono-muted:bg-transparent enabled:color-mono-muted:outline enabled:color-mono-muted:outline-interactive',
        'enabled:hover:color-mono-muted:bg-interactive-muted-hover enabled:hover:color-mono-muted:outline-2 enabled:hover:color-mono-muted:outline-interactive-hover',
        'enabled:focus-visible:color-mono-muted:bg-interactive-muted-hover enabled:focus-within:color-mono-muted:outline-2 enabled:focus-within:color-mono-muted:outline-interactive-hover',
        'enabled:pressed:color-mono-muted:fg-pressed enabled:pressed:color-mono-muted:bg-interactive-muted-pressed enabled:pressed:color-mono-muted:outline-2 enabled:pressed:color-mono-muted:outline-interactive-pressed',

        // Mono Muted - Selected
        'enabled:selected:color-mono-muted:fg-primary-muted enabled:selected:color-mono-muted:bg-interactive-muted enabled:selected:color-mono-muted:outline enabled:selected:color-mono-muted:outline-interactive-hover',
        'enabled:selected:hover:color-mono-muted:fg-hover enabled:selected:hover:color-mono-muted:bg-interactive-muted-hover enabled:selected:hover:color-mono-muted:outline-2',
        'enabled:selected:focus-visible:color-mono-muted:bg-interactive-muted-hover enabled:selected:focus-within:color-mono-muted:outline-2',
        'enabled:selected:pressed:color-mono-muted:fg-pressed enabled:selected:pressed:color-mono-muted:bg-interactive-muted-pressed enabled:selected:pressed:color-mono-muted:outline-2',

        // Mono Bold
        'enabled:color-mono-bold:fg-primary-bold enabled:color-mono-bold:bg-transparent enabled:color-mono-bold:outline enabled:color-mono-bold:outline-mono-bold', // ?
        'enabled:hover:color-mono-bold:bg-interactive-muted-hover enabled:hover:color-mono-bold:outline-2 enabled:hover:color-mono-bold:outline-mono-bold-hover',
        'enabled:focus-within:color-mono-bold:bg-interactive-muted-hover enabled:focus-within:color-mono-bold:outline-2 enabled:focus-within:color-mono-bold:outline-mono-bold-hover',
        'enabled:pressed:color-mono-bold:fg-pressed enabled:pressed:color-mono-bold:bg-interactive-muted-pressed',

        // Mono Bold - Selected
        'enabled:selected:color-mono-bold:fg-primary-bold enabled:selected:color-mono-bold:outline enabled:selected:color-mono-bold:outline-mono-bold',
        'enabled:selected:hover:color-mono-bold:fg-inverse-bold enabled:selected:hover:color-mono-bold:bg-interactive-bold-hover enabled:selected:hover:color-mono-bold:outline-2 enabled:selected:hover:color-mono-bold:outline-mono-bold-hover',
        'enabled:selected:focuse-within:color-mono-bold:fg-inverse-bold enabled:selected:focuse-within:color-mono-bold:bg-interactive-bold-hover enabled:selected:focuse-within:color-mono-bold:outline-2 enabled:selected:focus-within:color-mono-bold:bg-interactive-muted-hover enabled:selected:focus-within:color-mono-bold:outline-2',
        'enabled:selected:pressed:color-mono-bold:fg-pressed enabled:selected:pressed:color-mono-bold:bg-interactive-muted-pressed enabled:selected:pressed:color-mono-bold:outline-2 enabled:selected:pressed:color-mono-bold:outline-interactive-pressed',

        // Accent
        'enabled:color-accent:fg-accent-primary-bold enabled:color-accent:bg-transparent enabled:color-accent:outline enabled:color-accent:outline-accent-primary-bold ',
        'enabled:hover:color-accent:fg-accent-primary-hover enabled:hover:color-accent:bg-accent-primary-muted enabled:hover:color-accent:outline-2 enabled:hover:color-accent:outline-accent-primary-hover',
        'enabled:focus-within:color-accent:fg-accent-primary-hover enabled:focus-within:color-accent:bg-accent-primary-muted enabled:focus-within:color-accent:outline-2 enabled:focus-within:color-accent:outline-accent-primary-hover',
        'enabled:pressed:color-accent:fg-pressed enabled:pressed:color-accent:bg-interactive-muted-pressed enabled:pressed:color-accent:outline-2 enabled:pressed:color-accent:outline-accent-primary-pressed',

        // Accent - Selected
        'enabled:selected:color-accent:fg-accent-primary-bold enabled:selected:color-accent:bg-accent-primary-muted enabled:color-accent:outline enabled:selected:color-accent:outline-accent-primary-bold',
        'enabled:selected:hover:color-accent:fg-a11y-on-accent enabled:selected:hover:color-accent:bg-accent-primary-hover enabled:selected:hover:color-accent:outline-2 enabled:selected:hover:color-accent:outline-accent-primary-hover',
        'enabled:selected:focus-within:color-accent:fg-a11y-on-accent enabled:selected:focus-within:color-accent:bg-accent-primary-hover enabled:selected:focus-within:color-accent:outline-2 enabled:selected:focus-within:color-accent:outline-accent-primary-hover',
        'enabled:selected:pressed:color-accent:fg-accent-primary-bold enabled:selected:pressed:color-accent:bg-accent-primary-pressed enabled:selected:pressed:color-accent:outline-2 enabled:selected:pressed:color-accent:outline-accent-primary-pressed',

        // Serious
        'enabled:color-serious:fg-primary-bold enabled:color-serious:bg-transparent enabled:color-serious:outline enabled:color-serious:outline-serious-bold',
        'enabled:hover:color-serious:fg-primary-bold enabled:hover:color-serious:bg-serious-bold enabled:hover:color-serious:outline-2 enabled:hover:color-serious:outline-serious-hover',
        'enabled:focus-within:color-serious:fg-primary-bold enabled:focus-within:color-serious:bg-serious-muted enabled:focus-within:color-serious:outline-2 enabled:focus-within:color-serious:outline-serious-hover',
        'enabled:pressed:color-serious:fg-serious-bold enabled:pressed:color-serious:bg-serious-pressed enabled:pressed:color-serious:outline-2 enabled:pressed:color-serious:outline-serious-pressed',

        // Serious - Selected
        'enabled:selected:color-serious:fg-serious-bold enabled:selected:color-serious:bg-serious-muted enabled:selected:color-serious:outline-serious-muted',
        'enabled:selected:hover:color-serious:fg-primary-bold enabled:selected:hover:color-serious:bg-serious-hover enabled:selected:hover:color-serious:outline-serious-hover',
        'enabled:selected:focus-within:color-serious:fg-primary-bold enabled:selected:focus-within:color-serious:bg-serious-hover enabled:selected:focus-within:color-serious:outline-serious-hover',
        'enabled:selected:pressed:color-serious:fg-serious-pressed enabled:selected:pressed:color-serious:bg-serious-pressed enabled:selected:pressed:color-serious:outline-2 enabled:selected:pressed:color-serious:outline-serious-pressed',

        // Critical
        'enabled:color-critical:fg-primary-bold enabled:color-critical:bg-transparent enabled:color-critical:outline enabled:color-critical:outline-critical-bold',
        'enabled:hover:color-critical:fg-primary-bold enabled:hover:color-critical:bg-critical-bold enabled:hover:color-critical:outline-2 enabled:hover:color-critical:outline-critical-hover',
        'enabled:focus-within:color-critical:fg-primary-bold enabled:focus-within:color-critical:bg-critical-muted enabled:focus-within:color-critical:outline-2 enabled:focus-within:color-critical:outline-critical-hover',
        'enabled:pressed:color-critical:fg-critical-bold enabled:pressed:color-critical:bg-critical-pressed enabled:pressed:color-critical:outline-2 enabled:pressed:color-critical:outline-critical-pressed',

        // Critical - Selected
        'enabled:selected:color-critical:fg-critical-bold enabled:selected:color-critical:bg-critical-muted enabled:selected:color-critical:outline-critical-muted',
        'enabled:selected:hover:color-critical:fg-primary-bold enabled:selected:hover:color-critical:bg-critical-hover enabled:selected:hover:color-critical:outline-critical-hover',
        'enabled:selected:focus-within:color-critical:fg-primary-bold enabled:selected:focus-within:color-critical:bg-critical-hover enabled:selected:focus-within:color-critical:outline-critical-hover',
        'enabled:selected:pressed:color-critical:fg-critical-pressed enabled:selected:pressed:color-critical:bg-critical-pressed enabled:selected:pressed:color-critical:outline-2 enabled:selected:pressed:color-critical:outline-serious-pressed',
      ],
      floating: [
        // Info
        'enabled:selected:color-info:outline-accent-primary-bold',
        'enabled:selected:hover:color-info:outline-interactive-hover',
        'enabled:selected:focus-visible:color-info:outline-interactive-hover',

        // Serious
        'enabled:selected:color-serious:outline-accent-primary-bold',
        'enabled:selected:hover:color-serious:outline-interactive-hover',
        'enabled:selected:focus-visible:color-serious:outline-interactive-hover',

        // Critical
        'enabled:selected:color-critical:outline-accent-primary-bold',
        'enabled:selected:hover:color-critical:outline-interactive-hover',
        'enabled:selected:focus-visible:color-critical:outline-interactive-hover',
      ],
    },
  },
});
