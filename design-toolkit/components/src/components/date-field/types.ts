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

import type { ForwardedRef } from 'react';
import type {
  DateFieldProps as AriaDateFieldProps,
  DateInputProps as AriaDateInputProps,
  DateValue,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { DateFieldStyles } from './styles';

export interface DateInputProps
  extends VariantProps<typeof DateFieldStyles>,
    Omit<AriaDateInputProps, 'size'> {
  ref?: ForwardedRef<HTMLDivElement>;
  size?: 'small' | 'medium';
}

export interface DateFieldProps<T extends DateValue>
  extends VariantProps<typeof DateFieldStyles>,
    Omit<AriaDateFieldProps<T>, 'style'>,
    Omit<AriaDateInputProps, 'children' | 'style'> {
  size?: 'small' | 'medium';
  className?: string;
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  shortMonth?: boolean;
}
