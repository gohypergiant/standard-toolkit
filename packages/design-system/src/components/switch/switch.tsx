import {
  type ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { type ContextValue, Switch as RACSwitch } from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { switchClassNames, switchStateVars } from './switch.css';
import type { SwitchProps, SwitchRenderProps } from './types';

export const SwitchContext =
  createContext<ContextValue<SwitchProps, HTMLLabelElement>>(null);

export const Switch = forwardRef(function Switch(
  props: SwitchProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  [props, ref] = useContextProps(props, ref, SwitchContext);

  props = useDefaultProps(props, 'Switch');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    alignInput,
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(switchClassNames, theme.Switch, classNamesProp),
    [theme.Switch, classNamesProp],
  );

  const style = useCallback(
    ({ state, ...renderProps }: SwitchRenderProps) =>
      inlineVars(switchStateVars, {
        ...renderProps,
        alignInput,
      }),
    [alignInput],
  );

  const children = useCallback(
    (renderProps: SwitchRenderProps) => {
      const child = callRenderProps(childrenProp, renderProps);

      return (
        <span className={classNames?.switch}>
          {child && <span className={classNames?.label}>{child}</span>}
          <span className={classNames?.indicator} />
        </span>
      );
    },
    [
      childrenProp,
      classNames?.switch,
      classNames?.label,
      classNames?.indicator,
    ],
  );

  return (
    <RACSwitch
      {...rest}
      ref={ref}
      className={classNames?.container}
      style={style}
    >
      {children}
    </RACSwitch>
  );
});
