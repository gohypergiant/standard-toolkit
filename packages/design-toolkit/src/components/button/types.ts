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
import type { AriaAttributesWithRef } from '@/lib/types';

type Variants = 'filled' | 'flat' | 'icon' | 'outline';

/**
 * Style variant options for Button and LinkButton components.
 */
export type ButtonStyleVariants = {
  /** Size of the button. */
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  /** Semantic color variant. */
  color?: 'mono-muted' | 'mono-bold' | 'accent' | 'serious' | 'critical';
  /** Visual style variant. */
  variant?: Variants;
};

/**
 * Style variant options for ToggleButton components.
 * Excludes 'filled' variant which is not supported for toggle buttons.
 */
export type ToggleButtonStyleVariants = Omit<ButtonStyleVariants, 'variant'> & {
  /** Visual style variant (filled not available for toggle). */
  variant?: Exclude<Variants, 'filled'>;
};

/**
 * Props for the Button component.
 *
 * Extends React Aria Button with style variants and ref support.
 */
export type ButtonProps = AriaButtonProps &
  ButtonStyleVariants &
  AriaAttributesWithRef<HTMLButtonElement>;

/**
 * Props for the LinkButton component.
 *
 * Extends React Aria Link with button style variants and ref support.
 */
export type LinkButtonProps = LinkProps &
  ButtonStyleVariants &
  AriaAttributesWithRef<HTMLAnchorElement>;

/**
 * Props for the ToggleButton component.
 *
 * Extends React Aria ToggleButton with style variants and ref support.
 */
export type ToggleButtonProps = AriaToggleButtonProps &
  ToggleButtonStyleVariants &
  AriaAttributesWithRef<HTMLButtonElement>;
