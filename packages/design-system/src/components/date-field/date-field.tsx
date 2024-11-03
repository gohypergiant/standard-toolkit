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
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  AriaFieldErrorContext,
  type AriaLabelContext,
  AriaTextContext,
} from '../aria';
import { DateInputContext } from '../date-input/date-input';
import type { DateInputProps } from '../date-input/types';
import { dateFieldClassNames, dateFieldStateVars } from './date-field.css';
import type { DateFieldProps, DateFieldRenderProps } from './types';

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

export const DateFieldContext =
  createContext<ContextValue<DateFieldProps<DateValue>, HTMLDivElement>>(null);

export const DateField = forwardRef(function DateField<T extends DateValue>(
  props: DateFieldProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, DateFieldContext);
  props = useDefaultProps(props, 'DateField'); // TODO

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
