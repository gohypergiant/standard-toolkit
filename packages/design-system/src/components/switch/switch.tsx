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
  type ForwardedRef,
  type LegacyRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { type ContextValue, Switch as RACSwitch } from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { switchClassNames, switchStateVars } from './switch.css';
import type { SwitchProps, SwitchRenderProps } from './types';

export const SwitchContext =
  createContext<ContextValue<SwitchProps, HTMLLabelElement>>(null);

export const Switch = forwardRef(function Switch(
  propsOriginal: SwitchProps,
  refOriginal: ForwardedRef<HTMLLabelElement>,
) {
  let [props, ref] = useContextProps(propsOriginal, refOriginal, SwitchContext);

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
      ref={ref as LegacyRef<HTMLLabelElement> | undefined}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACSwitch>
  );
});
