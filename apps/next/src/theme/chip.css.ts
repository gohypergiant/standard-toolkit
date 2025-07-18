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
  type ChipState,
  chipColorVars,
  chipSpaceVars,
  chipStateVars,
  genericColorVars,
  sizeVars,
  type ThemeContext,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Chip: ThemeContext['Chip'] = {
  list: style({
    vars: assignPartialVars(chipSpaceVars, {
      list: {
        gap: sizeVars.v04,
      },
    }),
  }),
  chip: style(
    applyThemeVars<ChipState>(chipStateVars, [
      {
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.base.v5,
          border: genericColorVars.condition.base.v3,
          color: genericColorVars.neutral.v01,
        }),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(chipSpaceVars, {
          chip: {
            x: sizeVars.v04,
            y: sizeVars.v02,
            gap: sizeVars.v02,
          },
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(chipSpaceVars, {
          chip: {
            x: sizeVars.v05,
            y: sizeVars.v03,
            gap: sizeVars.v03,
          },
        }),
      },
      {
        query: {
          operator: 'or',
          allowsRemoving: true,
          selectionMode: ['single', 'multiple'],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.neutral.v09,
          border: genericColorVars.neutral.v05,
        }),
      },
      {
        query: {
          operator: 'or',
          isHovered: true,
          isPressed: true,
        },
        vars: assignPartialVars(chipColorVars, {
          border: genericColorVars.neutral.v01,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'primary',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.highlight.primary.v5,
          border: genericColorVars.highlight.primary.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'secondary',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.highlight.secondary.v5,
          border: genericColorVars.highlight.secondary.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'tertiary',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.highlight.tertiary.v5,
          border: genericColorVars.highlight.tertiary.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'advisory',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.advisory.v5,
          border: genericColorVars.condition.advisory.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'affirmative',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.affirmative.v5,
          border: genericColorVars.condition.affirmative.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'serious',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.serious.v5,
          border: genericColorVars.condition.serious.v3,
        }),
      },
      {
        query: {
          operator: 'and',
          groups: [
            {
              color: 'critical',
            },
            {
              operator: 'or',
              selectionMode: 'none',
              isSelected: true,
            },
          ],
        },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.condition.critical.v5,
          border: genericColorVars.condition.critical.v3,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(chipColorVars, {
          background: genericColorVars.neutral.v07,
          border: genericColorVars.neutral.v05,
          color: genericColorVars.neutral.v05,
        }),
      },
    ]),
  ),
};
