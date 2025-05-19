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
import { containerQueries } from '../../utils/css';
import type { DialogClassNames, DialogState } from './types';

export const dialogContainer = createContainer();

export const dialogColorVars = createThemeContract({
  overlay: '',
  content: {
    color: '',
  },
});

export const dialogSpaceVars = createThemeContract({
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

export const dialogStateVars = createThemeContract({
  hasHeader: '',
  size: '',
  isEntering: '',
  isExiting: '',
  isGlobal: '',
  isOpen: '',
});

const header = style({
  '@layer': {
    [layers.components.l1]: {
      marginBottom: `calc(${dialogSpaceVars.gap.header.after} - ${dialogSpaceVars.gap.default})`,
    },
  },
});

const content = style({
  '@layer': {
    [layers.components.l1]: {
      color: dialogColorVars.content.color,
    },
  },
});

export const dialogClassNames: DialogClassNames = {
  portal: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'contents',
      },
    },
  }),
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: dialogContainer,
        display: 'contents',
        '::before': {
          content: '',
          width: '100%',
          height: 'var(--visual-viewport-height)', // Provided by React Aria Modal Overlay: https://react-spectrum.adobe.com/react-aria/Modal.html#modaloverlay
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: zIndexVars.dialog,
          background: dialogColorVars.overlay,
        },
      },
    },
  }),
  modal: style({
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: zIndexVars.dialog,
    transform: 'translate(-50%, -50%)',
    '@container': containerQueries<DialogState>(dialogStateVars, {
      query: { isGlobal: false },
      position: 'absolute',
    }),
  }),
  dialog: style([
    surfaces.raised.proud,
    {
      '@layer': {
        [layers.components.l1]: {
          width: fallbackVar(dialogSpaceVars.width, '300px'),
          display: 'flex',
          flexDirection: 'column',
          gap: dialogSpaceVars.gap.default,
          padding: `${fallbackVar(dialogSpaceVars.y, '0')} ${fallbackVar(dialogSpaceVars.x, '0')}`,
          borderRadius: radiusVars.md,
        },
      },
    },
  ]),
  header,
  content,
  footer: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: `calc(${dialogSpaceVars.gap.footer.before} - ${dialogSpaceVars.gap.default})`,
      },
    },
  }),
};
