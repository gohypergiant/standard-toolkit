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
import type {
  ButtonProps,
  ButtonProviderProps,
  LinkButtonProps,
  LinkButtonProviderProps,
  ToggleButtonProps,
  ToggleButtonProviderProps,
} from './types';

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

function ButtonProvider({ children, ...props }: ButtonProviderProps) {
  return (
    <ButtonContext.Provider value={props}>{children}</ButtonContext.Provider>
  );
}
ButtonProvider.displayName = 'Button.Provider';

export function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);

  const {
    children,
    className,
    color,
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
            color,
            variant,
          }),
        )}
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

function LinkButtonProvider({ children, ...props }: LinkButtonProviderProps) {
  return (
    <LinkButtonContext.Provider value={props}>
      {children}
    </LinkButtonContext.Provider>
  );
}
LinkButtonProvider.displayName = 'LinkButton.Provider';

export function LinkButton({ ref, ...props }: LinkButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, LinkButtonContext);

  const {
    children,
    className,
    color,
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
            color,
            variant,
          }),
        )}
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
}: ToggleButtonProviderProps) {
  return (
    <ToggleButtonContext.Provider value={props}>
      {children}
    </ToggleButtonContext.Provider>
  );
}
ToggleButtonProvider.displayName = 'ToggleButton.Provider';

export function ToggleButton({ ref, ...props }: ToggleButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ToggleButtonContext);

  const {
    children,
    className,
    color,
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
            color,
            variant,
          }),
        )}
        data-size={size}
      >
        {children}
      </AriaToggleButton>
    </Icon.Provider>
  );
}
ToggleButton.displayName = 'ToggleButton';
ToggleButton.Provider = ToggleButtonProvider;
