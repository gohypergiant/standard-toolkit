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
  applyThemeVars,
  assignPartialVars,
  type ComboBoxState,
  comboBoxColorVars,
  comboBoxSpaceVars,
  comboBoxStateVars,
  genericColorVars,
  type InputState,
  inputColorVars,
  inputStateVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '../../src';

export const ComboBox: ThemeContext['ComboBox'] = {
  group: style(
    applyThemeVars<ComboBoxState>(comboBoxStateVars, [
      {
        query: { size: 'sm' },
        vars: assignPartialVars(comboBoxSpaceVars, {
          x: sizeVars.v03,
          y: sizeVars.v02,
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(comboBoxSpaceVars, {
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
    ]),
  ),
  label: style(
    applyThemeVars<{ comboBox: ComboBoxState; input: InputState }>(
      { comboBox: comboBoxStateVars, input: inputStateVars },
      [
        {
          query: { comboBox: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
  description: style(
    applyThemeVars<ComboBoxState>(comboBoxStateVars, [
      {
        vars: assignPartialVars(comboBoxColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(comboBoxColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<ComboBoxState>(comboBoxStateVars, [
      {
        vars: assignPartialVars(comboBoxColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
