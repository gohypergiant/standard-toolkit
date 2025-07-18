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

import {
  applyThemeVars,
  assignPartialVars,
  type IconState,
  iconColorVars,
  iconSpaceVars,
  iconStateVars,
  type ThemeContext,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Icon: ThemeContext['Icon'] = {
  icon: style(
    applyThemeVars<IconState>(iconStateVars, [
      {
        vars: assignPartialVars(iconColorVars, {
          fill: 'currentcolor',
        }),
      },
      {
        query: {
          size: ['xs', 'sm'],
        },
        vars: assignPartialVars(iconSpaceVars, {
          width: '16px',
        }),
      },
      {
        query: {
          size: 'md',
        },
        vars: assignPartialVars(iconSpaceVars, {
          width: '20px',
        }),
      },
      {
        query: {
          size: ['lg', 'xl'],
        },
        vars: assignPartialVars(iconSpaceVars, {
          width: '24px',
        }),
      },
      {
        query: { size: 'relative' },
        vars: assignPartialVars(iconSpaceVars, {
          width: '1.25em',
        }),
      },
    ]),
  ),
};
