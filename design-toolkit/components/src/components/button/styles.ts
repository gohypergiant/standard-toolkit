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
    variant: {
      filled: [
        'disabled:fg-disabled disabled:bg-interactive-disabled',

        // Info
        'enabled:color-info:fg-inverse-bold',
        'enabled:color-info:bg-interactive-bold',
        'enabled:hover:color-info:bg-interactive-bold-hover',
        'enabled:focus-visible:color-info:bg-interactive-bold-hover',

        // Serious
        'enabled:color-serious:fg-a11y-on-utility',
        'enabled:color-serious:bg-serious-bold',
        'enabled:hover:color-serious:bg-serious-hover',
        'enabled:focus-visible:color-serious:bg-serious-hover',

        // Critical
        'enabled:color-critical:fg-a11y-on-utility',
        'enabled:color-critical:bg-critical-bold',
        'enabled:hover:color-critical:bg-critical-hover',
        'enabled:focus-visible:color-critical:bg-critical-hover',
      ],
      outline: [
        'disabled:fg-disabled disabled:outline-interactive-disabled',

        // Info
        'enabled:color-info:fg-primary-bold enabled:color-info:outline-interactive',
        'enabled:hover:color-info:outline-interactive-hover',
        'enabled:focus-visible:color-info:outline-interactive-hover',

        // Serious
        'enabled:color-serious:fg-primary-bold enabled:color-serious:outline-serious-bold',
        'enabled:hover:color-serious:outline-interactive-hover',
        'enabled:focus-visible:color-serious:outline-interactive-hover',

        // Critical
        'enabled:color-critical:fg-primary-bold enabled:color-critical:outline-critical-bold',
        'enabled:hover:color-critical:outline-interactive-hover',
        'enabled:focus-visible:color-critical:outline-interactive-hover',
      ],
      flat: 'disabled:fg-disabled disabled:bg-transparent',
      icon: [
        'size-small:rounded-small size-xsmall:rounded-small size-large:p-xs size-medium:p-xs size-small:p-xxs size-xsmall:p-xxs',
        'disabled:fg-disabled disabled:bg-transparent',
      ],
      floating: [
        'rounded-full',
        'size-large:p-xs size-medium:p-xs size-small:p-xxs size-xsmall:p-xxs',
        'disabled:fg-disabled disabled:bg-interactive-disabled disabled:outline-interactive-disabled',

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
    // Info
    {
      variant: ['flat', 'icon'],
      className: [
        'enabled:color-info:fg-primary-bold',
        'enabled:hover:color-info:bg-interactive-muted-hover',
        'enabled:focus-visible:color-info:bg-interactive-muted-hover',
      ],
    },

    // Serious
    {
      variant: ['flat', 'icon'],
      className: [
        'enabled:color-serious:fg-primary-bold',
        'enabled:hover:color-serious:bg-serious-hover',
        'enabled:focus-visible:color-serious:bg-serious-hover',
      ],
    },

    // Critical
    {
      variant: ['flat', 'icon'],
      className: [
        'enabled:color-critical:fg-primary-bold',
        'enabled:hover:color-critical:bg-critical-hover',
        'enabled:focus-visible:color-critical:bg-critical-hover',
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
  base: [
    'enabled:selected:fg-accent-primary-bold',
    'enabled:selected:hover:fg-accent-primary-bold',
    'enabled:selected:focus-visible:fg-accent-primary-bold',
  ],
  variants: {
    variant: {
      filled: [
        // Info
        'enabled:selected:color-info:bg-info-muted',
        'enabled:selected:hover:color-info:bg-interactive-bold-hover',
        'enabled:selected:focus-visible:color-info:bg-interactive-bold-hover',

        // Serious
        'enabled:selected:color-serious:bg-serious-muted',
        'enabled:selected:hover:color-serious:bg-serious-hover',
        'enabled:selected:focus-visible:color-serious:bg-serious-hover',

        // Critical
        'enabled:selected:color-critical:bg-critical-muted',
        'enabled:selected:hover:color-critical:bg-critical-hover',
        'enabled:selected:focus-visible:color-critical:bg-critical-hover',
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
