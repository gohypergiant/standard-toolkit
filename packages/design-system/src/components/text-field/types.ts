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

import type {
  TextFieldProps as AriaTextFieldProps,
  TextFieldRenderProps as RACTextFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { InputClassNames } from '../input/types';

export type TextFieldClassNames = PartialDeep<{
  container: string;
  description: string;
  error: string;
  input: InputClassNames;
  label: string;
  textField: string;
}>;

export type TextFieldSizes = 'sm' | 'lg';

export type TextFieldMapping = {
  description: Partial<Record<TextFieldSizes, string>>;
  error: Partial<Record<TextFieldSizes, string>>;
};

type BaseTextFieldProps = {
  classNames?: TextFieldClassNames;
  mapping?: Partial<TextFieldMapping>;
  size?: TextFieldSizes;
};

export type TextFieldRenderProps = AsType<RACTextFieldRenderProps>;

export type TextFieldProps = AsType<
  Omit<AriaTextFieldProps, 'className' | 'style'>
> &
  BaseTextFieldProps;

export type TextFieldState = TextFieldRenderProps &
  Required<Pick<BaseTextFieldProps, 'size'>>;
