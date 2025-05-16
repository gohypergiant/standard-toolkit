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
  ComboBoxProps as RACComboBoxProps,
  ComboBoxRenderProps as RACComboBoxRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { OmitProtectedProps } from '../../types';
import type { AsType } from '../../types/generic';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type { InputClassNames } from '../input/types';
import type { OptionsClassNames } from '../options/types';

export type ComboBoxClassNames = PartialDeep<{
  container: string;
  comboBox: string;
  label: string;
  group: string;
  input: InputClassNames;
  toggle: ButtonClassNames;
  description: string;
  error: string;
  options: OptionsClassNames;
}>;

export type ComboBoxSizes = 'sm' | 'lg';

export type ComboBoxMapping = {
  description: Partial<Record<ComboBoxSizes, string>>;
  error: Partial<Record<ComboBoxSizes, string>>;
  toggle: Partial<Record<ComboBoxSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseComboBoxProps = {
  classNames?: ComboBoxClassNames;
  mapping?: Partial<ComboBoxMapping>;
  size?: ComboBoxSizes;
};

export type ComboBoxRenderProps = AsType<RACComboBoxRenderProps>;

export type ComboBoxState = ComboBoxRenderProps &
  Required<Pick<BaseComboBoxProps, 'size'>>;

export type ComboBoxProps<T extends object> = Omit<
  RACComboBoxProps<T>,
  'className' | 'style'
> &
  BaseComboBoxProps;
