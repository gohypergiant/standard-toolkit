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
'use client';

import 'client-only';
import {
  Button as AriaButton,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { ButtonContext } from './context';
import { ButtonStyles } from './styles';
import type { ButtonProps } from './types';

/**
 * Button - A versatile interactive button component with multiple variants
 *
 * Provides accessible button functionality with support for different visual styles,
 * sizes, and interactive states. Includes icon support and integrates with React Aria
 * for keyboard navigation and accessibility features.
 *
 * @example
 * // Basic button
 * <Button>Click me</Button>
 *
 * @example
 * // Primary button with different sizes
 * <Button variant="filled" size="large">Large Filled</Button>
 * <Button variant="outline" size="small">Small Outline</Button>
 *
 * @example
 * // Button with icon
 * <Button variant="flat">
 *   <Icon><Plus /></Icon>
 *   Add Item
 * </Button>
 *
 * @example
 * // Icon-only button
 * <Button variant="icon">
 *   <Icon><Settings /></Icon>
 * </Button>
 *
 * @example
 * // Button with different colors
 * <Button color="critical">Critical Button</Button>
 * <Button color="serious">Delete</Button>
 */
export function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);

  const {
    children,
    className,
    color = 'mono-muted',
    size = 'medium',
    variant,
    ...rest
  } = props;

  return (
    <IconProvider size={size}>
      <AriaButton
        {...rest}
        ref={ref}
        className={composeRenderProps(className, (className) =>
          ButtonStyles({
            className,
            variant,
          }),
        )}
        data-color={color}
        data-size={size}
      >
        {children}
      </AriaButton>
    </IconProvider>
  );
}
