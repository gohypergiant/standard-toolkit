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
  type DateValue,
  type FieldErrorProps,
  LabelContext,
  type LabelProps,
  Provider,
  DateField as RACDateField,
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
import { DateInputContext } from '../date-input';
import type { DateInputProps } from '../date-input/types';
import { IconContext } from '../icon';
import type { IconProps } from '../icon/types';
import { dateFieldClassNames, dateFieldStateVars } from './date-field.css';
import type {
  DateFieldMapping,
  DateFieldProps,
  DateFieldRenderProps,
} from './types';

const defaultMapping: DateFieldMapping = {
  description: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  error: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  icon: {
    sm: { size: 'xs' },
    lg: { size: 'md' },
  },
};

const defaultSize = 'lg';

export const DateFieldContext =
  createContext<ContextValue<DateFieldProps<DateValue>, HTMLDivElement>>(null);

export const DateField = forwardRef(function DateField<T extends DateValue>(
  props: DateFieldProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DateFieldContext);

  props = useDefaultProps(
    props as DateFieldProps<DateValue>,
    'DateField',
  ) as DateFieldProps<T>;

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = defaultSize,
    value,
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
      mergeClassNames(dateFieldClassNames, theme.DateField, classNamesProp, {
        description: mapping.description[size],
        error: mapping.error[size],
      }),
    [theme.DateField, classNamesProp, mapping, size],
  );

  const style = useCallback(
    (renderProps: DateFieldRenderProps) =>
      inlineVars(dateFieldStateVars, {
        ...renderProps,
        size,
      }),
    [size],
  );

  const values = useMemo<
    [
      [typeof DateInputContext, ContextValue<DateInputProps, HTMLDivElement>],
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [
        typeof AriaFieldErrorContext,
        ContextValue<FieldErrorProps, HTMLElement>,
      ],
      [typeof IconContext, ContextValue<IconProps, HTMLDivElement>],
    ]
  >(
    () => [
      [DateInputContext, { classNames: classNames?.input, size }],
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
      [IconContext, { ...mapping.icon[size], classNames: classNames?.icon }],
    ],
    [classNames, mapping, size],
  );

  const children = useCallback(
    (renderProps: DateFieldRenderProps) => {
      return (
        <Provider values={values}>
          <div className={classNames?.dateField}>
            {callRenderProps(childrenProp, {
              ...renderProps,
              defaultChildren: null,
            })}
          </div>
        </Provider>
      );
    },
    [childrenProp, values, classNames?.dateField],
  );

  return (
    <RACDateField
      {...rest}
      ref={ref}
      className={classNames?.container}
      style={style}
      value={value}
    >
      {children}
    </RACDateField>
  );
});
