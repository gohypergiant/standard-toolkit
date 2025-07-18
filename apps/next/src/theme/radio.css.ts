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
  type RadioGroupState,
  type RadioState,
  radioColorVars,
  radioGroupStateVars,
  radioSpaceVars,
  radioStateVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Radio: ThemeContext['Radio'] = {
  group: {
    group: style(
      applyThemeVars<RadioGroupState>(radioGroupStateVars, [
        {
          vars: assignPartialVars(radioSpaceVars, {
            elementGap: sizeVars.v04,
          }),
        },
      ]),
    ),
  },
  radio: {
    radio: style(
      applyThemeVars<RadioState>(radioStateVars, [
        {
          vars: assignPartialVars(
            { color: radioColorVars, space: radioSpaceVars },
            {
              color: {
                border: genericColorVars.neutral.v05,
              },
              space: {
                diameter: '16px',
                gap: sizeVars.v04,
              },
            },
          ),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(radioColorVars, {
            border: genericColorVars.neutral.v01,
          }),
        },
        {
          query: { isSelected: true },
          vars: assignPartialVars(radioColorVars, {
            border: semanticColorVars.background.highlight.bold,
            background: semanticColorVars.background.highlight.bold,
          }),
        },
        {
          query: {
            isInvalid: true,
          },
          vars: assignPartialVars(radioColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
        {
          query: { isDisabled: true },
          vars: assignPartialVars(radioColorVars, {
            border: genericColorVars.neutral.v06,
            color: genericColorVars.neutral.v06,
          }),
        },
        {
          query: { isDisabled: true, isSelected: true },
          vars: assignPartialVars(radioColorVars, {
            border: genericColorVars.neutral.v06,
            color: genericColorVars.neutral.v06,
            background: genericColorVars.neutral.v06,
          }),
        },
      ]),
    ),
  },
};
