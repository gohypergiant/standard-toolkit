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
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  type ContextValue,
  type LabelProps,
  Provider,
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaLabelContext } from '../aria';
import {
  radioClassNames,
  radioGroupStateVars,
  radioStateVars,
} from './radio.css';
import type {
  RadioContextProps,
  RadioGroupProps,
  RadioGroupRenderProps,
  RadioProps,
  RadioRenderProps,
} from './types';

export const RadioContext =
  createContext<ContextValue<RadioContextProps, HTMLLabelElement>>(null);

export const Radio = forwardRef(function Radio(
  props: RadioProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  [props, ref] = useContextProps(props, ref, RadioContext);
  props = useDefaultProps(props, 'Radio');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput = 'end',
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(radioClassNames, theme.Radio, classNamesProp),
    [classNamesProp, theme.Radio],
  );

  const style = useCallback(
    (renderProps: RadioRenderProps) =>
      inlineVars(radioStateVars, {
        ...renderProps,
        alignInput,
      }),
    [alignInput],
  );

  const children = useCallback(
    (renderProps: RadioRenderProps) => (
      <span className={classNames?.radio?.radio}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </span>
    ),
    [childrenProp, classNames?.radio],
  );

  return (
    <RACRadio
      {...rest}
      ref={ref}
      style={style}
      className={classNames?.radio?.container}
    >
      {children}
    </RACRadio>
  );
});

export const RadioGroupContext =
  createContext<ContextValue<RadioGroupProps, HTMLDivElement>>(null);

export const RadioGroup = forwardRef(function RadioGroup(
  props: RadioGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, RadioGroupContext);

  props = useDefaultProps(props, 'RadioGroup');

  const theme = useTheme();

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput = 'end',
    orientation = 'vertical',
    ...rest
  } = props;

  const classNames = useMemo(
    () => mergeClassNames(radioClassNames, theme.Radio, classNamesProp),
    [classNamesProp, theme.Radio],
  );

  const style = useCallback(
    (renderProps: RadioGroupRenderProps) =>
      inlineVars(radioGroupStateVars, {
        ...renderProps,
        alignInput,
        orientation,
      }),
    [alignInput, orientation],
  );

  const values = useMemo<
    [
      [typeof RadioContext, ContextValue<RadioContextProps, HTMLLabelElement>],
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
    ]
  >(
    () => [
      [
        RadioContext,
        {
          classNames,
          alignInput,
        },
      ],
      [
        AriaLabelContext,
        {
          className: classNames?.label,
        },
      ],
    ],
    [alignInput, classNames],
  );

  const children = useCallback(
    (renderProps: RadioGroupRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.group?.group}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.group, values],
  );

  return (
    <RACRadioGroup
      {...rest}
      ref={ref}
      className={classNames?.group?.container}
      style={style}
      orientation={orientation}
    >
      {children}
    </RACRadioGroup>
  );
});
