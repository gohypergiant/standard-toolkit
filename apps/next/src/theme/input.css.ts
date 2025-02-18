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
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  inputColorVars,
  inputSpaceVars,
  inputStateVars,
  semanticColorVars,
  sizeVars,
  typographyVars,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

/**
 * Variables are applied to sizer, instead of input to that they
 * are available outside of the input, for the sake of usage in
 * the SearchField, where input vars are used in a faux representation
 * of the input
 */
export const Input: ThemeContext['Input'] = {
  sizer: style(
    applyThemeVars<InputState>(inputStateVars, [
      {
        vars: assignPartialVars(inputColorVars, {
          border: semanticColorVars.border.interactive.default,
        }),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(inputSpaceVars, {
          maxWidth: 'min(200px, 100%)',
          x: sizeVars.v03,
          y: sizeVars.v02,
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(inputSpaceVars, {
          maxWidth: 'min(400px, 100%)',
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
      {
        query: { size: 'sm', type: ['number', 'text'] },
        vars: assignPartialVars(inputSpaceVars, {
          minWidth: `calc(2ch + ((${inputStateVars.length} - 1) * ${typographyVars.input.sm.spacing}) + (${sizeVars.v03} * 2) + 2px)`,
          width: `calc((${inputStateVars.length} * 1ch) + ((${inputStateVars.length} - 1) * ${typographyVars.input.sm.spacing}) + (${sizeVars.v03} * 2) + 2px)`,
        }),
      },
      {
        query: { size: 'lg', type: ['number', 'text'] },
        vars: assignPartialVars(inputSpaceVars, {
          minWidth: '160px',
          width: `calc((${inputStateVars.length} * 1ch) + ((${inputStateVars.length} - 1) * ${typographyVars.input.lg.spacing}) + (${sizeVars.v04} * 2) + 2px)`,
        }),
      },
      {
        query: { isPlaceholder: true },
        vars: assignPartialVars(inputColorVars, {
          color: genericColorVars.neutral.v03,
        }),
      },
      {
        query: { isEmpty: false },
        vars: assignPartialVars(inputColorVars, {
          color: semanticColorVars.foreground.interactive.primary.bold,
        }),
      },
      {
        query: { isHovered: true },
        vars: assignPartialVars(inputColorVars, {
          border: semanticColorVars.border.interactive.hover,
        }),
      },
      {
        query: { isFocused: true },
        vars: assignPartialVars(inputColorVars, {
          border: semanticColorVars.border.interactive.highlight,
        }),
      },
      {
        query: { isInvalid: true },
        vars: assignPartialVars(inputColorVars, {
          border: semanticColorVars.border.serious,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(inputColorVars, {
          border: semanticColorVars.background.interactive.disabled,
          color: semanticColorVars.foreground.interactive.disabled,
        }),
      },
    ]),
  ),
};
