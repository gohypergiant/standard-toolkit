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

import { noop } from '@accelint/core';
import { clsx } from 'clsx';
import {
  type Context,
  type ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  type ButtonRenderProps,
  type ContextValue,
  Link,
  type LinkRenderProps,
  Provider,
  Button as RACButton,
  ToggleButton as RACToggleButton,
  type ToggleButtonRenderProps,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { surfaces } from '../../styles/surfaces.css';
import { bodies } from '../../styles/typography.css';
import type { OmitProtectedProps } from '../../types/props';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
import { IconContext } from '../icon';
import type { IconProps } from '../icon/types';
import { buttonClassNames, buttonStateVars } from './button.css';
import type {
  ButtonMapping,
  ButtonProps,
  ButtonSizes,
  LinkButtonProps,
  ToggleButtonProps,
} from './types';

const noopToggleState = {
  defaultSelected: false,
  isSelected: false,
  setSelected: noop,
  toggle: noop,
};
const buttonSizes: ButtonSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const defaultMapping: ButtonMapping = {
  font: bodies,
  icon: buttonSizes.reduce(
    (acc, size) => {
      acc[size] = { size };

      return acc;
    },
    {} as Record<ButtonSizes, OmitProtectedProps<IconProps>>,
  ),
};

function useButton<
  P extends ButtonProps | LinkButtonProps | ToggleButtonProps,
  E extends HTMLElement,
>(
  props: P,
  ref: ForwardedRef<E>,
  context: Context<ContextValue<P, E>>,
  key: 'Button' | 'LinkButton' | 'ToggleButton',
) {
  [props, ref] = useContextProps(props, ref, context);

  props = useDefaultProps(props, key);

  const {
    children: childrenProp,
    classNames: classNamesProp,
    color = 'primary',
    mapping: mappingProp,
    size = 'md',
    variant = 'solid',
    ...rest
  } = props;

  const theme = useTheme();

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(buttonClassNames, theme.Button, classNamesProp, {
        button: clsx(
          mapping.font[size],
          variant === 'floating' && surfaces.default.proud,
        ),
      }),
    [theme.Button, classNamesProp, mapping.font, size, variant],
  );

  const style = useCallback(
    (
      renderProps:
        | ButtonRenderProps
        | LinkRenderProps
        | ToggleButtonRenderProps,
    ) =>
      inlineVars(buttonStateVars, {
        isCurrent: false,
        isSelected: false,
        ...renderProps,
        color,
        size,
        variant,
      }),
    [color, size, variant],
  );

  const values = useMemo<
    [[typeof IconContext, ContextValue<IconProps, HTMLDivElement>]]
  >(() => [[IconContext, mapping.icon[size]]], [mapping.icon, size]);

  const children = useCallback(
    (
      renderProps:
        | ButtonRenderProps
        | LinkRenderProps
        | ToggleButtonRenderProps,
    ) => (
      <Provider values={values}>
        <span className={classNames?.button}>
          {callRenderProps(childrenProp, {
            state: noopToggleState,
            isCurrent: false,
            isPending: false,
            isSelected: false,
            ...renderProps,
          })}
        </span>
      </Provider>
    ),
    [values, classNames?.button, childrenProp],
  );

  return useMemo(
    () => ({ ...rest, ref, children, className: classNames?.container, style }),
    [rest, ref, children, classNames?.container, style],
  );
}

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const buttonProps = useButton(props, ref, ButtonContext, 'Button');

  return <RACButton {...buttonProps} />;
});

export const LinkButtonContext =
  createContext<ContextValue<LinkButtonProps, HTMLAnchorElement>>(null);

export const LinkButton = forwardRef(function LinkButton(
  props: LinkButtonProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  const buttonProps = useButton(props, ref, LinkButtonContext, 'LinkButton');

  return <Link {...buttonProps} />;
});

export const ToggleButtonContext =
  createContext<ContextValue<ToggleButtonProps, HTMLButtonElement>>(null);

export const ToggleButton = forwardRef(function ToggleButton(
  props: ToggleButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const buttonProps = useButton(
    props,
    ref,
    ToggleButtonContext,
    'ToggleButton',
  );

  return <RACToggleButton {...buttonProps} />;
});
