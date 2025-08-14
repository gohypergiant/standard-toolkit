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
import type { ProviderProps } from '@/lib/types';
import { createContext } from 'react';
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  type ContextValue,
  Link,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { ButtonStyles, LinkButtonStyles, ToggleButtonStyles } from './styles';
import type { ButtonProps, LinkButtonProps, ToggleButtonProps } from './types';

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

function ButtonProvider({ children, ...props }: ProviderProps<ButtonProps>) {
  return (
    <ButtonContext.Provider value={props}>{children}</ButtonContext.Provider>
  );
}
ButtonProvider.displayName = 'Button.Provider';

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
    color = 'info',
    size = 'medium',
    variant,
    ...rest
  } = props;

  return (
    <Icon.Provider size={size}>
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
    </Icon.Provider>
  );
}
Button.displayName = 'Button';
Button.Provider = ButtonProvider;

export const LinkButtonContext =
  createContext<ContextValue<LinkButtonProps, HTMLAnchorElement>>(null);

function LinkButtonProvider({
  children,
  ...props
}: ProviderProps<LinkButtonProps>) {
  return (
    <LinkButtonContext.Provider value={props}>
      {children}
    </LinkButtonContext.Provider>
  );
}
LinkButtonProvider.displayName = 'LinkButton.Provider';

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
    color = 'info',
    size = 'medium',
    variant,
    ...rest
  } = props;

  return (
    <Icon.Provider size={size}>
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
    </Icon.Provider>
  );
}
LinkButton.displayName = 'LinkButton';
LinkButton.Provider = LinkButtonProvider;

export const ToggleButtonContext =
  createContext<ContextValue<ToggleButtonProps, HTMLButtonElement>>(null);

function ToggleButtonProvider({
  children,
  ...props
}: ProviderProps<ToggleButtonProps>) {
  return (
    <ToggleButtonContext.Provider value={props}>
      {children}
    </ToggleButtonContext.Provider>
  );
}
ToggleButtonProvider.displayName = 'ToggleButton.Provider';

/**
 * ToggleButton - A button component that maintains pressed/unpressed state
 *
 * Provides accessible toggle functionality with visual feedback for the current state.
 * Perfect for features like favorites, bookmarks, switches, or any binary state controls.
 * Includes icon support and integrates with React Aria for keyboard navigation and accessibility.
 *
 * @example
 * // Basic toggle button
 * <ToggleButton>Toggle Feature</ToggleButton>
 *
 * @example
 * // Controlled toggle button with different variants
 * <ToggleButton variant="filled" isSelected={isEnabled} onChange={setIsEnabled}>
 *   Enable Notifications
 * </ToggleButton>
 *
 * @example
 * // Toggle button with icon and state
 * <ToggleButton variant="outline" isSelected={isFavorite} onChange={setIsFavorite}>
 *   <Icon><Heart /></Icon>
 *   {isFavorite ? 'Favorite' : 'Add to Favorites'}
 * </ToggleButton>
 *
 * @example
 * // Icon-only toggle button
 * <ToggleButton variant="icon" isSelected={isBookmarked} onChange={setIsBookmarked}>
 *   <Icon><Bookmark /></Icon>
 * </ToggleButton>
 *
 * @example
 * // Toggle button with different colors and sizes
 * <ToggleButton color="critical" size="small" isSelected={isEnabled}>
 *   Critical Toggle
 * </ToggleButton>
 */
export function ToggleButton({ ref, ...props }: ToggleButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ToggleButtonContext);

  const {
    children,
    className,
    color = 'info',
    size = 'medium',
    variant,
    ...rest
  } = props;

  return (
    <Icon.Provider size={size}>
      <AriaToggleButton
        {...rest}
        ref={ref}
        className={composeRenderProps(className, (className) =>
          ToggleButtonStyles({
            className,
            variant,
          }),
        )}
        data-color={color}
        data-size={size}
      >
        {children}
      </AriaToggleButton>
    </Icon.Provider>
  );
}
ToggleButton.displayName = 'ToggleButton';
ToggleButton.Provider = ToggleButtonProvider;
