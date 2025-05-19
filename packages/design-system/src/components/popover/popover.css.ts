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
import { surfaces } from '../../styles/surfaces.css';
import { radiusVars, zIndexVars } from '../../styles/theme.css';
import type { PopoverClassNames } from './types';

export const popoverContainer = createContainer();

export const popoverColorVars = createThemeContract({
  content: {
    color: '',
  },
});

export const popoverSpaceVars = createThemeContract({
  width: '',
  x: '',
  y: '',
  gap: {
    default: '',
    header: {
      after: '',
    },
    content: {
      before: '',
    },
    footer: {
      before: '',
    },
  },
});

export const popoverStateVars = createThemeContract({
  hasHeader: '',
  placement: '',
  isEntering: '',
  isExiting: '',
});

const header = style({
  '@layer': {
    [layers.components.l1]: {
      marginBottom: `calc(${popoverSpaceVars.gap.header.after} - ${popoverSpaceVars.gap.default})`,
    },
  },
});

const content = style({
  '@layer': {
    [layers.components.l1]: {
      color: popoverColorVars.content.color,
    },
  },
});

export const popoverClassNames: PopoverClassNames = {
  popover: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: popoverContainer,
          display: 'block',
          zIndex: `${zIndexVars.popover} !important`, // Need to override inline style set by React Aria
        },
      },
    }),
    popover: style([
      surfaces.raised.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            width: fallbackVar(popoverSpaceVars.width, '300px'),
            display: 'flex',
            flexDirection: 'column',
            gap: popoverSpaceVars.gap.default,
            padding: `${fallbackVar(popoverSpaceVars.y, '0')} ${fallbackVar(popoverSpaceVars.x, '0')}`,
            borderRadius: radiusVars.md,
          },
        },
      },
    ]),
  },
  header,
  content,
  footer: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: `calc(${popoverSpaceVars.gap.footer.before} - ${popoverSpaceVars.gap.default})`,
      },
    },
  }),
};
