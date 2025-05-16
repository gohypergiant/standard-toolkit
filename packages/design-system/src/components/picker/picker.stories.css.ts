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
import { semanticColorVars, sizeVars } from '../../styles/theme.css';
import { assignPartialVars, containerQueries } from '../../utils/css';
import { pickerItemColorVars, pickerItemStateVars } from './picker.css';
import type { PickerItemState } from './types';

export const colorPickerItem = style({
  width: 16,
  height: 16,
  padding: sizeVars.v01,
  '@container': containerQueries<PickerItemState>(
    pickerItemStateVars,
    {
      query: { operator: 'or', isHovered: true, isPressed: true },
      vars: assignPartialVars(pickerItemColorVars, {
        border: semanticColorVars.border.interactive.hover,
      }),
    },
    {
      query: { isSelected: true },
      vars: assignPartialVars(pickerItemColorVars, {
        border: semanticColorVars.border.interactive.highlight,
      }),
    },
  ),
});

export const colorSwatch = style({
  width: '100%',
  height: '100%',
});

export const iconPickerItem = style({
  vars: assignPartialVars(pickerItemColorVars, {
    color: semanticColorVars.foreground.interactive.primary.subtle,
  }),
  '@container': containerQueries<PickerItemState>(
    pickerItemStateVars,
    {
      query: { operator: 'or', isHovered: true, isPressed: true },
      vars: assignPartialVars(pickerItemColorVars, {
        color: semanticColorVars.foreground.interactive.primary.bold,
      }),
    },
    {
      query: { isSelected: true },
      vars: assignPartialVars(pickerItemColorVars, {
        color: semanticColorVars.foreground.interactive.highlight,
      }),
    },
  ),
});
