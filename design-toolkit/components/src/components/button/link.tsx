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
  composeRenderProps,
  Link,
  useContextProps,
} from 'react-aria-components';
import { IconProvider } from '../icon/context';
import { LinkButtonContext } from './context';
import { LinkButtonStyles } from './styles';
import type { LinkButtonProps } from './types';

/**
 * LinkButton - A button component that renders as a link element
 *
 * Provides accessible link functionality with button-like styling and visual feedback.
 * Perfect for navigation actions that should look like buttons but behave as links.
 * Includes icon support and integrates with React Aria for keyboard navigation and accessibility.
 *
 * @example
 * // Basic link button
 * <LinkButton href="/dashboard">Go to Dashboard</LinkButton>
 *
 * @example
 * // Link button with different variants and sizes
 * <LinkButton variant="filled" size="large" href="/create">Create New</LinkButton>
 * <LinkButton variant="outline" size="small" href="/settings">Settings</LinkButton>
 *
 * @example
 * // Link button with icon
 * <LinkButton variant="flat" href="/profile">
 *   <Icon><User /></Icon>
 *   View Profile
 * </LinkButton>
 *
 * @example
 * // Icon-only link button
 * <LinkButton variant="icon" href="/help">
 *   <Icon><HelpCircle /></Icon>
 * </LinkButton>
 *
 * @example
 * // Link button with different colors
 * <LinkButton color="critical" href="/delete">Delete Account</LinkButton>
 * <LinkButton color="serious" href="/reset">Reset Data</LinkButton>
 */
export function LinkButton({ ref, ...props }: LinkButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, LinkButtonContext);

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
      <Link
        {...rest}
        ref={ref}
        className={composeRenderProps(className, (className) =>
          LinkButtonStyles({
            className,
            variant,
          }),
        )}
        data-color={color}
        data-size={size}
      >
        {children}
      </Link>
    </IconProvider>
  );
}
