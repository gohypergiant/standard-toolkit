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
import { radiusVars, typographyVars } from '../../styles/theme.css';
import { containerQueries } from '../../utils/css';
import type { InputClassNames, InputState } from './types';

export const inputContainer = createContainer();

export const inputColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const inputSpaceVars = createThemeContract({
  minWidth: '',
  width: '',
  maxWidth: '',
  x: '',
  y: '',
});

export const inputStateVars = createThemeContract({
  length: '',
  size: '',
  type: '',
  isDisabled: '',
  isEmpty: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isInvalid: '',
  isPlaceholder: '',
  isReadOnly: '',
  isRequired: '',
});

export const inputClassNames: InputClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: inputContainer,
        display: 'contents',
      },
    },
  }),
  /**
   * A sizer is necessary to override the default behavior of inputs
   * Browsers adhere to the size attribute and ignore the min-width
   * CSS which makes creating very small inputs impossible
   */
  sizer: style({
    '@layer': {
      [layers.components.l1]: {
        minWidth: fallbackVar(inputSpaceVars.minWidth, 'auto'),
        width: fallbackVar(inputSpaceVars.width, '100%'),
        maxWidth: fallbackVar(inputSpaceVars.maxWidth, '100%'),
        fontFamily: typographyVars.mono,
      },
    },
  }),
  input: style({
    '@layer': {
      [layers.components.l1]: {
        width: '100%',
        padding: `${fallbackVar(inputSpaceVars.y, '0')} ${fallbackVar(inputSpaceVars.x, '0')}`,
        border: `1px solid ${fallbackVar(inputColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.md,
        background: inputColorVars.background,
        fontFamily: typographyVars.mono,
        color: inputColorVars.color,
        '::-webkit-inner-spin-button': {
          display: 'none',
        },
        '@container': containerQueries<InputState>(inputStateVars, {
          query: { isDisabled: true },
          cursor: 'not-allowed',
        }),
      },
    },
  }),
};
