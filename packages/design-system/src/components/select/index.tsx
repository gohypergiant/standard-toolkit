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
  Select as AriaSelect,
  type ContextValue,
  type FieldErrorProps,
  type LabelProps,
  Provider,
  type SelectRenderProps as RACSelectRenderProps,
  type SelectValueProps,
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
  AriaLabelContext,
  AriaSelectValueContext,
  AriaTextContext,
} from '../aria';
import { ButtonContext } from '../button';
import type { ButtonProps } from '../button/types';
import { OptionsContext } from '../options';
import type { OptionsProps } from '../options/types';
import { selectClassNames, selectStateVars } from './select.css';
import type { SelectMapping, SelectProps } from './types';

const defaultMapping: SelectMapping = {
  description: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  error: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  toggle: {
    sm: { size: 'sm', variant: 'hollow' },
    lg: { size: 'md', variant: 'hollow' },
  },
};

export const SelectContext =
  createContext<ContextValue<SelectProps<object>, HTMLDivElement>>(null);

export const Select = forwardRef(function Select<T extends object>(
  props: SelectProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, SelectContext);
  props = useDefaultProps(props, 'Select');

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
      mergeClassNames(selectClassNames, theme.Select, classNamesProp, {
        description: mapping.description[size],
        error: mapping.error[size],
      }),
    [classNamesProp, theme.Select, mapping, size],
  );

  const values = useMemo<
    [
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof ButtonContext, ContextValue<ButtonProps, HTMLButtonElement>],
      [
        typeof AriaSelectValueContext,
        ContextValue<SelectValueProps<object>, HTMLSpanElement>,
      ],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [
        typeof AriaFieldErrorContext,
        ContextValue<FieldErrorProps, HTMLElement>,
      ],
      [typeof OptionsContext, ContextValue<OptionsProps, HTMLElement>],
    ]
  >(
    () => [
      [AriaLabelContext, { className: classNames?.label }],
      [
        ButtonContext,
        {
          ...mapping.toggle[size],
          classNames: classNames?.toggle,
        },
      ],
      [
        AriaSelectValueContext,
        {
          className: classNames?.value,
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
    (renderProps: RACSelectRenderProps) =>
      inlineVars(selectStateVars, {
        ...renderProps,
        size,
      }),
    [size],
  );

  const children = useCallback(
    (renderProps: RACSelectRenderProps) => (
      <div className={classNames?.select}>
        <Provider values={values}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </Provider>
      </div>
    ),
    [childrenProp, values, classNames?.select],
  );

  return (
    <AriaSelect
      {...props}
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </AriaSelect>
  );
});
