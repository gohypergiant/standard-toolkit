import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type ForwardedRef,
} from 'react';
import {
  Select as AriaSelect,
  Provider,
  type ContextValue,
  type FieldErrorProps,
  type LabelProps,
  type SelectRenderProps as RACSelectRenderProps,
  type SelectValueProps,
  type TextProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  AriaFieldErrorContext,
  AriaLabelContext,
  AriaSelectValueContext,
  AriaTextContext,
} from '../aria';
import { ButtonContext, type ButtonProps } from '../button';
import { OptionsContext, type OptionsProps } from '../options';
import { selectClassNames, selectStateVars } from './select.css';
import { type SelectMapping, type SelectProps } from './types';

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
