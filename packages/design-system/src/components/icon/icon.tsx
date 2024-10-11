import { type ForwardedRef, createContext, forwardRef, useMemo } from 'react';
import type { ContextValue } from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { inlineVars, mergeClassNames } from '../../utils';
import { iconClassNames, iconStateVars } from './icon.css';
import type { IconProps } from './types';

export const IconContext =
  createContext<ContextValue<IconProps, HTMLDivElement>>(null);

export const Icon = forwardRef(function Icon(
  props: IconProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, IconContext);

  props = useDefaultProps(props, 'Icon');

  const {
    children,
    classNames: classNamesProp,
    color,
    fill,
    size = 'relative',
    stroke,
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(iconClassNames, theme.Icon, classNamesProp),
    [theme.Icon, classNamesProp],
  );

  const style = useMemo(
    () =>
      inlineVars(iconStateVars, {
        color,
        fill,
        size,
        stroke,
      }),
    [color, fill, size, stroke],
  );

  return (
    <div ref={ref} className={classNames?.container} style={style}>
      <div className={classNames?.icon}>{children}</div>
    </div>
  );
});
