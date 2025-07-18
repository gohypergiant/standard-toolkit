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
  type InputState,
  inputColorVars,
  inputStateVars,
  layers,
  type SearchFieldState,
  searchFieldSpaceVars,
  searchFieldStateVars,
  semanticColorVars,
  sizeVars,
  type ThemeContext,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const SearchField: ThemeContext['SearchField'] = {
  group: style(
    applyThemeVars<SearchFieldState>(searchFieldStateVars, [
      {
        vars: assignPartialVars(searchFieldSpaceVars, {
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
    ]),
  ),
  input: {
    sizer: style(
      applyThemeVars<{ search: SearchFieldState; input: InputState }>(
        { search: searchFieldStateVars, input: inputStateVars },
        [
          {
            query: { search: { variant: 'solid' } },
            vars: assignPartialVars(inputColorVars, {
              background: semanticColorVars.background.surface.raised,
            }),
          },
          {
            query: {
              search: { variant: 'solid' },
              input: {
                isHovered: false,
                isFocused: false,
                isInvalid: false,
              },
            },
            vars: assignPartialVars(inputColorVars, {
              border: semanticColorVars.background.surface.raised,
            }),
          },
        ],
        layers.variables.l2,
      ),
    ),
  },
};
