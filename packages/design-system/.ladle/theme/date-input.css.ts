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
  type DateInputState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  dateInputColorVars,
  dateInputSpaceVars,
  dateInputStateVars,
  semanticColorVars,
  sizeVars,
} from '../../src';

export const DateInput: ThemeContext['DateInput'] = {
  icon: {
    icon: style(
      applyThemeVars<DateInputState>(dateInputStateVars, [
        {
          query: { isDisabled: true },
          vars: assignPartialVars(dateInputColorVars, {
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ]),
    ),
  },
  input: {
    input: style(
      applyThemeVars<DateInputState>(dateInputStateVars, [
        {
          vars: assignPartialVars(
            { color: dateInputColorVars, space: dateInputSpaceVars },
            {
              color: {
                border: semanticColorVars.border.interactive.default,
              },
              space: {
                input: {
                  gap: sizeVars.v03,
                  y: sizeVars.v04,
                  x: sizeVars.v04,
                },
              },
            },
          ),
        },
        {
          query: { size: 'sm' },
          vars: assignPartialVars(dateInputSpaceVars, {
            input: {
              maxWidth: '200px',
              x: sizeVars.v03,
              y: sizeVars.v02,
            },
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(dateInputSpaceVars, {
            input: {
              maxWidth: '400px',
              x: sizeVars.v04,
              y: sizeVars.v03,
            },
          }),
        },
        {
          query: { isHovered: true },
          vars: assignPartialVars(dateInputColorVars, {
            border: semanticColorVars.border.interactive.hover,
          }),
        },
        {
          query: { isFocusWithin: true },
          vars: assignPartialVars(dateInputColorVars, {
            border: semanticColorVars.border.interactive.highlight,
          }),
        },
        {
          query: { isInvalid: true },
          vars: assignPartialVars(dateInputColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
        {
          query: { isDisabled: true },
          vars: assignPartialVars(dateInputColorVars, {
            border: semanticColorVars.background.interactive.disabled,
            color: semanticColorVars.foreground.interactive.disabled,
          }),
        },
      ]),
    ),
    segments: style(
      applyThemeVars<DateInputState>(dateInputStateVars, [
        {
          vars: assignPartialVars(dateInputSpaceVars, {
            segments: {
              gap: sizeVars.v03,
            },
          }),
        },
      ]),
    ),
  },
};
