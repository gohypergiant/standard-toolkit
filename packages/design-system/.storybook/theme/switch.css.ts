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
import {
  type SwitchState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  sizeVars,
  switchColorVars,
  switchSpaceVars,
  switchStateVars,
} from '../../src';

export const Switch: ThemeContext['Switch'] = {
  switch: style(
    applyThemeVars<SwitchState>(switchStateVars, [
      {
        vars: assignPartialVars(
          { color: switchColorVars, space: switchSpaceVars },
          {
            color: {
              border: genericColorVars.neutral.v05,
              background: genericColorVars.neutral.v10,
              indicator: genericColorVars.neutral.v03,
            },
            space: {
              diameter: '12px',
              gutter: sizeVars.v02,
              gap: sizeVars.v04,
              travel: sizeVars.v04,
            },
          },
        ),
      },
      {
        query: { isHovered: true },
        vars: assignPartialVars(switchColorVars, {
          background: genericColorVars.neutral.v07,
          border: genericColorVars.neutral.v01,
          indicator: genericColorVars.neutral.v01,
        }),
      },
      {
        query: { isSelected: true },
        vars: assignPartialVars(switchColorVars, {
          border: genericColorVars.highlight.primary.v3,
          indicator: genericColorVars.highlight.primary.v3,
        }),
      },
      {
        query: { isSelected: true, isHovered: true },
        vars: assignPartialVars(switchColorVars, {
          background: genericColorVars.highlight.primary.v5,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(switchColorVars, {
          background: genericColorVars.neutral.v07,
          border: 'transparent',
          color: genericColorVars.neutral.v05,
          indicator: genericColorVars.neutral.v05,
        }),
      },
    ]),
  ),
};
