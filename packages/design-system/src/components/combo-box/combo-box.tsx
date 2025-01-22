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
  type ComboBoxRenderProps,
  type ContextValue,
  type FieldErrorProps,
  type LabelProps,
  Provider,
  ComboBox as RACComboBox,
  type GroupProps as RACGroupProps,
  type TextProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  AriaFieldErrorContext,
  AriaGroupContext,
  AriaLabelContext,
  AriaTextContext,
} from '../aria';
import { ButtonContext, type ButtonProps } from '../button';
import { InputContext, type InputProps } from '../input';
import { OptionsContext, type OptionsProps } from '../options';
import { comboBoxClassNames, comboBoxStateVars } from './combo-box.css';
import type { ComboBoxMapping, ComboBoxProps } from './types';

const defaultMapping: ComboBoxMapping = {
  description: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  error: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  toggle: {
    sm: { size: 'sm', variant: 'icon' },
    lg: { size: 'md', variant: 'icon' },
  },
};

export const ComboBoxContext =
  createContext<ContextValue<ComboBoxProps<object>, HTMLDivElement>>(null);

export const ComboBox = forwardRef(function ComboBox<T extends object>(
  props: ComboBoxProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, ComboBoxContext);
  props = useDefaultProps(props, 'ComboBox');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = 'lg',
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
      mergeClassNames(comboBoxClassNames, theme.ComboBox, classNamesProp, {
        description: mapping.description[size],
        error: mapping.error[size],
      }),
    [theme.ComboBox, classNamesProp, mapping, size],
  );

  const values = useMemo<
    [
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof AriaGroupContext, ContextValue<RACGroupProps, HTMLDivElement>],
      [typeof InputContext, ContextValue<InputProps, HTMLInputElement>],
      [typeof ButtonContext, ContextValue<ButtonProps, HTMLButtonElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [
        typeof AriaFieldErrorContext,
        ContextValue<FieldErrorProps, HTMLElement>,
      ],
      [typeof OptionsContext, ContextValue<OptionsProps, HTMLElement>],
    ]
  >(
    () => [
      [
        AriaLabelContext,
        {
          className: classNames?.label,
        },
      ],
      [
        AriaGroupContext,
        {
          className: classNames?.group,
        },
      ],
      [InputContext, { classNames: classNames?.input, size }],
      [
        ButtonContext,
        {
          ...mapping.toggle[size],
          classNames: classNames?.toggle,
        },
      ],
      [
        AriaTextContext,
        {
          slots: {
            description: { className: classNames?.description },
          },
        },
      ],
      [AriaFieldErrorContext, { className: classNames?.error }],
      [OptionsContext, { classNames: classNames?.options, size }],
    ],
    [classNames, mapping, size],
  );

  const style = useCallback(
    (renderProps: ComboBoxRenderProps) =>
      inlineVars(comboBoxStateVars, {
        ...renderProps,
        size,
      }),
    [size],
  );

  const children = useCallback(
    (renderProps: ComboBoxRenderProps) => (
      <div className={classNames?.comboBox}>
        <Provider values={values}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </Provider>
      </div>
    ),
    [classNames?.comboBox, values, childrenProp],
  );

  return (
    <RACComboBox
      {...props}
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACComboBox>
  );
});
