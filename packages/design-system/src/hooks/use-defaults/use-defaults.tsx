import { createContext, useContext, useMemo } from 'react';
import { mergeProps } from '../../utils';
import type { DefaultsContext, DefaultsProviderProps } from './types';

const defaultsContext = createContext<DefaultsContext>({});

/**
 * Access globally established component prop defaults
 */
export function useDefaults() {
  return useContext(defaultsContext);
}

/**
 * Select default props from context and merge with provided props
 * with provided props taking precedence
 */
export function useDefaultProps<
  K extends keyof DefaultsContext,
  P extends DefaultsContext[K],
>(props: P, key: K): P {
  const defaults = useDefaults();

  const defaultProps = useMemo(
    () => (defaults[key] ?? {}) as Partial<P>,
    [defaults, key],
  );

  return useMemo(
    () => mergeProps(defaultProps, props) as P,
    [defaultProps, props],
  );
}

/**
 * Set default props for any component, to be merged in with props at point
 * of implementation. Global defaults take lower priority than props from
 * composition context or props attached to instance
 *
 * Nested instances of this provider will shallow merge defaults from parent
 * context, with the defaults prop taking precedence
 */
export function DefaultsProvider({
  children,
  defaults: defaultsProp,
}: DefaultsProviderProps) {
  const defaults = useDefaults();

  const context = useMemo(
    () => ({ ...defaults, ...defaultsProp }),
    [defaults, defaultsProp],
  );

  const { Provider } = defaultsContext;

  return <Provider value={context}>{children}</Provider>;
}
