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
  dateFieldColorVars,
  dateFieldSpaceVars,
  dateFieldStateVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '../../src';
import type { DateFieldState } from '../../src/components/date-field/types';

export const DateField: ThemeContext['DateField'] = {
  input: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldSpaceVars, {
          gap: sizeVars.v03,
        }),
      },
    ]),
  ),
  group: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldColorVars, {
          border: semanticColorVars.border.interactive.default,
        }),
      },
    ]),
  ),
  label: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        query: { isDisabled: true },
        vars: assignPartialVars(dateFieldColorVars, {
          label: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  description: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldColorVars, {
          description: {
            color: genericColorVars.neutral.v03,
          },
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(dateFieldColorVars, {
          description: {
            color: semanticColorVars.foreground.interactive.disabled,
          },
        }),
      },
    ]),
  ),
  error: style(
    applyThemeVars<DateFieldState>(dateFieldStateVars, [
      {
        vars: assignPartialVars(dateFieldColorVars, {
          error: {
            color: semanticColorVars.border.serious,
          },
        }),
      },
    ]),
  ),
};
