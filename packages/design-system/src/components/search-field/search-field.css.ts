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
import { focusOutlineStyle, layers, radiusVars } from '../../styles';
import { containerQueries } from '../../utils/css';
import { inputColorVars } from '../input/input.css';
import type { SearchFieldClassNames, SearchFieldState } from './types';

export const searchFieldContainer = createContainer();

export const searchFieldSpaceVars = createThemeContract({
  x: '',
  y: '',
});

export const searchFieldStateVars = createThemeContract({
  size: '',
  variant: '',
  isEmpty: '',
  isDisabled: '',
  isInvalid: '',
  isReadOnly: '',
  isRequired: '',
});

export const searchFieldClassNames: SearchFieldClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: searchFieldContainer,
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  }),
  group: style({
    '@layer': {
      [layers.components.l1]: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: `${fallbackVar(searchFieldSpaceVars.y, '0')} ${fallbackVar(searchFieldSpaceVars.x, '0')}`,
      },
    },
  }),
  icon: {
    icon: style({
      '@layer': {
        [layers.components.l2]: {
          position: 'relative',
          zIndex: 1,
        },
      },
    }),
  },
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
            borderRadius: radiusVars.round,
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
          background: 'none',
          border: 'none',
          selectors: {
            '&::-webkit-search-cancel-button, &::-webkit-search-decoration': {
              // biome-ignore lint/style/useNamingConvention: valid CSS property
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
  clear: {
    button: style({
      '@layer': {
        [layers.components.l2]: {
          position: 'relative',
          flex: 0,
          borderRadius: radiusVars.round,
          '@container': containerQueries<SearchFieldState>(
            searchFieldStateVars,
            {
              query: { isEmpty: true },
              visibility: 'hidden',
              pointerEvents: 'none',
            },
          ),
        },
      },
    }),
  },
};
