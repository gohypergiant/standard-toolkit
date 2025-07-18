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
  TimeField as RACTimeField,
  type TextProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  AriaFieldErrorContext,
  type AriaLabelContext,
  AriaTextContext,
} from '../aria';
import { DateInputContext } from '../date-input';
import { IconContext } from '../icon';
import { timeFieldClassNames, timeFieldStateVars } from './time-field.css';
import type { TimeValue } from '@react-aria/datepicker';
import type { DateFieldRenderProps } from '../date-field/types';
import type { DateInputProps } from '../date-input/types';
import type { IconProps } from '../icon/types';
import type {
  TimeFieldMapping,
  TimeFieldProps,
  TimeFieldRenderProps,
} from './types';

const defaultMapping: TimeFieldMapping = {
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

export const TimeFieldContext =
  createContext<ContextValue<TimeFieldProps<TimeValue>, HTMLDivElement>>(null);

export const TimeField = forwardRef(function TimeField<T extends TimeValue>(
  props: TimeFieldProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TimeFieldContext);
  props = useDefaultProps(
    props as TimeFieldProps<TimeValue>,
    'TimeField',
  ) as TimeFieldProps<T>;

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
      mergeClassNames(timeFieldClassNames, theme.TimeField, classNamesProp, {
        description: mapping.description[size],
        error: mapping.error[size],
      }),
    [theme.TimeField, classNamesProp, mapping, size],
  );

  const style = useCallback(
    (renderProps: DateFieldRenderProps) =>
      inlineVars(timeFieldStateVars, {
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
    [classNames, size, mapping],
  );

  const children = useCallback(
    (renderProps: TimeFieldRenderProps) => {
      return (
        <Provider values={values}>
          <div className={classNames?.timeField}>
            {callRenderProps(childrenProp, {
              ...renderProps,
              defaultChildren: null,
            })}
          </div>
        </Provider>
      );
    },
    [childrenProp, values, classNames],
  );

  return (
    <RACTimeField
      {...rest}
      ref={ref}
      className={classNames?.container}
      style={style}
      value={value}
    >
      {children}
    </RACTimeField>
  );
});
