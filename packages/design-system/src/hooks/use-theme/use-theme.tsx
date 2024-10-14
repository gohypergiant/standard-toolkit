import { useLayoutEffect } from '@react-aria/utils';
import { clsx } from 'clsx';
import { createContext, useContext, useMemo, useRef, useState } from 'react';
import {
  defaultGenericColors,
  defaultElevations,
  defaultFocus,
  defaultRadius,
  defaultSemanticColors,
  defaultSizes,
  defaultSpace,
  defaultTypography,
  defaultZIndex,
} from '../../styles';
import type { Contract } from '../../types';
import { computeContract } from '../../utils';
import type { ThemeContext, ThemeProviderProps } from './types';
import { root } from './use-theme.css';

const defaultTheme: ThemeContext = {};
const themeContext = createContext<ThemeContext>(defaultTheme);
const themeCssContext = createContext<CSSStyleDeclaration | null>(null);

/**
 * Computes CSS values into DeckGL compatible formats using the optionally provided contract
 *
 * This function allows for the reuse of CSS contract tokens within React context for non-CSS
 * use cases. This ensures synchronized theming across the entire rendering stack
 */
export function useTheme<T extends Contract>(
  contract?: T,
): ThemeContext & {
  contract?: ReturnType<typeof computeContract<T>>;
} {
  const theme = useContext(themeContext);
  const css = useContext(themeCssContext);

  return useMemo(
    () => ({
      ...theme,
      ...(!!contract && !!css
        ? {
            contract: computeContract(contract, css),
          }
        : {}),
    }),
    [theme, contract, css],
  );
}

function localInheritOrDefault(
  localClass?: string,
  inherit?: boolean,
  defaultClass?: string,
) {
  return localClass ?? (!inherit && defaultClass);
}

export function ThemeProvider({
  children,
  className: classNameProp,
  inherit,
  style: styleProp,
  theme: themeProp = defaultTheme,
  vars,
}: ThemeProviderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [css, setCss] = useState<CSSStyleDeclaration | null>(null);
  const parent = useTheme();

  const className = useMemo(
    () =>
      clsx(
        root,
        classNameProp,
        inherit && parent.className,
        themeProp.className,
        localInheritOrDefault(
          vars?.colors?.generic,
          inherit,
          defaultGenericColors,
        ),
        localInheritOrDefault(
          vars?.colors?.semantic,
          inherit,
          defaultSemanticColors,
        ),
        localInheritOrDefault(vars?.elevation, inherit, defaultElevations),
        localInheritOrDefault(vars?.focus, inherit, defaultFocus),
        localInheritOrDefault(vars?.radius, inherit, defaultRadius),
        localInheritOrDefault(vars?.sizes, inherit, defaultSizes),
        localInheritOrDefault(vars?.space, inherit, defaultSpace),
        localInheritOrDefault(vars?.typography, inherit, defaultTypography),
        localInheritOrDefault(vars?.zIndex, inherit, defaultZIndex),
      ),
    [
      classNameProp,
      inherit,
      parent.className,
      themeProp.className,
      vars?.colors?.generic,
      vars?.colors?.semantic,
      vars?.elevation,
      vars?.focus,
      vars?.radius,
      vars?.sizes,
      vars?.space,
      vars?.typography,
      vars?.zIndex,
    ],
  );

  const style = useMemo(
    () => ({
      ...(inherit ? parent.style : {}),
      ...themeProp.style,
      ...styleProp,
    }),
    [inherit, parent.style, themeProp.style, styleProp],
  );

  const theme = useMemo(
    () => ({
      ...(inherit ? parent : themeProp),
      className,
      style,
    }),
    [inherit, parent, themeProp, className, style],
  );

  useLayoutEffect(() => {
    if (ref.current) {
      setCss(window.getComputedStyle(ref.current));
    }
  }, [className, style]);

  const { Provider: ClassesProvider } = themeContext;
  const { Provider: CssProvider } = themeCssContext;

  return (
    <div ref={ref} className={className} style={style}>
      <ClassesProvider value={theme}>
        <CssProvider value={css}>{children}</CssProvider>
      </ClassesProvider>
    </div>
  );
}
