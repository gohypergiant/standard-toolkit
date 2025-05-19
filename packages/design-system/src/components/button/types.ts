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
  LinkProps,
  LinkRenderProps,
  ButtonProps as RACButtonProps,
  ButtonRenderProps as RACButtonRenderProps,
  ToggleButtonProps as RACToggleButtonProps,
  ToggleButtonRenderProps,
} from 'react-aria-components';
import type { OmitProtectedProps } from '../../types/props';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { IconProps } from '../icon/types';

export type ButtonClassNames = Partial<{
  container: string;
  button: string;
}>;

export type ButtonColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'advisory'
  | 'affirmative'
  | 'serious'
  | 'critical';

export type ButtonSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariants = 'solid' | 'hollow' | 'bare' | 'icon' | 'floating';

export type ButtonRenderProps = RACButtonRenderProps &
  LinkRenderProps &
  ToggleButtonRenderProps;

export type ButtonMapping = {
  font: Partial<Record<ButtonSizes, string>>;
  icon: Partial<Record<ButtonSizes, OmitProtectedProps<IconProps>>>;
};

type BaseButtonProps = {
  children?: RenderPropsChildren<ButtonRenderProps>;
  classNames?: ButtonClassNames;
  color?: ButtonColors;
  mapping?: Partial<ButtonMapping>;
  size?: ButtonSizes;
  variant?: ButtonVariants;
};

export type ButtonState = Omit<ButtonRenderProps, 'state'> &
  Required<Pick<BaseButtonProps, 'color' | 'size' | 'variant'>>;

export type ButtonProps = Omit<
  RACButtonProps,
  'children' | 'className' | 'style'
> &
  BaseButtonProps;

export type ToggleButtonProps = Omit<
  RACToggleButtonProps,
  'children' | 'className' | 'style'
> &
  BaseButtonProps;

export type LinkButtonProps = Omit<
  LinkProps,
  'children' | 'className' | 'style'
> &
  BaseButtonProps;
