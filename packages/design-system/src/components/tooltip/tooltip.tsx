import {
  type ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { useFocusable } from '@react-aria/focus';
import {
  type ContextValue,
  Tooltip as RACTooltip,
  type TooltipRenderProps,
  useContextProps,
} from 'react-aria-components';
import { useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  tooltipClassNames,
  tooltipStateVars,
  tooltipTargetStateVars,
} from './tooltip.css';
import type { TooltipMapping, TooltipProps, TooltipTargetProps } from './types';

const defaultMapping: TooltipMapping = {
  font: bodies.xs,
};

export const TooltipContext =
  createContext<ContextValue<TooltipProps, HTMLDivElement>>(null);

export const Tooltip = forwardRef(function Tooltip(
  props: TooltipProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TooltipContext);

  props = useDefaultProps(props, 'Tooltip');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    containerPadding,
    crossOffset,
    mapping: mappingProp,
    offset,
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
      mergeClassNames(tooltipClassNames, theme.Tooltip, classNamesProp, {
        tooltip: {
          container: theme.className,
          tooltip: mapping.font,
        },
      }),
    [theme.Tooltip, classNamesProp, theme.className, mapping],
  );

  const style = useCallback(
    ({ state, ...renderProps }: TooltipRenderProps) => ({
      ...theme.style,
      ...inlineVars(tooltipStateVars, {
        containerPadding,
        crossOffset,
        offset,
        ...renderProps,
        isOpen: state.isOpen,
      }),
    }),
    [theme.style, containerPadding, crossOffset, offset],
  );

  const children = useCallback(
    (renderProps: TooltipRenderProps) => (
      <div className={classNames?.tooltip?.tooltip}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          isOpen: renderProps.state.isOpen,
        })}
      </div>
    ),
    [classNames?.tooltip?.tooltip, childrenProp],
  );

  return (
    <RACTooltip
      {...rest}
      ref={ref}
      className={classNames?.tooltip?.container}
      style={style}
    >
      {children}
    </RACTooltip>
  );
});

export const TooltipTargetContext =
  createContext<ContextValue<TooltipTargetProps, HTMLDivElement>>(null);

/**
 * This target component is only needed if attempting to add a Tooltip
 * to a non-focusable element/component
 */
export const TooltipTarget = forwardRef(function TooltipTarget(
  props: TooltipTargetProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TooltipTargetContext);

  props = useDefaultProps(props, 'TooltipTarget');

  const {
    children,
    classNames: classNamesProp,
    focusable = true,
    relative = 'self',
  } = props;

  const { focusableProps } = useFocusable({}, ref);
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(tooltipClassNames, theme.Tooltip, classNamesProp),
    [theme.Tooltip, classNamesProp],
  );

  const style = useMemo(
    () =>
      inlineVars(tooltipTargetStateVars, {
        focusable,
        relative,
      }),
    [focusable, relative],
  );

  return (
    <div className={classNames?.target?.container} style={style}>
      <div
        {...focusableProps}
        ref={ref}
        className={classNames?.target?.target}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={focusable ? 0 : undefined}
      >
        {children}
      </div>
    </div>
  );
});
