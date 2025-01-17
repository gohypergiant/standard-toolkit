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
  createContainer,
  createThemeContract,
  fallbackVar,
  style,
} from '@vanilla-extract/css';
import { layers } from '../../styles';
import { containerQueries } from '../../utils';
import type { PickerClassNames, PickerItemState, PickerState } from './types';

export const pickerContainers = {
  list: createContainer(),
  item: createContainer(),
};

export const pickerSpaceVars = createThemeContract({
  gap: '',
});

export const pickerStateVars = createThemeContract({
  columns: '',
  layout: '',
  orientation: '',
  isEmpty: '',
  isFocused: '',
  isFocusVisible: '',
});

export const pickerItemColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const pickerItemStateVars = createThemeContract({
  selectionMode: '',
  selectionBehavior: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPressed: '',
  isSelected: '',
});

export const pickerClassNames: PickerClassNames = {
  list: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: pickerContainers.list,
          display: 'contents',
        },
      },
    }),
    list: style({
      '@layer': {
        [layers.components.l1]: {
          gap: pickerSpaceVars.gap,
          '@container': containerQueries<PickerState>(
            pickerStateVars,
            {
              query: { layout: 'grid' },
              display: 'grid',
              gridTemplateColumns: `repeat(${fallbackVar(pickerStateVars.columns, '1')}, min-content)`,
            },
            {
              query: { layout: 'stack', orientation: 'horizontal' },
              display: 'flex',
              flexDirection: 'row',
            },
            {
              query: { layout: 'stack', orientation: 'vertical' },
              display: 'flex',
              flexDirection: 'column',
            },
          ),
        },
      },
    }),
  },
  item: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: pickerContainers.item,
          display: 'contents',
        },
      },
    }),
    item: style({
      '@layer': {
        [layers.components.l1]: {
          border: `1px solid ${fallbackVar(pickerItemColorVars.border, 'transparent')}`,
          background: pickerItemColorVars.background,
          color: pickerItemColorVars.color,
          '@container': containerQueries<PickerItemState>(
            pickerItemStateVars,
            {
              query: { selectionMode: ['single', 'multiple'] },
              cursor: 'pointer',
            },
            {
              query: { isDisabled: true },
              cursor: 'not-allowed',
            },
          ),
        },
      },
    }),
  },
};
