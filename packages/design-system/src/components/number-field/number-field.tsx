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
import {
  AriaFieldErrorContext,
  AriaGroupContext,
  type AriaLabelContext,
  AriaTextContext,
  ButtonContext,
  type ButtonProps,
  InputContext,
  type InputProps,
} from '../../components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
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
          {callRenderProps(childrenProp, renderProps)}
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
