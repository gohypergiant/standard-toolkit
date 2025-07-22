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
  color: 'info',
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
    color: {
      info: '',
      serious: '',
      critical: '',
    },
    variant: {
      filled: 'disabled:fg-disabled disabled:bg-interactive-disabled',
      outline: 'disabled:fg-disabled disabled:outline-interactive-disabled',
      flat: 'disabled:fg-disabled disabled:bg-transparent',
      icon: [
        'size-small:rounded-small size-xsmall:rounded-small size-large:p-xs size-medium:p-xs size-small:p-xxs size-xsmall:p-xxs',
        'disabled:fg-disabled disabled:bg-transparent',
      ],
      floating: [
        'rounded-full',
        'size-large:p-xs size-medium:p-xs size-small:p-xxs size-xsmall:p-xxs',
        'disabled:fg-disabled disabled:bg-interactive-disabled disabled:outline-interactive-disabled',
      ],
    },
  },
  compoundVariants: [
    /** Colors **/
    // Info
    {
      color: 'info',
      variant: 'filled',
      className: [
        'enabled:bg-interactive-default',
        'enabled:hover:bg-interactive-hover-light',
        'enabled:focus:bg-interactive-hover-light',
      ],
    },
    {
      color: 'info',
      variant: 'outline',
      className: [
        'enabled:fg-default-light enabled:outline-interactive',
        'enabled:hover:outline-interactive-hover',
        'enabled:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'info',
      variant: ['flat', 'icon'],
      className: [
        'enabled:fg-default-light',
        'enabled:hover:bg-interactive-hover-dark',
        'enabled:focus:bg-interactive-hover-dark',
      ],
    },
    {
      color: 'info',
      variant: 'floating',
      className: [
        'enabled:fg-interactive enabled:bg-surface-default enabled:outline-interactive',
        'enabled:hover:fg-interactive-hover enabled:hover:outline-interactive-hover',
        'enabled:focus:fg-interactive-hover enabled:focus:outline-interactive-hover',
      ],
    },

    // Serious
    {
      color: 'serious',
      variant: 'filled',
      className: [
        'enabled:bg-serious',
        'enabled:hover:bg-serious-hover',
        'enabled:focus:bg-serious-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'outline',
      className: [
        'enabled:fg-default-light enabled:outline-serious',
        'enabled:hover:outline-interactive-hover',
        'enabled:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'serious',
      variant: ['flat', 'icon'],
      className: [
        'enabled:fg-default-light',
        'enabled:hover:bg-serious-hover',
        'enabled:focus:bg-serious-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'floating',
      className: [
        'enabled:fg-serious enabled:bg-serious-subtle enabled:outline-serious',
        'enabled:hover:fg-interactive-hover enabled:hover:outline-interactive-hover',
        'enabled:focus:fg-interactive-hover enabled:focus:outline-interactive-hover',
      ],
    },

    // Critical
    {
      color: 'critical',
      variant: 'filled',
      className: [
        'enabled:bg-critical',
        'enabled:hover:bg-critical-hover',
        'enabled:focus:bg-critical-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'outline',
      className: [
        'enabled:fg-default-light enabled:outline-critical',
        'enabled:hover:outline-interactive-hover',
        'enabled:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'critical',
      variant: ['flat', 'icon'],
      className: [
        'enabled:fg-default-light',
        'enabled:hover:bg-critical-hover',
        'enabled:focus:bg-critical-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'floating',
      className: [
        'enabled:fg-critical enabled:bg-critical-subtle enabled:outline-critical',
        'enabled:hover:fg-interactive-hover enabled:hover:outline-interactive-hover',
        'enabled:focus:fg-interactive-hover enabled:focus:outline-interactive-hover',
      ],
    },
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
  compoundVariants: [
    {
      color: 'info',
      variant: 'filled',
      className: [
        'enabled:selected:bg-info-subtle',
        'enabled:selected:hover:bg-interactive-hover-light',
        'enabled:selected:focus:bg-interactive-hover-light',
      ],
    },
    {
      color: 'info',
      variant: 'floating',
      className: [
        'enabled:selected:outline-highlight',
        'enabled:selected:hover:outline-interactive-hover',
        'enabled:selected:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'filled',
      className: [
        'enabled:selected:bg-serious-subtle',
        'enabled:selected:hover:bg-serious-hover',
        'enabled:selected:focus:bg-serious-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'floating',
      className: [
        'enabled:selected:outline-highlight',
        'enabled:selected:hover:outline-interactive-hover',
        'enabled:selected:focus:outline-interactive-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'filled',
      className: [
        'enabled:selected:bg-critical-subtle',
        'enabled:selected:hover:bg-critical-hover',
        'enabled:selected:focus:bg-critical-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'floating',
      className: [
        'enabled:selected:outline-highlight',
        'enabled:selected:hover:outline-interactive-hover',
        'enabled:selected:focus:outline-interactive-hover',
      ],
    },
    // Must be last to override color values
    {
      className: [
        'enabled:selected:fg-highlight',
        'enabled:selected:hover:fg-highlight',
        'enabled:selected:focus:fg-highlight',
      ],
    },
  ],
});
