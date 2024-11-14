'use client';

import '@accelint/design-system/styles';
import type { PropsWithChildren } from 'react';
import { clsx } from 'clsx';
import { ThemeProvider, bodies, families } from '@accelint/design-system';
import { Defaults } from './defaults';
import { theme, vars } from './theme.css';

export function Theme({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      className={clsx(families.sans, bodies.md)}
      theme={theme}
      vars={vars}
    >
      <Defaults>{children}</Defaults>
    </ThemeProvider>
  );
}
