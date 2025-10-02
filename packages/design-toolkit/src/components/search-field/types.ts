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

import type { RefAttributes } from 'react';
import type {
  SearchFieldProps as AriaSearchFieldProps,
  InputProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { ButtonProps } from '../button/types';
import type { IconProps } from '../icon/types';
import type { SearchFieldStyles } from './styles';

export type SearchFieldStyleVariants = VariantProps<typeof SearchFieldStyles>;

export interface SearchFieldProps
  extends Omit<AriaSearchFieldProps, 'className' | 'pattern' | 'type'>,
    RefAttributes<HTMLDivElement> {
  classNames?: {
    field?: AriaSearchFieldProps['className'];
    input?: InputProps['className'];
    clear?: ButtonProps['className'];
    loading?: IconProps['className'];
    search?: IconProps['className'];
  };
  inputProps?: Omit<InputProps, 'type'>;
  variant?: 'filled' | 'outlined';
  /** Displays a loading spinner. */
  isLoading?: boolean;
}
