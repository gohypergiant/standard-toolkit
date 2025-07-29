/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

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
