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
  type FieldErrorProps,
  LabelContext,
  type LabelProps,
  type NumberFieldRenderProps,
  Provider,
  type GroupProps as RACGroupProps,
  NumberField as RACNumberField,
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
  AriaGroupContext,
  type AriaLabelContext,
  AriaTextContext,
} from '../aria';
import { ButtonContext } from '../button';
import type { ButtonProps } from '../button/types';
import { InputContext } from '../input';
import type { InputProps } from '../input/types';
import {
  numberFieldClassNames,
  numberFieldStateVars,
} from './number-field.css';
import type { NumberFieldMapping, NumberFieldProps } from './types';

const defaultMapping: NumberFieldMapping = {
  description: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  error: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  increment: {
    sm: { size: 'xs', variant: 'bare' },
    lg: { size: 'sm', variant: 'bare' },
  },
  decrement: {
    sm: { size: 'xs', variant: 'bare' },
    lg: { size: 'sm', variant: 'bare' },
  },
};

export const NumberFieldContext =
  createContext<ContextValue<NumberFieldProps, HTMLDivElement>>(null);

export const NumberField = forwardRef(function NumberField(
  props: NumberFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, NumberFieldContext);

  props = useDefaultProps(props, 'NumberField');

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
      mergeClassNames(
        numberFieldClassNames,
        theme.NumberField,
        classNamesProp,
        {
          description: mapping.description[size],
          error: mapping.error[size],
        },
      ),
    [theme.NumberField, classNamesProp, mapping, size],
  );

  const style = useCallback(
    (renderProps: NumberFieldRenderProps) =>
      inlineVars(numberFieldStateVars, {
        ...renderProps,
        size,
      }),
    [size],
  );
  const values = useMemo<
    [
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [
        typeof AriaFieldErrorContext,
        ContextValue<FieldErrorProps, HTMLElement>,
      ],
      [typeof AriaGroupContext, ContextValue<RACGroupProps, HTMLDivElement>],
      [typeof ButtonContext, ContextValue<ButtonProps, HTMLButtonElement>],
      [typeof InputContext, ContextValue<InputProps, HTMLInputElement>],
    ]
  >(
    () => [
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
      [
        AriaGroupContext,
        {
          className: classNames?.group,
        },
      ],
      [
        ButtonContext,
        {
          slots: {
            increment: {
              ...mapping.increment[size],
              classNames: classNames?.increment,
            },
            decrement: {
              ...mapping.decrement[size],
              classNames: classNames?.decrement,
            },
          },
        },
      ],
      [InputContext, { classNames: classNames?.input, size }],
    ],
    [classNames, mapping, size],
  );

  const children = useCallback(
    (renderProps: NumberFieldRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.numberField}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.numberField, values],
  );
  return (
    <RACNumberField
      {...rest}
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACNumberField>
  );
});
