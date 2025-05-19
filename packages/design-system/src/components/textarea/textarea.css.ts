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
import type { TextAreaClassNames, TextAreaState } from './types';

export const textAreaContainer = createContainer();

export const textAreaColorVars = createThemeContract({
  background: '',
  border: '',
  color: '',
});

export const textAreaSpaceVars = createThemeContract({
  minWidth: '',
  width: '',
  maxWidth: '',
  minHeight: '',
  height: '',
  maxHeight: '',
  x: '',
  y: '',
});

export const textAreaStateVars = createThemeContract({
  resize: '',
  size: '',
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

export const textAreaClassNames: TextAreaClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: textAreaContainer,
        display: 'contents',
      },
    },
  }),
  textarea: style({
    '@layer': {
      [layers.components.l1]: {
        minWidth: fallbackVar(textAreaSpaceVars.minWidth, 'auto'),
        width: fallbackVar(textAreaSpaceVars.width, '100%'),
        maxWidth: fallbackVar(textAreaSpaceVars.maxWidth, '100%'),
        minHeight: fallbackVar(textAreaSpaceVars.minHeight, 'auto'),
        height: fallbackVar(textAreaSpaceVars.height, 'auto'),
        maxHeight: fallbackVar(textAreaSpaceVars.maxHeight, 'none'),
        display: 'block',
        padding: `${fallbackVar(textAreaSpaceVars.y, '0')} ${fallbackVar(textAreaSpaceVars.x, '0')}`,
        border: `1px solid ${fallbackVar(textAreaColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.md,
        background: textAreaColorVars.background,
        fontFamily: typographyVars.mono,
        color: textAreaColorVars.color,
        overflow: 'auto',
        resize: textAreaStateVars.resize,
        selectors: {
          '&[contenteditable]:empty::before': {
            content: 'attr(data-placeholder)',
          },
        },
        '@container': containerQueries<TextAreaState>(textAreaStateVars, {
          query: { isDisabled: true },
          cursor: 'not-allowed',
        }),
      },
    },
  }),
};
