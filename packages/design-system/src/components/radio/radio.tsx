import {
  createContext,
  type ForwardedRef,
  forwardRef,
  useMemo,
  useCallback,
} from 'react';
import {
  RadioGroup as RACRadioGroup,
  Radio as RACRadio,
  type ContextValue,
  Provider,
  type LabelProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaLabelContext } from '../aria';
import {
  radioClassNames,
  radioGroupStateVars,
  radioStateVars,
} from './radio.css';
import type {
  RadioGroupRenderProps,
  RadioGroupProps,
  RadioProps,
  RadioRenderProps,
  RadioContextProps,
} from './types';

export const RadioContext =
  createContext<ContextValue<RadioContextProps, HTMLLabelElement>>(null);

export const Radio = forwardRef(function Radio(
  props: RadioProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  [props, ref] = useContextProps(props, ref, RadioContext);
  props = useDefaultProps(props, 'Radio');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput = 'end',
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(radioClassNames, theme.Radio, classNamesProp),
    [classNamesProp, theme.Radio],
  );

  const style = useCallback(
    (renderProps: RadioRenderProps) =>
      inlineVars(radioStateVars, {
        ...renderProps,
        alignInput,
      }),
    [alignInput],
  );

  const children = useCallback(
    (renderProps: RadioRenderProps) => (
      <span className={classNames?.radio?.radio}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </span>
    ),
    [childrenProp, classNames?.radio],
  );

  return (
    <RACRadio
      {...rest}
      ref={ref}
      style={style}
      className={classNames?.radio?.container}
    >
      {children}
    </RACRadio>
  );
});

export const RadioGroupContext =
  createContext<ContextValue<RadioGroupProps, HTMLDivElement>>(null);

export const RadioGroup = forwardRef(function RadioGroup(
  props: RadioGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, RadioGroupContext);

  props = useDefaultProps(props, 'RadioGroup');

  const theme = useTheme();

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput = 'end',
    orientation = 'vertical',
    ...rest
  } = props;

  const classNames = useMemo(
    () => mergeClassNames(radioClassNames, theme.Radio, classNamesProp),
    [classNamesProp, theme.Radio],
  );

  const style = useCallback(
    (renderProps: RadioGroupRenderProps) =>
      inlineVars(radioGroupStateVars, {
        ...renderProps,
        alignInput,
        orientation,
      }),
    [alignInput, orientation],
  );

  const values = useMemo<
    [
      [typeof RadioContext, ContextValue<RadioContextProps, HTMLLabelElement>],
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
    ]
  >(
    () => [
      [
        RadioContext,
        {
          classNames,
          alignInput,
        },
      ],
      [
        AriaLabelContext,
        {
          className: classNames?.label,
        },
      ],
    ],
    [alignInput, classNames],
  );

  const children = useCallback(
    (renderProps: RadioGroupRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.group?.group}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.group, values],
  );

  return (
    <RACRadioGroup
      {...rest}
      ref={ref}
      className={classNames?.group?.container}
      style={style}
      orientation={orientation}
    >
      {children}
    </RACRadioGroup>
  );
});
