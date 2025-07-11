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
import type { VariantProps } from 'tailwind-variants';

export const ButtonStylesDefaults = {
  color: 'info',
  hierarchy: 'primary',
  size: 'medium',
  variant: 'solid',
  isCurrent: false,
  isPending: false,
  isSelected: false,
} as const;

export const ButtonStyles = tv({
  base: [
    'flex w-content cursor-pointer items-center justify-center rounded-medium',
    'disabled:cursor-not-allowed',
  ],
  variants: {
    color: {
      info: '',
      serious: '',
      critical: '',
    },
    size: {
      large: 'gap-xs px-m py-s text-button-l',
      medium: 'gap-xs px-m py-s text-button-m',
      small: 'gap-xxs px-s py-xs text-button-s',
      xsmall: 'gap-xxs px-s py-xs text-button-xs',
    },
    variant: {
      solid: [
        'fg-inverse-light outline-none',
        'disabled:fg-disabled disabled:bg-interactive-disabled ',
        'disabled:hover:fg-disabled disabled:hover:bg-interactive-disabled',
        'disabled:focus:bg-interactive-disabled',
      ],
      outline: [
        'fg-default-light bg-transparent outline',
        'disabled:fg-disabled disabled:outline-interactive-disabled',
        'disabled:hover:fg-disabled',
        'disabled:focus:fg-disabled',
      ],
      flat: [
        'fg-default-light bg-transparent outline-none',
        'disabled:fg-disabled',
        'disabled:hover:bg-transparent',
        'disabled:focus:bg-transparent',
      ],
      icon: [
        'outline-none',
        'disabled:icon-disabled disabled:fg-disabled disabled:bg-transparent',
        'disabled:hover:fg-disabled disabled:hover:bg-transparent',
        'disabled:focus:fg-disabled disabled:focus:bg-transparent',
      ],
      floating: [
        'rounded-full',
        'disabled:icon-disabled disabled:bg-interactive-disabled disabled:outline-interactive-disabled',
        'disabled:hover:icon-disabled disabled:hover:bg-interactive-disabled',
        'disabled:focus:bg-interactive-disabled',
      ],
    },
    // Link specific
    isCurrent: {
      true: '',
      false: '',
    },
    // Button specific
    isPending: {
      true: '',
      false: '',
    },
    // ToggleButton specific
    isSelected: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: ['large', 'medium'],
      variant: ['icon', 'floating'],
      className: 'p-xs',
    },
    {
      size: ['small', 'xsmall'],
      variant: ['icon', 'floating'],
      className: 'p-xxs',
    },
    {
      size: ['large', 'medium'],
      variant: 'icon',
      className: 'rounded-medium',
    },
    {
      size: ['small', 'xsmall'],
      variant: 'icon',
      className: 'rounded-small',
    },

    // COLORS

    // Info
    {
      color: 'info',
      variant: 'solid',
      className: [
        'bg-interactive-default',
        'hover:bg-interactive-hover-light',
        'focus:bg-interactive-hover-light',
      ],
    },
    {
      color: 'info',
      variant: 'outline',
      className: [
        'fg-default-light outline-interactive',
        'hover:outline-interactive-hover',
        'focus:outline-interactive-hover',
      ],
    },
    {
      color: 'info',
      variant: 'flat',
      className: [
        'hover:bg-interactive-hover-dark',
        'focus:bg-interactive-hover-dark',
      ],
    },

    // Serious
    {
      color: 'serious',
      variant: 'solid',
      className: [
        'bg-serious',
        'hover:bg-serious-hover',
        'focus:bg-serious-hover',
      ],
    },
    {
      color: 'serious',
      variant: 'outline',
      className: [
        'outline-serious-hover',
        'hover:outline-serious-bold',
        'focus:outline-serious-bold',
      ],
    },
    {
      color: 'serious',
      variant: 'flat',
      className: ['hover:bg-serious-hover', 'focus:bg-serious-hover'],
    },
    {
      color: 'serious',
      hierarchy: 'primary',
      variant: ['icon', 'floating'],
      className: 'icon-serious',
    },
    {
      color: 'serious',
      hierarchy: 'secondary',
      variant: ['icon', 'floating'],
      className: 'icon-serious-hover',
    },
    {
      color: 'serious',
      hierarchy: ['primary', 'secondary'],
      variant: 'icon',
      className: ['hover:icon-serious', 'focus:icon-serious'],
    },
    {
      color: 'serious',
      hierarchy: ['primary', 'secondary'],
      variant: 'floating',
      className: ['hover:icon-serious', 'focus:icon-serious'],
    },

    // Critical
    {
      color: 'critical',
      variant: 'solid',
      className: [
        'fg-default-light bg-critical',
        'hover:bg-critical-hover',
        'focus:bg-critical-hover',
      ],
    },
    {
      color: 'critical',
      variant: 'outline',
      className: [
        'outline-critical-hover',
        'hover:outline-critical-bold',
        'focus:outline-critical-bold',
      ],
    },
    {
      color: 'critical',
      variant: 'flat',
      className: ['hover:bg-critical-hover', 'focus:bg-critical-hover'],
    },
    {
      color: 'critical',
      hierarchy: 'primary',
      variant: ['icon', 'floating'],
      className: 'icon-critical',
    },
    {
      color: 'critical',
      hierarchy: 'secondary',
      variant: ['icon', 'floating'],
      className: 'icon-critical-hover',
    },
    {
      color: 'critical',
      hierarchy: ['primary', 'secondary'],
      variant: 'icon',
      className: ['hover:icon-critical', 'focus:icon-critical'],
    },
    {
      color: 'critical',
      hierarchy: ['primary', 'secondary'],
      variant: 'floating',
      className: ['hover:icon-critical', 'focus:icon-critical'],
    },
  ],
  defaultVariants: ButtonStylesDefaults,
});

export type ButtonStyleVariants = VariantProps<typeof ButtonStyles>;
