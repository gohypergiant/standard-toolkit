import { style } from '@vanilla-extract/css';
import { layers } from './layers.css';
import { elevationVars } from './theme.css';

type ElevationVarKeys = keyof typeof elevationVars;

export const surfaces = Object.entries(elevationVars).reduce(
  (acc, [key, contract]) => {
    const flush = style({
      '@layer': {
        [layers.styles]: {
          background: contract.surface,
          color: contract.color,
        },
      },
    });

    const proud = style([
      flush,
      {
        '@layer': {
          [layers.styles]: {
            boxShadow:
              key === 'default' ? elevationVars.raised.shadow : contract.shadow,
          },
        },
      },
    ]);

    acc[key as ElevationVarKeys] = { flush, proud };

    return acc;
  },
  {} as Record<ElevationVarKeys, { flush: string; proud: string }>,
);
