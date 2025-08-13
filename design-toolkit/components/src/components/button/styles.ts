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
      variant: 'filled',
      className: [
        'enabled:color-info:fg-inverse-light',
        'enabled:color-info:bg-interactive-default',
        'enabled:hover:color-info:bg-interactive-hover-light',
        'enabled:focus-visible:color-info:bg-interactive-hover-light',
      ],
    },
    {
      variant: 'outline',
      className: [
        'enabled:color-info:fg-default-light enabled:color-info:outline-interactive',
        'enabled:hover:color-info:outline-interactive-hover',
        'enabled:focus-visible:color-info:outline-interactive-hover',
      ],
    },
    {
      variant: ['flat', 'icon'],
      className: [
        'enabled:color-info:fg-default-light',
        'enabled:hover:color-info:bg-interactive-hover-dark',
        'enabled:focus-visible:color-info:bg-interactive-hover-dark',
      ],
    },
    {
      variant: 'floating',
      className: [
        'enabled:color-info:fg-interactive enabled:color-info:bg-surface-default enabled:color-info:outline-interactive',
        'enabled:hover:color-info:fg-interactive-hover enabled:hover:color-info:outline-interactive-hover',
        'enabled:focus-visible:color-info:fg-interactive-hover enabled:focus-visible:color-info:outline-interactive-hover',
      ],
    },

    // Serious
    {
      variant: 'filled',
      className: [
        'enabled:color-serious:fg-inverse-light',
        'enabled:color-serious:bg-serious',
        'enabled:hover:color-serious:bg-serious-hover',
        'enabled:focus-visible:color-serious:bg-serious-hover',
      ],
    },
    {
      variant: 'outline',
      className: [
        'enabled:color-serious:fg-default-light enabled:color-serious:outline-serious',
        'enabled:hover:color-serious:outline-interactive-hover',
        'enabled:focus-visible:color-serious:outline-interactive-hover',
      ],
    },
    {
      variant: ['flat', 'icon'],
      className: [
        'enabled:color-serious:fg-default-light',
        'enabled:hover:color-serious:bg-serious-hover',
        'enabled:focus-visible:color-serious:bg-serious-hover',
      ],
    },
    {
      variant: 'floating',
      className: [
        'enabled:color-serious:fg-serious enabled:color-serious:bg-serious-subtle enabled:color-serious:outline-serious',
        'enabled:hover:color-serious:fg-interactive-hover enabled:hover:color-serious:outline-interactive-hover',
        'enabled:focus-visible:color-serious:fg-interactive-hover enabled:focus-visible:color-serious:outline-interactive-hover',
      ],
    },

    // Critical
    {
      variant: 'filled',
      className: [
        'enabled:color-critical:fg-default-light',
        'enabled:color-critical:bg-critical',
        'enabled:hover:color-critical:bg-critical-hover',
        'enabled:focus-visible:color-critical:bg-critical-hover',
      ],
    },
    {
      variant: 'outline',
      className: [
        'enabled:color-critical:fg-default-light enabled:color-critical:outline-critical',
        'enabled:hover:color-critical:outline-interactive-hover',
        'enabled:focus-visible:color-critical:outline-interactive-hover',
      ],
    },
    {
      variant: ['flat', 'icon'],
      className: [
        'enabled:color-critical:fg-default-light',
        'enabled:hover:color-critical:bg-critical-hover',
        'enabled:focus-visible:color-critical:bg-critical-hover',
      ],
    },
    {
      variant: 'floating',
      className: [
        'enabled:color-critical:fg-critical enabled:color-critical:bg-critical-subtle enabled:color-critical:outline-critical',
        'enabled:hover:color-critical:fg-interactive-hover enabled:hover:color-critical:outline-interactive-hover',
        'enabled:focus-visible:color-critical:fg-interactive-hover enabled:focus-visible:color-critical:outline-interactive-hover',
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
      variant: 'filled',
      className: [
        'enabled:color-info:fg-inverse-light',
        'enabled:selected:color-info:bg-info-subtle',
        'enabled:selected:hover:color-info:bg-interactive-hover-light',
        'enabled:selected:focus-visible:color-info:bg-interactive-hover-light',
      ],
    },
    {
      variant: 'floating',
      className: [
        'enabled:selected:color-info:outline-highlight',
        'enabled:selected:hover:color-info:outline-interactive-hover',
        'enabled:selected:focus-visible:color-info:outline-interactive-hover',
      ],
    },
    {
      variant: 'filled',
      className: [
        'enabled:color-serious:fg-inverse-light',
        'enabled:selected:color-serious:bg-serious-subtle',
        'enabled:selected:hover:color-serious:bg-serious-hover',
        'enabled:selected:focus-visible:color-serious:bg-serious-hover',
      ],
    },
    {
      variant: 'floating',
      className: [
        'enabled:selected:color-serious:outline-highlight',
        'enabled:selected:hover:color-serious:outline-interactive-hover',
        'enabled:selected:focus-visible:color-serious:outline-interactive-hover',
      ],
    },
    {
      variant: 'filled',
      className: [
        'enabled:color-critical:fg-default-light',
        'enabled:selected:color-critical:bg-critical-subtle',
        'enabled:selected:hover:color-critical:bg-critical-hover',
        'enabled:selected:focus-visible:color-critical:bg-critical-hover',
      ],
    },
    {
      variant: 'floating',
      className: [
        'enabled:selected:color-critical:outline-highlight',
        'enabled:selected:hover:color-critical:outline-interactive-hover',
        'enabled:selected:focus-visible:color-critical:outline-interactive-hover',
      ],
    },
    // Must be last to override color values
    {
      className: [
        'enabled:selected:fg-highlight',
        'enabled:selected:hover:fg-highlight',
        'enabled:selected:focus-visible-visible:fg-highlight',
      ],
    },
  ],
});
