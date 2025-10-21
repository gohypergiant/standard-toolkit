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
  ButtonProps as AriaButtonProps,
  ToggleButtonProps as AriaToggleButtonProps,
  LinkProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { SizeRangeFull } from '@/constants/size';
import type { AriaAttributesWithRef } from '@/lib/types';
import type { ButtonStyles, ToggleButtonStyles } from './styles';

type ButtonVariantProps = {
  size?: SizeRangeFull;
  color?: 'mono-muted' | 'mono-bold' | 'accent' | 'serious' | 'critical';
};

export type ButtonStyleVariants = VariantProps<typeof ButtonStyles> &
  ButtonVariantProps;

export type ToggleButtonStyleVariants = VariantProps<
  typeof ToggleButtonStyles
> &
  ButtonVariantProps;

export type ButtonProps = AriaButtonProps &
  ButtonStyleVariants &
  AriaAttributesWithRef<HTMLButtonElement>;

export type LinkButtonProps = LinkProps &
  ButtonStyleVariants &
  AriaAttributesWithRef<HTMLAnchorElement>;

export type ToggleButtonProps = AriaToggleButtonProps &
  ToggleButtonStyleVariants &
  AriaAttributesWithRef<HTMLButtonElement>;
