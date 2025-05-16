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
  RadioGroupProps as RACRadioGroupProps,
  RadioGroupRenderProps as RACRadioGroupRenderProps,
  RadioProps as RACRadioProps,
  RadioRenderProps as RACRadioRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { RenderPropsChildren } from '../../types/react-aria';

export type RadioAlignment = 'start' | 'end';

export type RadioClassNames = PartialDeep<{
  group: {
    container: string;
    group: string;
  };
  radio: {
    container: string;
    radio: string;
  };
  label: string;
}>;

export type RadioGroupRenderProps = RACRadioGroupRenderProps;

export type RadioGroupProps = Omit<RACRadioGroupProps, 'className' | 'style'> &
  Pick<BaseRadioProps, 'alignInput' | 'classNames' | 'label'>;

export type RadioGroupState = Omit<RadioGroupRenderProps, 'state'>;

export type RadioRenderProps = Omit<RACRadioRenderProps, 'state'>;

type BaseRadioProps = {
  children?: RenderPropsChildren<RadioRenderProps>;
  label?: string;
  classNames?: RadioClassNames;
  alignInput?: RadioAlignment;
};

export type RadioProps = Omit<
  RACRadioProps,
  'children' | 'className' | 'style'
> &
  BaseRadioProps;

export type RadioContextProps = Omit<RadioProps, 'value'>;

export type RadioState = RadioRenderProps & Pick<BaseRadioProps, 'alignInput'>;
