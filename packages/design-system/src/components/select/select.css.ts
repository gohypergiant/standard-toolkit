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
import { typographyVars } from '../../styles/theme.css';
import { label } from '../../styles/typography.css';
import { inputColorVars } from '../input/input.css';
import type { SelectClassNames } from './types';

export const selectContainer = createContainer();

export const selectColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const selectSpaceVars = createThemeContract({
  width: '',
  x: '',
  y: '',
});

export const selectStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isOpen: '',
  isRequired: '',
  isFocused: '',
  isFocusVisible: '',
});

export const selectClassNames: SelectClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: selectContainer,
        display: 'contents',
      },
    },
  }),
  select: style({
    '@layer': {
      [layers.components.l1]: {
        width: fallbackVar(selectSpaceVars.width, 'fit-content'),
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
  toggle: {
    button: style({
      '@layer': {
        [layers.components.l2]: {
          fontFamily: typographyVars.mono,
          justifyContent: 'space-between',
        },
      },
    }),
  },
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: selectColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: selectColorVars.error.color,
      },
    },
  }),
  value: style({
    '@layer': {
      [layers.components.l1]: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  }),
};
