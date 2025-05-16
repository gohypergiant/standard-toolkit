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
  SearchFieldProps as RACSearchFieldProps,
  SearchFieldRenderProps as RACSearchFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { OmitProtectedProps } from '../../types/props';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type { IconClassNames, IconProps } from '../icon/types';
import type { InputClassNames, InputSize } from '../input/types';

export type SearchFieldClassNames = PartialDeep<{
  container: string;
  group: string;
  icon: IconClassNames;
  input: InputClassNames;
  clear: ButtonClassNames;
}>;

export type SearchFieldSizes = 'sm' | 'lg';

export type SearchFieldVariants = 'solid' | 'hollow';

export type SearchFieldMapping = {
  icon: Partial<Record<SearchFieldSizes, OmitProtectedProps<IconProps>>>;
  clear: Partial<Record<SearchFieldSizes, OmitProtectedProps<ButtonProps>>>;
};

type BaseSearchFieldProps = {
  classNames?: SearchFieldClassNames;
  mapping?: Partial<SearchFieldMapping>;
  size?: InputSize;
  variant?: SearchFieldVariants;
};

export type SearchFieldRenderProps = AsType<RACSearchFieldRenderProps>;

export type SearchFieldState = Omit<SearchFieldRenderProps, 'state'> &
  Required<Pick<BaseSearchFieldProps, 'variant' | 'size'>>;

export type SearchFieldProps = Omit<
  RACSearchFieldProps,
  'className' | 'style' | 'type'
> &
  BaseSearchFieldProps;
