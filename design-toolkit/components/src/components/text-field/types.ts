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
  TextFieldProps as AriaTextFieldProps,
  FieldErrorProps,
} from 'react-aria-components';
import type { SIZE_RANGES, SizeVariant } from '@/constants/size-variants';
import type { InputProps } from '../input/types';
import type { LabelProps } from '../label/types';

export type TextFieldProps = Omit<
  AriaTextFieldProps,
  'children' | 'className' | 'type' | 'pattern'
> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      field?: AriaTextFieldProps['className'];
      label?: LabelProps['className'];
      input?: InputProps['classNames'];
      description?: string;
      error?: FieldErrorProps['className'];
    };
    label?: string;
    inputProps?: InputProps;
    description?: string;
    errorMessage?: string;
    size?: Extract<SizeVariant, (typeof SIZE_RANGES.COMPACT)[number]>;
  };
