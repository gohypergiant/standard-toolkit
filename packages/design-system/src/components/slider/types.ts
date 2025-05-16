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
  SliderOutputProps as RACSliderOutputProps,
  SliderProps as RACSliderProps,
  SliderRenderProps as RACSliderRenderProps,
  SliderThumbProps as RACSliderThumbProps,
  SliderThumbRenderProps as RACSliderThumbRenderProps,
  SliderTrackProps as RACSliderTrackProps,
  SliderTrackRenderProps as RACSliderTrackRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { GroupClassNames } from '../group/types';
import type { NumberFieldClassNames } from '../number-field/types';

export type SliderClassNames = PartialDeep<{
  slider: {
    container: string;
    slider: string;
    label: string;
    tick: string;
    min: string;
    max: string;
  };
  track: {
    container: string;
    track: string;
    bar: string;
  };
  thumb: {
    container: string;
    thumb: string;
  };
  numberField: NumberFieldClassNames;
  output: {
    container: string;
    output: string;
  };
  group: GroupClassNames & {
    numberField: NumberFieldClassNames;
  };
}>;

export type SliderLayout = 'stacked' | 'inline';

export type SliderRenderProps = AsType<RACSliderRenderProps>;
export type SliderThumbRenderProps = AsType<RACSliderThumbRenderProps>;
export type SliderTrackRenderProps = AsType<RACSliderTrackRenderProps>;

type BaseSliderProps = {
  children?: RenderPropsChildren<SliderRenderProps>;
  classNames?: SliderClassNames;
  layout?: SliderLayout;
  minValue?: number;
  maxValue?: number;
};

export type SliderState = Omit<RACSliderRenderProps, 'state'> &
  Required<Pick<BaseSliderProps, 'layout'>>;

export type SliderProps = Omit<
  RACSliderProps,
  'children' | 'classname' | 'style'
> &
  BaseSliderProps;

export type SliderThumbProps = Omit<
  RACSliderThumbProps,
  'className' | 'style'
> & {
  classNames?: SliderClassNames;
};

export type SliderThumbState = Omit<RACSliderThumbRenderProps, 'state'>;

export type SliderTrackProps = Omit<
  RACSliderTrackProps,
  'className' | 'style'
> & {
  classNames?: SliderClassNames;
};

export type SliderInputProps = Omit<
  AriaNumberFieldProps,
  'className' | 'style'
> & {
  classNames?: SliderClassNames;
};

export type SliderOutputProps = Omit<
  RACSliderOutputProps,
  'className' | 'style'
> & {
  classNames?: SliderClassNames;
};

export type SliderBarProps = {
  classNames?: SliderClassNames;
};
