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
import type {
  TooltipClassNames,
  TooltipState,
  TooltipTargetState,
} from './types';

export const tooltipContainers = {
  tooltip: createContainer(),
  target: createContainer(),
};

export const tooltipSpaceVars = createThemeContract({
  x: '',
  y: '',
});

export const tooltipStateVars = createThemeContract({
  containerPadding: '',
  crossOffset: '',
  offset: '',
  placement: '',
  isEntering: '',
  isExiting: '',
  isOpen: '',
});

export const tooltipTargetStateVars = createThemeContract({
  focusable: '',
  relative: '',
});

export const tooltipClassNames: TooltipClassNames = {
  tooltip: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tooltipContainers.tooltip,
          display: 'block', // Need to override conflict with base theme style
          zIndex: `${zIndexVars.tooltip} !important`, // Need to override inline style set by React Aria
        },
      },
    }),
    tooltip: style([
      surfaces.overlay.proud,
      {
        '@layer': {
          [layers.components.l1]: {
            padding: `${fallbackVar(tooltipSpaceVars.y, '0')} ${fallbackVar(tooltipSpaceVars.x, '0')}`,
            borderRadius: radiusVars.md,
            textAlign: 'center',
            '@container': containerQueries<TooltipState>(
              tooltipStateVars,
              {
                query: { placement: 'top' },
                marginBottom: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
              {
                query: { placement: 'right' },
                marginLeft: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
              {
                query: { placement: 'bottom' },
                marginTop: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
              {
                query: { placement: 'left' },
                marginRight: `calc(${tooltipStateVars.containerPadding} * 1px)`,
              },
            ),
          },
        },
      },
    ]),
  },

  target: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: tooltipContainers.target,
          display: 'contents',
        },
      },
    }),
    target: style({
      '@layer': {
        [layers.components.l1]: {
          width: 'fit-content',
          '::before': {
            content: '',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          '@container': containerQueries<TooltipTargetState>(
            tooltipTargetStateVars,
            {
              query: { relative: 'self' },
              position: 'relative',
            },
          ),
        },
      },
    }),
  },
};
