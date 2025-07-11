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

import type { RenderPropsClassName } from '@/lib/types';
import type { PropsWithChildren, RefAttributes } from 'react';
import type {
  TextAreaProps as AriaTextAreaProps,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import type { TextAreaStyleVariants } from './styles';

// TextArea.Input
export type TextAreaProps = AriaTextAreaProps &
  TextAreaStyleVariants &
  RefAttributes<HTMLTextAreaElement> & {
    selectOnFocus?: boolean;
    className?: string;
  };

// TextArea
export type TextAreaFieldProps = AriaTextFieldProps &
  TextAreaStyleVariants & {
    description?: string;
    errorMessage?: string;
    label?: string;
    placeholder?: string;
    selectOnFocus?: boolean;
    classNames?: {
      field?: RenderPropsClassName<AriaTextFieldProps>;
      input?: string;
      label?: string;
      description?: RenderPropsClassName<{ isDisabled?: boolean }>;
    };
  };

// TextArea.Provider
export type TextAreaFieldProviderProps = PropsWithChildren<
  Omit<TextAreaFieldProps, 'className'>
>;
