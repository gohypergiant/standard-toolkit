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
  genericColorVars,
  type InputState,
  inputColorVars,
  inputSpaceVars,
  inputStateVars,
  type NumberFieldState,
  numberFieldColorVars,
  numberFieldSpaceVars,
  numberFieldStateVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '../../src';

export const NumberField: ThemeContext['NumberField'] = {
  description: style(
    applyThemeVars<NumberFieldState>(numberFieldStateVars, [
      {
        vars: assignPartialVars(numberFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(numberFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<NumberFieldState>(numberFieldStateVars, [
      {
        vars: assignPartialVars(numberFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
  group: style(
    applyThemeVars<NumberFieldState>(numberFieldStateVars, [
      {
        vars: assignPartialVars(numberFieldSpaceVars, {
          group: {
            gap: sizeVars.v03,
          },
        }),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(numberFieldSpaceVars, {
          group: {
            x: sizeVars.v03,
            y: sizeVars.v02,
          },
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(numberFieldSpaceVars, {
          group: {
            x: sizeVars.v04,
            y: sizeVars.v03,
          },
        }),
      },
    ]),
  ),
  input: {
    sizer: style(
      applyThemeVars<InputState>(inputStateVars, [
        {
          vars: assignPartialVars(inputSpaceVars, {
            minWidth: '50px',
          }),
        },
      ]),
    ),
  },
  label: style(
    applyThemeVars<{ numberField: NumberFieldState; input: InputState }>(
      { numberField: numberFieldStateVars, input: inputStateVars },
      [
        {
          query: { numberField: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
};
