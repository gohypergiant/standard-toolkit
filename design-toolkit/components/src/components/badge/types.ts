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

import type { Axis } from '@react-types/overlays';
import type { ComponentPropsWithRef } from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { BadgeStyles } from './styles';

export type BadgeProps = ComponentPropsWithRef<'span'> &
  VariantProps<typeof BadgeStyles> & {
    children?: string;
    offset?: number | { x?: number; y?: number };
    placement?: Axis | `${'top' | 'bottom'} ${'left' | 'right'}`;
  };
