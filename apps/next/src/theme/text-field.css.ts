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
  type InputState,
  type TextFieldState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  inputColorVars,
  inputStateVars,
  semanticColorVars,
  textFieldColorVars,
  textFieldStateVars,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const TextField: ThemeContext['TextField'] = {
  label: style(
    applyThemeVars<{ textField: TextFieldState; input: InputState }>(
      { textField: textFieldStateVars, input: inputStateVars },
      [
        {
          query: { textField: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
  description: style(
    applyThemeVars<TextFieldState>(textFieldStateVars, [
      {
        vars: assignPartialVars(textFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(textFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<TextFieldState>(textFieldStateVars, [
      {
        vars: assignPartialVars(textFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
