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
  genericColorVars,
  type PopoverState,
  popoverColorVars,
  popoverSpaceVars,
  popoverStateVars,
  sizeVars,
  type ThemeContext,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Popover: ThemeContext['Popover'] = {
  popover: {
    popover: style(
      applyThemeVars<PopoverState>(popoverStateVars, [
        {
          vars: assignPartialVars(popoverSpaceVars, {
            width: '280px',
            x: sizeVars.v06,
            y: sizeVars.v06,
            gap: {
              default: sizeVars.v03,
              header: {
                after: sizeVars.v03,
              },
              footer: {
                before: sizeVars.v06,
              },
            },
          }),
        },
      ]),
    ),
  },
  content: style(
    applyThemeVars<PopoverState>(popoverStateVars, [
      {
        query: { hasHeader: true },
        vars: assignPartialVars(popoverColorVars, {
          content: { color: genericColorVars.neutral.v03 },
        }),
      },
    ]),
  ),
};
