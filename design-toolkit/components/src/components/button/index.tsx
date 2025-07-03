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
import { createContext } from 'react';
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  Link,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Icon } from '../icon';
import { ButtonStyles } from './styles';
import type {
  ButtonContextValue,
  ButtonProps,
  ButtonProviderProps,
  LinkButtonProps,
  ToggleButtonProps,
} from './types';

export const ButtonContext = createContext<ButtonContextValue>(null);

function ButtonProvider({ children, ...props }: ButtonProviderProps) {
  return (
    <ButtonContext.Provider value={props as ButtonContextValue}>
      {children}
    </ButtonContext.Provider>
  );
}

export function Button({ ref, ...props }: ButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);

  const { children, className, color, hierarchy, size, variant, ...rest } =
    props;

  return (
    <Icon.Provider size={size}>
      <AriaButton
        {...rest}
        className={composeRenderProps(className, (className, { isPending }) =>
          ButtonStyles({
            className,
            color,
            hierarchy,
            size,
            variant,
            isPending,
          }),
        )}
      >
        {children}
      </AriaButton>
    </Icon.Provider>
  );
}
Button.displayName = 'Button';
Button.Provider = ButtonProvider;

export function LinkButton({ ref, ...props }: LinkButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);

  const { children, className, color, hierarchy, size, variant, ...rest } =
    props;

  return (
    <Icon.Provider size={size}>
      <Link
        {...rest}
        className={composeRenderProps(className, (className, { isCurrent }) =>
          ButtonStyles({
            className,
            color,
            hierarchy,
            size,
            variant,
            isCurrent,
          }),
        )}
      >
        {children}
      </Link>
    </Icon.Provider>
  );
}
LinkButton.displayName = 'LinkButton';

export function ToggleButton({ ref, ...props }: ToggleButtonProps) {
  [props, ref] = useContextProps(props, ref ?? null, ButtonContext);

  const { children, className, color, hierarchy, size, variant, ...rest } =
    props;

  return (
    <Icon.Provider size={size}>
      <AriaToggleButton
        {...rest}
        className={composeRenderProps(className, (className, { isSelected }) =>
          ButtonStyles({
            className,
            color,
            hierarchy,
            size,
            variant,
            isSelected,
          }),
        )}
      >
        {children}
      </AriaToggleButton>
    </Icon.Provider>
  );
}
ToggleButton.displayName = 'ToggleButton';
