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

import {
  createContext,
  type ForwardedRef,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { type ContextValue, Switch as RACSwitch } from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
import { switchClassNames, switchStateVars } from './switch.css';
import type { SwitchProps, SwitchRenderProps } from './types';

export const SwitchContext =
  createContext<ContextValue<SwitchProps, HTMLLabelElement>>(null);

export const Switch = forwardRef(function Switch(
  props: SwitchProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  [props, ref] = useContextProps(props, ref, SwitchContext);

  props = useDefaultProps(props, 'Switch');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput,
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(switchClassNames, theme.Switch, classNamesProp),
    [theme.Switch, classNamesProp],
  );

  const style = useCallback(
    ({ state, ...renderProps }: SwitchRenderProps) =>
      inlineVars(switchStateVars, {
        ...renderProps,
        alignInput,
      }),
    [alignInput],
  );

  const children = useCallback(
    (renderProps: SwitchRenderProps) => {
      const child = callRenderProps(childrenProp, renderProps);

      return (
        <span className={classNames?.switch}>
          {child && <span className={classNames?.label}>{child}</span>}
          <span className={classNames?.indicator} />
        </span>
      );
    },
    [
      childrenProp,
      classNames?.switch,
      classNames?.label,
      classNames?.indicator,
    ],
  );

  return (
    <RACSwitch
      {...rest}
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACSwitch>
  );
});
