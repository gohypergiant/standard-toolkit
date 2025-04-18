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
  style,
} from '@vanilla-extract/css';
import { label, layers } from '../../styles';
import type { TimeFieldClassNames } from './types';

export const timeFieldContainer = createContainer();

export const timeFieldSpaceVars = createThemeContract({
  x: '',
  y: '',
  gap: '',
  minWidth: '',
  width: '',
  maxWidth: '',
});

export const timeFieldColorVars = createThemeContract({
  border: '',
  description: {
    color: '',
  },
  error: {
    color: '',
  },
  label: {
    color: '',
  },
});

export const timeFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isFocused: '',
  isHovered: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const timeFieldClassNames: TimeFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: timeFieldContainer,
      },
    },
  }),
  timeField: style({
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
          color: timeFieldColorVars.label.color,
        },
      },
    },
  ]),
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: timeFieldColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: timeFieldColorVars.error.color,
      },
    },
  }),
};
