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
  useMemo,
  useCallback,
  type LegacyRef,
} from 'react';
import {
  RadioGroup as RACRadioGroup,
  Radio as RACRadio,
  type ContextValue,
  Provider,
  type LabelProps,
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
  RadioGroupRenderProps,
  RadioGroupProps,
  RadioProps,
  RadioRenderProps,
  RadioContextProps,
} from './types';

export const RadioContext =
  createContext<ContextValue<RadioContextProps, HTMLLabelElement>>(null);

export const Radio = forwardRef(function Radio(
  propsOriginal: RadioProps,
  refOriginal: ForwardedRef<HTMLLabelElement>,
) {
  let [props, ref] = useContextProps(propsOriginal, refOriginal, RadioContext);

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
      ref={ref as LegacyRef<HTMLLabelElement> | undefined}
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
  propsOriginal: RadioGroupProps,
  refOriginal: ForwardedRef<HTMLDivElement>,
) {
  let [props, ref] = useContextProps(
    propsOriginal,
    refOriginal,
    RadioGroupContext,
  );

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
      ref={ref as LegacyRef<HTMLDivElement> | undefined}
      className={classNames?.group?.container}
      style={style}
      orientation={orientation}
    >
      {children}
    </RACRadioGroup>
  );
});
