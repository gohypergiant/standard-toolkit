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
import {
  type ContextValue,
  type FieldErrorProps,
  LabelContext,
  type LabelProps,
  Provider,
  TextField as RACTextField,
  type TextFieldRenderProps,
  type TextProps,
} from 'react-aria-components';
import {
  AriaFieldErrorContext,
  type AriaLabelContext,
  AriaTextContext,
  InputContext,
  type InputProps,
} from '../../components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { textFieldClassNames, textFieldStateVars } from './text-field.css';
import type { TextFieldMapping, TextFieldProps } from './types';

const defaultMapping: TextFieldMapping = {
  description: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  error: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
};

export const TextFieldContext =
  createContext<ContextValue<TextFieldProps, HTMLDivElement>>(null);

export const TextField = forwardRef(function TextField(
  propsOriginal: TextFieldProps,
  refOriginal: ForwardedRef<HTMLDivElement>,
) {
  let [props, ref] = useContextProps(
    propsOriginal,
    refOriginal,
    TextFieldContext,
  );

  props = useDefaultProps(props, 'TextField');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = 'lg',
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
      mergeClassNames(textFieldClassNames, theme.TextField, classNamesProp, {
        description: mapping.description[size],
        error: mapping.error[size],
      }),
    [theme.TextField, classNamesProp, mapping, size],
  );

  const style = useCallback(
    (renderProps: TextFieldRenderProps) =>
      inlineVars(textFieldStateVars, {
        ...renderProps,
        size,
      }),
    [size],
  );
  const values = useMemo<
    [
      [typeof InputContext, ContextValue<InputProps, HTMLInputElement>],
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [
        typeof AriaFieldErrorContext,
        ContextValue<FieldErrorProps, HTMLElement>,
      ],
    ]
  >(
    () => [
      [InputContext, { classNames: classNames?.input, size }],
      [LabelContext, { className: classNames?.label }],
      [
        AriaTextContext,
        {
          slots: {
            description: { className: classNames?.description },
          },
        },
      ],
      [AriaFieldErrorContext, { className: classNames?.error }],
    ],
    [classNames, size],
  );

  const children = useCallback(
    (renderProps: TextFieldRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.textField}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.textField, values],
  );
  return (
    <RACTextField
      {...rest}
      ref={ref as LegacyRef<HTMLDivElement> | undefined}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACTextField>
  );
});
