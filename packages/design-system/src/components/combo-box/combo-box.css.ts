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
import { focusOutlineStyle, radiusVars } from '../../styles/theme.css';
import { label } from '../../styles/typography.css';
import { inputColorVars } from '../input/input.css';
import type { ComboBoxClassNames } from './types';

export const comboBoxContainer = createContainer();

export const comboBoxColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const comboBoxSpaceVars = createThemeContract({
  x: '',
  y: '',
});

export const comboBoxStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isOpen: '',
  isRequired: '',
});

export const comboBoxClassNames: ComboBoxClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: comboBoxContainer,
        display: 'contents',
      },
    },
  }),
  comboBox: style({
    '@layer': {
      [layers.components.l1]: {
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
  }),
  label: style([
    label,
    {
      '@layer': {
        [layers.components.l1]: {
          color: inputColorVars.color,
        },
      },
    },
  ]),
  group: style({
    '@layer': {
      [layers.components.l1]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: `${fallbackVar(comboBoxSpaceVars.y, '0')} ${fallbackVar(comboBoxSpaceVars.x, '0')}`,
      },
    },
  }),
  input: {
    sizer: style({
      '@layer': {
        [layers.components.l2]: {
          '::before': {
            content: '',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'block',
            border: `1px solid ${fallbackVar(inputColorVars.border, 'transparent')}`,
            borderRadius: radiusVars.md,
            background: inputColorVars.background,
            color: inputColorVars.color,
          },
          selectors: {
            '&:has(:focus-visible)::before': focusOutlineStyle,
          },
        },
      },
    }),
    input: style({
      '@layer': {
        [layers.components.l2]: {
          position: 'relative',
          padding: 0,
          border: 'none',
          background: 'none',
          selectors: {
            '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
              // biome-ignore lint/style/useNamingConvention: intentional
              WebkitAppearance: 'none',
            },
            '&:focus-visible': {
              outline: 'none',
            },
          },
        },
      },
    }),
  },
  toggle: {
    button: style({
      '@layer': {
        [layers.components.l2]: {
          position: 'relative',
          padding: 0,
          background: 'none',
        },
      },
    }),
  },
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: comboBoxColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: comboBoxColorVars.error.color,
      },
    },
  }),
};
