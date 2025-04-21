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
  DateValue,
  DateFieldProps as RACDateFieldProps,
  DateFieldRenderProps as RACDateFieldRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType, OmitProtectedProps } from '../../types';
import type { DateInputClassNames } from '../date-input/types';
import type { IconClassNames, IconProps } from '../icon';

export type DateFieldClassNames = PartialDeep<{
  container: string;
  dateField: string;
  icon: IconClassNames;
  input: DateInputClassNames;
  description: string;
  error: string;
  label: string;
}>;

export type DateFieldSizes = 'sm' | 'lg';

export type DateFieldMapping = {
  description: Partial<Record<DateFieldSizes, string>>;
  error: Partial<Record<DateFieldSizes, string>>;
  icon: Partial<Record<DateFieldSizes, OmitProtectedProps<IconProps>>>;
};

type BaseDateFieldProps = {
  classNames?: DateFieldClassNames;
  mapping?: Partial<DateFieldMapping>;
  size?: DateFieldSizes;
};

export type DateFieldRenderProps = AsType<RACDateFieldRenderProps>;

export type DateFieldProps<T extends DateValue> = Omit<
  RACDateFieldProps<T>,
  'className' | 'style'
> &
  BaseDateFieldProps;

export type DateFieldState = Omit<DateFieldRenderProps, 'state'> &
  Required<Pick<BaseDateFieldProps, 'size'>>;
