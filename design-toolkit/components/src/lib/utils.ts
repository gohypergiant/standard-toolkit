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
import { extendTailwindMerge, validators } from 'tailwind-merge';

type AdditionalClassGroupIds = 'icon' | 'icon-size' | 'fg';

export const twMerge = extendTailwindMerge<AdditionalClassGroupIds>({
  extend: {
    classGroups: {
      icon: [{ icon: ['', validators.isAny] }],
      'icon-size': [{ 'icon-size': ['', validators.isAny] }],
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
