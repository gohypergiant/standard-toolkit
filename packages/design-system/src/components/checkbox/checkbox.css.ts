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
import { label } from '../../styles/typography.css';
import { containerQueries } from '../../utils/css';
import type {
  CheckboxClassNames,
  CheckboxGroupState,
  CheckboxState,
} from './types';

export const checkboxContainer = createContainer();

export const checkboxGroupContainer = createContainer();

export const checkboxColorVars = createThemeContract({
  border: '',
  background: '',
  color: '',
  indicator: '',
});

export const checkboxSpaceVars = createThemeContract({
  dimension: '',
  gap: '',
  elementGap: '',
});

export const checkboxStateVars = createThemeContract({
  alignInput: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isIndeterminate: '',
  isInvalid: '',
  isPressed: '',
  isReadOnly: '',
  isRequired: '',
  isSelected: '',
});

export const checkboxGroupStateVars = createThemeContract({
  orientation: '',
  isDisabled: '',
  isReadOnly: '',
  isRequired: '',
  isInvalid: '',
});

export const checkboxClassNames: CheckboxClassNames = {
  checkbox: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: checkboxContainer,
          display: 'block',
          width: 'fit-content',
        },
      },
    }),
    checkbox: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          alignItems: 'center',
          gap: checkboxSpaceVars.gap,
          color: checkboxColorVars.color,
          '@container': containerQueries<CheckboxState>(
            checkboxStateVars,
            {
              query: { alignInput: 'start' },
              flexDirection: 'row-reverse',
            },
            {
              query: { alignInput: 'end' },
              flexDirection: 'row',
            },
            {
              query: { isReadOnly: false },
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
    icon: {
      container: style({
        '@layer': {
          [layers.components.l2]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: checkboxSpaceVars.dimension,
            height: checkboxSpaceVars.dimension,
            color: fallbackVar(checkboxColorVars.indicator, 'currentcolor'),
            border: `1px solid ${fallbackVar(checkboxColorVars.border, 'transparent')}`,
            borderRadius: radiusVars.sm,
            background: fallbackVar(checkboxColorVars.background, 'none'),
          },
        },
      }),
    },
    label: style([
      label,
      {
        '@layer': {
          [layers.components.l1]: {
            color: checkboxColorVars.color,
          },
        },
      },
    ]),
  },
  group: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: checkboxGroupContainer,
          display: 'contents',
        },
      },
    }),
    group: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          flexDirection: 'column',
          gap: fallbackVar(checkboxSpaceVars.elementGap, checkboxSpaceVars.gap),
          '@container': containerQueries<CheckboxGroupState>(
            checkboxGroupStateVars,
            {
              query: { orientation: 'horizontal' },
              flexDirection: 'row',
            },
            {
              query: { orientation: 'vertical' },
              flexDirection: 'column',
            },
          ),
        },
      },
    }),
    label: style([
      label,
      {
        '@layer': {
          [layers.components.l1]: {
            color: checkboxColorVars.color,
          },
        },
      },
    ]),
  },
};
