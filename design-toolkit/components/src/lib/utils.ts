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

import { type ClassValue, clsx } from 'clsx';
import type { ForwardedRef } from 'react';
import type { ContextValue } from 'react-aria-components';
import { extendTailwindMerge, validators } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';

type AdditionalClassGroupIds = 'icon' | 'icon-size' | 'fg';

export const twMerge = extendTailwindMerge<AdditionalClassGroupIds>({
  extend: {
    classGroups: {
      icon: [{ icon: ['', validators.isAny] }],
      fg: [{ fg: ['', validators.isAny] }],
    },
    conflictingClassGroups: {
      fg: ['icon', 'text-color'],
    },
    theme: {
      color: [
        'current',
        'surface-default',
        'surface-raised',
        'surface-overlay',
        'transparent-dark',
        'transparent-light',
        'interactive-default',
        'interactive-hover-light',
        'interactive-hover-dark',
        'interactive-disabled',
        'static-light',
        'static-dark',
        'interactive',
        'interactive-hover',
        'highlight-bold',
        'highlight-hover',
        'highlight-subtle',
        'info-bold',
        'info-hover',
        'info-subtle',
        'advisory-bold',
        'advisory-hover',
        'advisory-subtle',
        'normal-bold',
        'normal-hover',
        'normal-subtle',
        'serious-bold',
        'serious-hover',
        'serious-subtle',
        'critical-bold',
        'critical-hover',
        'critical-subtle',
        'default-light',
        'default-dark',
        'inverse-dark',
        'inverse-light',
        'disabled',
        'highlight',
        'info',
        'advisory',
        'normal',
        'serious',
        'critical',
        'classification-missing',
        'classification-unclass',
        'classification-cui',
        'classification-confidential',
        'classification-secret',
        'classification-top-secret',
      ],
      font: ['primary', 'display'],
      text: [
        'header-xxl',
        'header-xl',
        'header-l',
        'header-m',
        'header-s',
        'header-xs',
        'body-xl',
        'body-l',
        'body-m',
        'body-s',
        'body-xs',
        'body-xxs',
        'button-xl',
        'button-l',
        'button-m',
        'button-s',
        'button-xs',
      ],
      radius: ['none', 'small', 'medium', 'large', 'round'],
      shadow: ['elevation-default', 'elevation-overlay', 'elevation-raised'],
      spacing: [
        'none',
        '0',
        'xxs',
        'xs',
        's',
        'm',
        'l',
        'xl',
        'xxl',
        'oversized',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tv = createTV({
  twMergeConfig: {
    extend: {
      classGroups: {
        icon: [{ icon: ['', validators.isAny] }],
        fg: [{ fg: ['', validators.isAny] }],
      },
      conflictingClassGroups: {
        fg: ['icon', 'text-color'],
      },
      theme: {
        bg: [
          'bg-surface-default',
          'bg-surface-raised',
          'bg-surface-overlay',
          'bg-surface-muted',
          'bg-interactive-bold',
          'bg-interactive-bold-hover',
          'bg-interactive-bold-pressed',
          'bg-interactive-muted',
          'bg-interactive-muted-hover',
          'bg-interactive-muted-pressed',
          'bg-interactive-disabled',
          'bg-accent-primary-bold',
          'bg-accent-primary-hover',
          'bg-accent-primary-pressed',
          'bg-accent-primary-muted',
          'bg-info-bold',
          'bg-info-hover',
          'bg-info-pressed',
          'bg-info-muted',
          'bg-advisory-bold',
          'bg-advisory-hover',
          'bg-advisory-pressed',
          'bg-advisory-muted',
          'bg-normal-bold',
          'bg-normal-hover',
          'bg-normal-pressed',
          'bg-normal-muted',
          'bg-serious-bold',
          'bg-serious-hover',
          'bg-serious-pressed',
          'bg-serious-muted',
          'bg-critical-bold',
          'bg-critical-hover',
          'bg-critical-pressed',
          'bg-critical-muted',
        ],
        fg: [
          'fg-primary-bold',
          'fg-primary-muted',
          'fg-inverse-bold',
          'fg-inverse-muted',
          'fg-disabled',
          'fg-accent-primary-bold',
          'fg-accent-primary-hover',
          'fg-accent-primary-pressed',
          'fg-info-bold',
          'fg-info-hover',
          'fg-primary-muted',
          'fg-advisory-bold',
          'fg-advisory-hover',
          'fg-advisory-pressed',
          'fg-normal-bold',
          'fg-normal-hover',
          'fg-normal-pressed',
          'fg-serious-bold',
          'fg-serious-hover',
          'fg-serious-pressed',
          'fg-critical-bold',
          'fg-critical-hover',
          'fg-critical-pressed',
          'fg-a11y-on-accent',
          'fg-a11y-on-utility',
        ],
        outline: [
          'outline-static',
          'outline-interactive',
          'outline-interactive-hover',
          'outline-interactive-pressed',
          'outline-interactive-disabled',
          'outline-accent-primary-bold',
          'outline-accent-primary-hover',
          'outline-accent-primary-pressed',
          'outline-info-bold',
          'outline-info-hover',
          'outline-info-pressed',
          'outline-advisory-bold',
          'outline-advisory-hover',
          'outline-advisory-pressed',
          'outline-normal-bold',
          'outline-normal-hover',
          'outline-normal-pressed',
          'outline-serious-bold',
          'outline-serious-hover',
          'outline-serious-pressed',
          'outline-critical-bold',
          'outline-critical-hover',
          'outline-critical-pressed',
        ],
        font: ['primary', 'display'],
        text: [
          'header-xxl',
          'header-xl',
          'header-l',
          'header-m',
          'header-s',
          'header-xs',
          'body-xl',
          'body-l',
          'body-m',
          'body-s',
          'body-xs',
          'body-xxs',
          'button-xl',
          'button-l',
          'button-m',
          'button-s',
          'button-xs',
        ],
        radius: ['none', 'small', 'medium', 'large', 'round'],
        shadow: ['elevation-default', 'elevation-overlay', 'elevation-raised'],
        spacing: [
          'none',
          '0',
          'xxs',
          'xs',
          's',
          'm',
          'l',
          'xl',
          'xxl',
          'oversized',
        ],
      },
    },
  },
});

// Types copied from RAC due to not being exported
type WithRef<T, E> = T & {
  ref?: ForwardedRef<E>;
};

interface SlottedValue<T> {
  slots?: Record<string | symbol, T>;
}

/**
 * A helper to narrow the type of Context Value
 */
export function isSlottedContextValue<T, E>(
  context: ContextValue<T, E>,
): context is SlottedValue<WithRef<T, E>> {
  return !!context && 'slots' in context;
}
