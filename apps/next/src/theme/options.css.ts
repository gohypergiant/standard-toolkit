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
  type OptionsItemState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  optionsColorVars,
  optionsItemStateVars,
  optionsSpaceVars,
  semanticColorVars,
  sizeVars,
} from '@accelint/design-system/vanilla';
import { fallbackVar, style } from '@vanilla-extract/css';

export const Options: ThemeContext['Options'] = {
  options: {
    options: style(
      applyThemeVars<OptionsItemState>(optionsItemStateVars, [
        {
          vars: assignPartialVars(optionsSpaceVars, {
            options: {
              minWidth: fallbackVar('var(--trigger-width)', '160px'),
            },
          }),
        },
      ]),
    ),
  },
  list: {
    list: style(
      applyThemeVars<OptionsItemState>(optionsItemStateVars, [
        {
          vars: assignPartialVars(
            { color: optionsColorVars, space: optionsSpaceVars },
            {
              color: {
                list: {
                  background: semanticColorVars.background.surface.overlay,
                  border: semanticColorVars.border.static.exterior,
                },
                header: { color: genericColorVars.neutral.v03 },
                separator: genericColorVars.neutral.v03,
              },
              space: {
                header: {
                  x: `calc(${sizeVars.v03} + ${sizeVars.v03})`,
                  y: sizeVars.v03,
                },
              },
            },
          ),
        },
      ]),
    ),
  },
  item: {
    item: style(
      applyThemeVars<OptionsItemState>(optionsItemStateVars, [
        {
          vars: assignPartialVars(
            { color: optionsColorVars, space: optionsSpaceVars },
            {
              color: {
                item: {
                  color: semanticColorVars.foreground.interactive.primary.bold,
                },
                description: genericColorVars.neutral.v03,
              },
              space: {
                item: {
                  x: sizeVars.v03,
                  y: sizeVars.v04,
                  gap: `${sizeVars.v02} ${sizeVars.v03}`,
                },
              },
            },
          ),
        },
        {
          query: { size: 'sm' },
          vars: assignPartialVars(optionsSpaceVars, {
            item: {
              y: sizeVars.v03,
            },
          }),
        },
        {
          query: { size: 'lg' },
          vars: assignPartialVars(optionsSpaceVars, {
            item: {
              y: sizeVars.v04,
            },
          }),
        },
        {
          query: {
            operator: 'or',
            isHovered: true,
            isPressed: true,
            isSelected: true,
          },
          vars: assignPartialVars(optionsColorVars, {
            item: {
              background: semanticColorVars.background.highlight.bold,
              color: genericColorVars.neutral.v09,
            },
            description: genericColorVars.neutral.v09,
          }),
        },
        {
          query: {
            isDisabled: true,
          },
          vars: assignPartialVars(optionsColorVars, {
            item: { color: genericColorVars.neutral.v05 },
            description: 'currentcolor',
          }),
        },
      ]),
    ),
  },
};
