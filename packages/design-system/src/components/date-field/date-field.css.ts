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
import { layers } from '../../styles/layers.css';
import { label } from '../../styles/typography.css';
import type { DateFieldClassNames } from './types';

export const dateFieldContainer = createContainer();

export const dateFieldSpaceVars = createThemeContract({
  x: '',
  y: '',
  gap: '',
  minWidth: '',
  width: '',
  maxWidth: '',
});

export const dateFieldColorVars = createThemeContract({
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

export const dateFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isFocused: '',
  isHovered: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const dateFieldClassNames: DateFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: dateFieldContainer,
      },
    },
  }),
  dateField: style({
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
          color: dateFieldColorVars.label.color,
        },
      },
    },
  ]),
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: dateFieldColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: dateFieldColorVars.error.color,
      },
    },
  }),
};
