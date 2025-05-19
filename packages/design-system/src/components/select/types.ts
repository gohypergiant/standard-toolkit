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
  SelectProps as RACSelectProps,
  SelectRenderProps as RACSelectRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { OmitProtectedProps } from '../../types/props';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type { OptionsClassNames } from '../options/types';

export type SelectClassNames = PartialDeep<{
  container: string;
  select: string;
  label: string;
  toggle: ButtonClassNames;
  value: string;
  description: string;
  error: string;
  options: OptionsClassNames;
}>;

export type SelectSizes = 'sm' | 'lg';

export type SelectMapping = {
  description: Partial<Record<SelectSizes, string>>;
  error: Partial<Record<SelectSizes, string>>;
  toggle: Partial<Record<SelectSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseSelectProps = {
  classNames?: SelectClassNames;
  mapping?: Partial<SelectMapping>;
  size?: SelectSizes;
};

export type SelectRenderProps = AsType<RACSelectRenderProps>;

export type SelectState = SelectRenderProps &
  Required<Pick<BaseSelectProps, 'size'>>;

export type SelectProps<T extends object> = Omit<
  RACSelectProps<T>,
  'className' | 'style'
> &
  BaseSelectProps;
