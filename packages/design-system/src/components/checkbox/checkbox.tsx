import {
  type ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  type ContextValue,
  type LabelProps,
  Provider,
  Checkbox as RACCheckbox,
  CheckboxGroup as RACCheckboxGroup,
  TextContext,
  type TextProps,
} from 'react-aria-components';
import {
  useContextProps,
  useDefaultProps,
  useSlot,
  useTheme,
} from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaLabelContext, AriaTextContext } from '../aria';
import { IconContext, type IconProps } from '../icon';
import {
  checkboxClassNames,
  checkboxGroupStateVars,
  checkboxStateVars,
} from './checkbox.css';
import type {
  CheckboxGroupProps,
  CheckboxGroupRenderProps,
  CheckboxProps,
  CheckboxRenderProps,
} from './types';

export const CheckboxContext =
  createContext<ContextValue<CheckboxProps, HTMLLabelElement>>(null);

export const Checkbox = forwardRef(function Checkbox(
  props: CheckboxProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  [props, ref] = useContextProps(props, ref, CheckboxContext);

  props = useDefaultProps(props, 'Checkbox');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput = 'end',
    ...rest
  } = props;

  const [iconRef, hasIcon] = useSlot();
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(checkboxClassNames, theme.Checkbox, classNamesProp),
    [theme.Checkbox, classNamesProp],
  );

  const style = useCallback(
    (renderProps: CheckboxRenderProps) =>
      inlineVars(checkboxStateVars, {
        ...renderProps,
        alignInput,
      }),
    [alignInput],
  );

  const values = useMemo<
    [
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [typeof IconContext, ContextValue<IconProps, HTMLDivElement>],
      [typeof TextContext, ContextValue<TextProps, HTMLElement>],
    ]
  >(
    () => [
      [AriaTextContext, { className: classNames?.checkbox?.label }],
      [
        IconContext,
        {
          ref: iconRef,
          classNames: classNames?.checkbox?.icon,
        },
      ],
      [TextContext, null],
    ],
    [classNames?.checkbox?.label, classNames?.checkbox?.icon, iconRef],
  );

  const children = useCallback(
    (renderProps: CheckboxRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.checkbox?.checkbox}>
          {!hasIcon && (
            <span className={classNames?.checkbox?.icon?.container} />
          )}
          {callRenderProps(childrenProp, renderProps)}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.checkbox, hasIcon, values],
  );

  return (
    <RACCheckbox
      {...rest}
      ref={ref}
      className={classNames?.checkbox?.container}
      style={style}
    >
      {children}
    </RACCheckbox>
  );
});

export const CheckboxGroupContext =
  createContext<ContextValue<CheckboxGroupProps, HTMLDivElement>>(null);

export const CheckboxGroup = forwardRef(function CheckboxGroup(
  props: CheckboxGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, CheckboxGroupContext);

  props = useDefaultProps(props, 'CheckboxGroup');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput = 'end',
    orientation = 'vertical',
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(checkboxClassNames, theme.Checkbox, classNamesProp),
    [classNamesProp, theme.Checkbox],
  );

  const style = useCallback(
    (renderProps: CheckboxGroupRenderProps) =>
      inlineVars(checkboxGroupStateVars, {
        ...renderProps,
        orientation,
      }),
    [orientation],
  );

  const values = useMemo<
    [
      [typeof AriaLabelContext, ContextValue<LabelProps, HTMLLabelElement>],
      [typeof CheckboxContext, ContextValue<CheckboxProps, HTMLLabelElement>],
    ]
  >(
    () => [
      [AriaLabelContext, { className: classNames?.group?.label }],
      [
        CheckboxContext,
        {
          classNames,
          alignInput,
        },
      ],
    ],
    [alignInput, classNames],
  );

  const children = useCallback(
    (renderProps: CheckboxGroupRenderProps) => (
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
    <RACCheckboxGroup
      {...rest}
      ref={ref}
      className={classNames?.group?.container}
      style={style}
    >
      {children}
    </RACCheckboxGroup>
  );
});
