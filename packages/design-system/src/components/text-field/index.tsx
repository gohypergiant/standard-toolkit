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
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { bodies } from '../../styles/typography.css';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
import {
  AriaFieldErrorContext,
  type AriaLabelContext,
  AriaTextContext,
} from '../aria';
import { InputContext } from '../input';
import { textFieldClassNames, textFieldStateVars } from './text-field.css';
import type { InputProps } from '../input/types';
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

const defaultSize = 'lg';

export const TextFieldContext =
  createContext<ContextValue<TextFieldProps, HTMLDivElement>>(null);

export const TextField = forwardRef(function TextField(
  props: TextFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TextFieldContext);

  props = useDefaultProps(props, 'TextField');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = defaultSize,
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
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACTextField>
  );
});
