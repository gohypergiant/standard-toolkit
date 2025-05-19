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
import { layers } from '../../styles/layers.css';
import { radiusVars } from '../../styles/theme.css';
import { containerQueries } from '../../utils/css';
import type { ChipClassNames, ChipState } from './types';

export const chipContainer = createContainer();

export const chipColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const chipSpaceVars = createThemeContract({
  list: {
    gap: '',
  },
  chip: {
    gap: '',
    x: '',
    y: '',
  },
});

export const chipStateVars = createThemeContract({
  color: '',
  size: '',
  allowsRemoving: '',
  selectionBehavior: '',
  selectionMode: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPressed: '',
  isSelected: '',
});

export const chipClassNames: ChipClassNames = {
  list: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: chipSpaceVars.list.gap,
      },
    },
  }),
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: chipContainer,
        display: 'contents',
      },
    },
  }),
  chip: style({
    '@layer': {
      [layers.components.l1]: {
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${fallbackVar(chipColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.round,
        background: fallbackVar(chipColorVars.background, 'none'),
        color: fallbackVar(chipColorVars.color, 'currentcolor'),
        overflow: 'hidden',
      },
    },
  }),
  label: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        gap: chipSpaceVars.chip.gap,
        padding: `${chipSpaceVars.chip.y} ${chipSpaceVars.chip.x}`,
        border: 'none',
        background: 'none',
        color: 'currentcolor',
        '@container': containerQueries<ChipState>(
          chipStateVars,
          {
            query: { allowsRemoving: true },
            paddingRight: chipSpaceVars.chip.y,
          },
          {
            query: { selectionMode: ['single', 'multiple'] },
            cursor: 'pointer',
          },
          {
            query: {
              isDisabled: true,
            },
            cursor: 'not-allowed',
          },
        ),
      },
    },
  }),
  remove: style({
    '@layer': {
      [layers.components.l1]: {
        padding: chipSpaceVars.chip.y,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'currentcolor',
        '@container': containerQueries<ChipState>(
          chipStateVars,
          {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          },
          {
            query: { operator: 'or', isFocused: true, isFocusVisible: true },
            outline: 'none',
          },
        ),
      },
    },
  }),
};
