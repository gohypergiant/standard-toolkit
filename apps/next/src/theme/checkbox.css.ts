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
  type CheckboxGroupState,
  type CheckboxState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  checkboxColorVars,
  checkboxGroupStateVars,
  checkboxSpaceVars,
  checkboxStateVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const Checkbox: ThemeContext['Checkbox'] = {
  group: {
    group: style(
      applyThemeVars<CheckboxGroupState>(checkboxGroupStateVars, [
        {
          vars: assignPartialVars(checkboxSpaceVars, {
            elementGap: sizeVars.v04,
          }),
        },
      ]),
    ),
  },
  checkbox: {
    checkbox: style(
      applyThemeVars<CheckboxState>(checkboxStateVars, [
        {
          vars: assignPartialVars(
            { color: checkboxColorVars, space: checkboxSpaceVars },
            {
              color: {
                border: genericColorVars.neutral.v03,
                background: genericColorVars.neutral.v10,
                color: genericColorVars.neutral.v01,
                indicator: genericColorVars.neutral.v10,
              },
              space: {
                dimension: '16px',
                gap: sizeVars.v04,
              },
            },
          ),
        },
        {
          query: {
            operator: 'or',
            isHovered: true,
            isPressed: true,
            isFocused: true,
          },
          vars: assignPartialVars(checkboxColorVars, {
            border: genericColorVars.neutral.v01,
          }),
        },
        {
          query: {
            operator: 'or',
            isSelected: true,
            isIndeterminate: true,
          },
          vars: assignPartialVars(checkboxColorVars, {
            border: genericColorVars.highlight.primary.v3,
            background: genericColorVars.highlight.primary.v3,
          }),
        },
        {
          query: {
            isInvalid: true,
          },
          vars: assignPartialVars(checkboxColorVars, {
            border: semanticColorVars.border.serious,
          }),
        },
        {
          query: { isDisabled: true },
          vars: assignPartialVars(checkboxColorVars, {
            border: genericColorVars.neutral.v06,
            color: genericColorVars.neutral.v06,
          }),
        },
        {
          query: {
            operator: 'and',
            groups: [
              { operator: 'or', isSelected: true, isIndeterminate: true },
              { isDisabled: true },
            ],
          },
          vars: assignPartialVars(checkboxColorVars, {
            background: genericColorVars.neutral.v06,
          }),
        },
      ]),
    ),
  },
};
