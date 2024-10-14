import type { GlobalProvider } from '@ladle/react';
import { clsx } from 'clsx';
import { type PropsWithChildren, useMemo } from 'react';
import {
  type DefaultsContext,
  DefaultsProvider,
  ThemeProvider,
  bodies,
  families,
  pixelValueAsNumberValidator,
  sizeVars,
  surfaces,
  useTheme,
} from '../src';
import { theme as themeConfig, vars } from './components.css';

function Defaults({ children }: PropsWithChildren) {
  const theme = useTheme({ size: sizeVars });

  const defaults = useMemo<DefaultsContext>(
    () => ({
      // biome-ignore lint/style/useNamingConvention: intentional
      Tooltip: {
        containerPadding: pixelValueAsNumberValidator
          .catch(0)
          .parse(theme.contract?.size.v04),
      },
    }),
    [theme.contract?.size.v04],
  );

  return <DefaultsProvider defaults={defaults}>{children}</DefaultsProvider>;
}

const style = {
  height: '100%',
  display: 'block',
  padding: sizeVars.v08,
};

export const Provider: GlobalProvider = ({ children }) => (
  <ThemeProvider
    className={clsx(families.sans, bodies.md)}
    theme={themeConfig}
    vars={vars}
  >
    <Defaults>
      <div className={surfaces.default.flush} style={style}>
        {children}
      </div>
    </Defaults>
  </ThemeProvider>
);
