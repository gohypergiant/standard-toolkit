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
  buttonColorVars,
  buttonSpaceVars,
  genericColorVars,
  type InputState,
  inputColorVars,
  inputStateVars,
  type SelectState,
  selectColorVars,
  selectStateVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '../../src';

export const Select: ThemeContext['Select'] = {
  toggle: {
    button: style(
      applyThemeVars<SelectState>(selectStateVars, [
        {
          query: { size: 'sm' },
          vars: assignPartialVars(buttonSpaceVars, {
            x: sizeVars.v03,
            y: sizeVars.v02,
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(buttonSpaceVars, {
            x: sizeVars.v04,
            y: sizeVars.v03,
          }),
        },
        {
          query: { isInvalid: true },
          vars: assignPartialVars(buttonColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
      ]),
    ),
  },
  label: style(
    applyThemeVars<{ select: SelectState; input: InputState }>(
      { select: selectStateVars, input: inputStateVars },
      [
        {
          query: { select: { isDisabled: true } },
          vars: assignPartialVars(inputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ],
    ),
  ),
  description: style(
    applyThemeVars<SelectState>(selectStateVars, [
      {
        vars: assignPartialVars(selectColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(selectColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<SelectState>(selectStateVars, [
      {
        vars: assignPartialVars(selectColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
