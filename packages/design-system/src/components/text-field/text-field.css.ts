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
import type { TextFieldClassNames } from './types';

export const textFieldContainer = createContainer();

export const textFieldColorVars = createThemeContract({
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const textFieldSpaceVars = createThemeContract({
  gap: '',
});

export const textFieldStateVars = createThemeContract({
  size: '',
  isDisabled: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const textFieldClassNames: TextFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: textFieldContainer,
      },
    },
  }),
  textField: style({
    '@layer': {
      [layers.components.l1]: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: textFieldSpaceVars.gap,
      },
    },
  }),
  label: style([label]),
  description: style({
    '@layer': {
      [layers.components.l1]: {
        color: textFieldColorVars.description.color,
      },
    },
  }),
  error: style({
    '@layer': {
      [layers.components.l1]: {
        color: textFieldColorVars.error.color,
      },
    },
  }),
};
