import { clsx } from 'clsx';
import { noop } from 'lodash';
import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type Context,
  type ForwardedRef,
} from 'react';
import {
  Link,
  Provider,
  Button as RACButton,
  ToggleButton as RACToggleButton,
  type ButtonRenderProps,
  type ContextValue,
  type LinkRenderProps,
  type ToggleButtonRenderProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies, surfaces } from '../../styles';
import type { OmitProtectedProps } from '../../types';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { IconContext, type IconProps } from '../icon';
import { buttonClassNames, buttonStateVars } from './button.css';
import type {
  ButtonMapping,
  ButtonProps,
  ButtonSizes,
  LinkButtonProps,
  ToggleButtonProps,
} from './types';

const noopToggleState = { isSelected: false, setSelected: noop, toggle: noop };
const buttonSizes: ButtonSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const defaultMapping: ButtonMapping = {
  font: bodies,
  icon: buttonSizes.reduce(
    (acc, size) => {
      acc[size] = { size };

      return acc;
    },
    {} as Record<ButtonSizes, OmitProtectedProps<IconProps>>,
  ),
};

function useButton<
  P extends ButtonProps | LinkButtonProps | ToggleButtonProps,
  E extends HTMLElement,
>(
  props: P,
  ref: ForwardedRef<E>,
  context: Context<ContextValue<P, E>>,
  key: 'Button' | 'LinkButton' | 'ToggleButton',
) {
  [props, ref] = useContextProps(props, ref, context);

  props = useDefaultProps(props, key);

  const {
    children: childrenProp,
    classNames: classNamesProp,
    color = 'primary',
    mapping: mappingProp,
    size = 'md',
    variant = 'solid',
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
      mergeClassNames(buttonClassNames, theme.Button, classNamesProp, {
        button: clsx(
          mapping.font[size],
          variant === 'floating' && surfaces.default.proud,
        ),
      }),
    [theme.Button, classNamesProp, mapping.font, size, variant],
  );

  const style = useCallback(
    (
      renderProps:
        | ButtonRenderProps
        | LinkRenderProps
        | ToggleButtonRenderProps,
    ) =>
      inlineVars(buttonStateVars, {
        isCurrent: false,
        isSelected: false,
        ...renderProps,
        color,
        size,
        variant,
      }),
    [color, size, variant],
  );

  const values = useMemo<
    [[typeof IconContext, ContextValue<IconProps, HTMLDivElement>]]
  >(() => [[IconContext, mapping.icon[size]]], [mapping.icon, size]);

  const children = useCallback(
    (
      renderProps:
        | ButtonRenderProps
        | LinkRenderProps
        | ToggleButtonRenderProps,
    ) => (
      <Provider values={values}>
        <span className={classNames?.button}>
          {callRenderProps(childrenProp, {
            state: noopToggleState,
            isCurrent: false,
            isPending: false,
            isSelected: false,
            ...renderProps,
          })}
        </span>
      </Provider>
    ),
    [values, classNames?.button, childrenProp],
  );

  return useMemo(
    () => ({ ...rest, ref, children, className: classNames?.container, style }),
    [rest, ref, children, classNames?.container, style],
  );
}

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLButtonElement>>(null);

export const Button = forwardRef(function Button(
  props: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const buttonProps = useButton(props, ref, ButtonContext, 'Button');

  return <RACButton {...buttonProps} />;
});

export const LinkButtonContext =
  createContext<ContextValue<LinkButtonProps, HTMLAnchorElement>>(null);

export const LinkButton = forwardRef(function LinkButton(
  props: LinkButtonProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  const buttonProps = useButton(props, ref, LinkButtonContext, 'LinkButton');

  return <Link {...buttonProps} />;
});

export const ToggleButtonContext =
  createContext<ContextValue<ToggleButtonProps, HTMLButtonElement>>(null);

export const ToggleButton = forwardRef(function ToggleButton(
  props: ToggleButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const buttonProps = useButton(
    props,
    ref,
    ToggleButtonContext,
    'ToggleButton',
  );

  return <RACToggleButton {...buttonProps} />;
});
