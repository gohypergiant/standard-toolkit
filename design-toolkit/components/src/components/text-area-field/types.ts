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

import type { PropsWithChildren, Ref, RefAttributes } from 'react';
import type {
  FieldErrorProps,
  TextAreaProps,
  TextFieldProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { TextAreaStyles } from './styles';

export type TextAreaStyleVariants = VariantProps<typeof TextAreaStyles>;

export type TextAreaFieldProps = Omit<TextFieldProps, 'children'> &
  RefAttributes<HTMLDivElement> &
  TextAreaStyleVariants & {
    classNames?: {
      field?: TextFieldProps['className'];
      label?: string;
      input?: TextAreaProps['className'];
      description?: string;
      error?: FieldErrorProps['className'];
    };
    label?: string;
    inputRef?: Ref<HTMLTextAreaElement>;
    inputProps?: Omit<TextAreaProps, 'className'>;
    description?: string;
    errorMessage?: FieldErrorProps['children'];
    size?: 'medium' | 'small';
  };

export type TextAreaFieldProviderProps = PropsWithChildren<
  Omit<TextAreaFieldProps, 'ref'>
>;
