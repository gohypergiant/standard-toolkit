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
  TimeFieldProps as RACTimeFieldProps,
  DateFieldRenderProps as RACTimeFieldRenderProps,
  TimeValue,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { OmitProtectedProps } from '../../types/props';
import type { DateInputClassNames } from '../date-input/types';
import type { IconClassNames, IconProps } from '../icon/types';

export type TimeFieldClassNames = PartialDeep<{
  container: string;
  timeField: string;
  icon: IconClassNames;
  input: DateInputClassNames;
  description: string;
  error: string;
  label: string;
}>;

export type TimeFieldSizes = 'sm' | 'lg';

export type TimeFieldMapping = {
  description: Partial<Record<TimeFieldSizes, string>>;
  error: Partial<Record<TimeFieldSizes, string>>;
  icon: Partial<Record<TimeFieldSizes, OmitProtectedProps<IconProps>>>;
};

type BaseTimeFieldProps = {
  classNames?: TimeFieldClassNames;
  mapping?: Partial<TimeFieldMapping>;
  size?: TimeFieldSizes;
};

export type TimeFieldRenderProps = AsType<RACTimeFieldRenderProps>;

export type TimeFieldProps<T extends TimeValue> = Omit<
  RACTimeFieldProps<T>,
  'className' | 'style'
> &
  BaseTimeFieldProps;

export type TimeFieldState = Omit<TimeFieldRenderProps, 'state'> &
  Required<Pick<BaseTimeFieldProps, 'size'>>;
