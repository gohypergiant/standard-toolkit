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
  SwitchProps as RACSwitchProps,
  SwitchRenderProps as RACSwitchRenderProps,
} from 'react-aria-components';
import type { RenderPropsChildren } from '../../types/react-aria';

export type SwitchClassNames = Partial<{
  container: string;
  switch: string;
  label: string;
  indicator: string;
}>;

export type SwitchAlignment = 'start' | 'end';

export type SwitchRenderProps = RACSwitchRenderProps;

export type BaseSwitchProps = {
  children?: RenderPropsChildren<SwitchRenderProps>;
  classNames?: SwitchClassNames;
  alignInput?: SwitchAlignment;
};

export type SwitchState = Omit<SwitchRenderProps, 'state'> &
  Required<Pick<BaseSwitchProps, 'alignInput'>>;

export type SwitchProps = Omit<
  RACSwitchProps,
  'children' | 'className' | 'style'
> &
  BaseSwitchProps;
