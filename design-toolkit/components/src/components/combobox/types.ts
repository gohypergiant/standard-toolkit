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

import type { ReactNode } from 'react';
import {
  type ComboBoxProps as AriaComboBoxProps,
  type InputProps as AriaInputProps,
  type ListLayoutOptions as AriaListLayoutOptions,
  type VirtualizerProps as AriaVirtualizerProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { OptionsDataItem } from '../options/types';
import type { ComboBoxStyles } from './styles';

export interface InputProps
  extends VariantProps<typeof ComboBoxStyles>,
    Omit<AriaInputProps, 'size'> {
  isReadOnly?: boolean;
}

export interface ComboBoxProps<T extends OptionsDataItem>
  extends Omit<
      VariantProps<typeof ComboBoxStyles>,
      'isDisabled' | 'isInvalid' | 'isReadOnly'
    >,
    Omit<AriaComboBoxProps<T>, 'children'>,
    Pick<AriaVirtualizerProps<AriaListLayoutOptions>, 'layoutOptions'> {
  className?: string;
  children: ReactNode | ((item: T) => ReactNode);
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  size?: 'small' | 'medium';
}
