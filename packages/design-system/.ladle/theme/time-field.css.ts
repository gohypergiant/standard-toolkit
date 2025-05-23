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
  type DateFieldState,
  type ThemeContext,
  type TimeFieldState,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
  timeFieldColorVars,
  timeFieldSpaceVars,
  timeFieldStateVars,
} from '../../src';

export const TimeField: ThemeContext['TimeField'] = {
  input: style(
    applyThemeVars<TimeFieldState>(timeFieldStateVars, [
      {
        vars: assignPartialVars(timeFieldSpaceVars, {
          gap: sizeVars.v03,
        }),
      },
    ]),
  ),
  group: style(
    applyThemeVars<DateFieldState>(timeFieldStateVars, [
      {
        vars: assignPartialVars(timeFieldColorVars, {
          border: semanticColorVars.border.interactive.default,
        }),
      },
    ]),
  ),
  label: style(
    applyThemeVars<DateFieldState>(timeFieldStateVars, [
      {
        query: { isDisabled: true },
        vars: assignPartialVars(timeFieldColorVars, {
          label: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  description: style(
    applyThemeVars<DateFieldState>(timeFieldStateVars, [
      {
        vars: assignPartialVars(timeFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(timeFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<DateFieldState>(timeFieldStateVars, [
      {
        vars: assignPartialVars(timeFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
