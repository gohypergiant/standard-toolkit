'use client';

import {
  type DefaultsContext,
  DefaultsProvider,
  pixelValueAsNumberValidator,
  sizeVars,
  useTheme,
} from '@accelint/design-system';
import { type PropsWithChildren, useMemo } from 'react';

export function Defaults({ children }: PropsWithChildren) {
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
