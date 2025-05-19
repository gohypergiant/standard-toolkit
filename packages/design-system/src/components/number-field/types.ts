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
  NumberFieldProps as AriaNumberFieldProps,
  NumberFieldRenderProps as RACNumberFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { OmitProtectedProps } from '../../types/props';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type { InputClassNames } from '../input/types';

export type NumberFieldClassNames = PartialDeep<{
  container: string;
  decrement: ButtonClassNames;
  description: string;
  error: string;
  group: string;
  increment: ButtonClassNames;
  input: InputClassNames;
  label: string;
  numberField: string;
}>;

export type NumberFieldSizes = 'sm' | 'lg';

export type NumberFieldMapping = {
  description: Partial<Record<NumberFieldSizes, string>>;
  error: Partial<Record<NumberFieldSizes, string>>;
  increment: Partial<Record<NumberFieldSizes, OmitProtectedProps<ButtonProps>>>;
  decrement: Partial<Record<NumberFieldSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseNumberFieldProps = {
  classNames?: NumberFieldClassNames;
  mapping?: Partial<NumberFieldMapping>;
  size?: NumberFieldSizes;
};

export type NumberFieldRenderProps = Omit<RACNumberFieldRenderProps, 'state'>;

export type NumberFieldProps = Omit<
  AriaNumberFieldProps,
  'className' | 'style'
> &
  BaseNumberFieldProps;

export type NumberFieldState = NumberFieldRenderProps &
  Required<Pick<BaseNumberFieldProps, 'size'>>;
