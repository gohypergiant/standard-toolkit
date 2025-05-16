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
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { layers } from '../../styles/layers.css';
import type { IconClassNames } from './types';

export const iconContainer = createContainer();

export const iconColorVars = createThemeContract({
  color: '',
  fill: '',
  stroke: '',
});

export const iconSpaceVars = createThemeContract({
  width: '',
  height: '',
});

export const iconStateVars = createThemeContract({
  color: '',
  fill: '',
  size: '',
  stroke: '',
});

export const iconClassNames: IconClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: iconContainer,
        display: 'contents',
      },
    },
  }),
  icon: style({
    '@layer': {
      [layers.components.l1]: {
        width: fallbackVar(iconSpaceVars.width, 'auto'),
        height: fallbackVar(iconSpaceVars.height, iconSpaceVars.width, 'auto'),
        color: fallbackVar(iconStateVars.color, iconColorVars.color, 'inherit'),
        fill: fallbackVar(iconStateVars.fill, iconColorVars.fill, 'none'),
        stroke: fallbackVar(iconStateVars.stroke, iconColorVars.stroke, 'none'),
        overflow: 'hidden',
      },
    },
  }),
};

globalStyle(`${iconClassNames.icon} > svg`, {
  '@layer': {
    [layers.components.l1]: {
      width: '100%',
      height: '100%',
    },
  },
});
