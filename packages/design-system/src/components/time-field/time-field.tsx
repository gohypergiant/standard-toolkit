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
  Provider,
  TimeField as RACTimeField,
  type TextProps,
} from 'react-aria-components';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  AriaFieldErrorContext,
  type AriaLabelContext,
  AriaTextContext,
} from '../aria';
import type { TimeFieldProps, TimeFieldRenderProps } from './types';

import type { TimeValue } from 'react-aria';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import type { DateFieldRenderProps } from '../date-field';
import { DateInputContext } from '../date-input/date-input';
import type { DateInputProps } from '../date-input/types';
import { timeFieldClassNames, timeFieldStateVars } from './time-field.css';

const defaultMapping = {
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

export const TimeFieldContext =
  createContext<ContextValue<TimeFieldProps<TimeValue>, HTMLDivElement>>(null);

export const TimeField = forwardRef(function TimeField<T extends TimeValue>(
  props: TimeFieldProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TimeFieldContext);
  props = useDefaultProps(props, 'TimeField'); // TODO

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
    ]
  >(
    () => [
      [DateInputContext, { classNames: classNames?.dateInput }],
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
    [classNames],
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
