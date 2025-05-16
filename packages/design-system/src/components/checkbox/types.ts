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

import type { Orientation } from '@react-types/shared';
import type {
  CheckboxGroupProps as RACCheckboxGroupProps,
  CheckboxGroupRenderProps as RACCheckboxGroupRenderProps,
  CheckboxProps as RACCheckboxProps,
  CheckboxRenderProps as RACCheckboxRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { IconClassNames } from '../icon/types';

export type CheckboxClassNames = PartialDeep<{
  group: {
    container: string;
    group: string;
    label: string;
  };
  checkbox: {
    container: string;
    checkbox: string;
    icon: IconClassNames;
    label: string;
  };
}>;

export type CheckboxAlignment = 'start' | 'end';

export type CheckboxRenderProps = RACCheckboxRenderProps;

type BaseCheckboxProps = {
  children?: RenderPropsChildren<CheckboxRenderProps>;
  label?: string;
  classNames?: CheckboxClassNames;
  alignInput?: CheckboxAlignment;
};

export type CheckboxState = Omit<CheckboxRenderProps, 'state'> &
  Required<Pick<BaseCheckboxProps, 'alignInput'>>;

export type CheckboxProps = Omit<
  RACCheckboxProps,
  'children' | 'className' | 'style'
> &
  BaseCheckboxProps;

export type CheckboxGroupRenderProps = RACCheckboxGroupRenderProps;

type BaseCheckboxGroupProps = {
  children?: RenderPropsChildren<CheckboxGroupRenderProps>;
  classNames?: CheckboxClassNames;
  label?: string;
  orientation?: Orientation;
} & Pick<BaseCheckboxProps, 'alignInput'>;

export type CheckboxGroupProps = Omit<
  RACCheckboxGroupProps,
  'children' | 'className' | 'style'
> &
  BaseCheckboxGroupProps;

export type CheckboxGroupState = Omit<CheckboxGroupRenderProps, 'state'> &
  Pick<BaseCheckboxGroupProps, 'orientation'>;
