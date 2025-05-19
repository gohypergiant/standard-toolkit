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

import type { DateSegment as TDateSegment } from '@react-stately/datepicker';
import type { ReactElement } from 'react';
import type {
  DateInputProps as RACDateInputProps,
  DateInputRenderProps as RACDateInputRenderProps,
  DateSegmentProps as RACDateSegmentProps,
  DateSegmentRenderProps as RACDateSegmentRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { IconClassNames } from '../icon/types';

export type DateInputSizes = 'sm' | 'lg';

export type DateInputMapping = {
  input: Partial<Record<DateInputSizes, string>>;
};

type BaseDateInputProps = {
  classNames?: DateInputClassNames;
  mapping?: DateInputMapping;
  size?: DateInputSizes;
};

export type DateInputClassNames = PartialDeep<{
  icon: IconClassNames;
  input: {
    container: string;
    input: string;
    segments: string;
  };
  segment: {
    container: string;
    segment: string;
  };
}>;

export type DateInputProps = Omit<
  RACDateInputProps,
  'className' | 'style' | 'children'
> &
  (
    | { provider?: false; children?: (segment: TDateSegment) => ReactElement }
    | { provider: true; children?: RenderPropsChildren<DateInputRenderProps> }
  ) &
  BaseDateInputProps;

export type DateInputRenderProps = AsType<RACDateInputRenderProps>;

export type DateInputState = DateInputRenderProps &
  Required<Pick<BaseDateInputProps, 'size'>>;

export type DateSegmentsProps = {
  children: (segment: TDateSegment) => ReactElement;
} & BaseDateInputProps;

export type DateSegmentProps = AsType<RACDateSegmentProps> & BaseDateInputProps;

export type DateSegmentRenderProps = RACDateSegmentRenderProps;

export type DateSegmentState = DateSegmentRenderProps &
  Required<Pick<BaseDateInputProps, 'size'>>;
