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
import { radiusVars } from '../../styles/theme.css';
import { containerQueries } from '../../utils/css';
import type { ButtonClassNames, ButtonState } from './types';

export const buttonContainer = createContainer();

export const buttonColorVars = createThemeContract({
  // Mapped
  nonSolidColor: '',
  bareBackground: '',
  hollowBorder: '',
  solidBackground: '',
  solidColor: '',

  // Overrides
  background: '',
  border: '',
  color: '',
});

export const buttonSpaceVars = createThemeContract({
  gap: '',
  minWidth: '',
  width: '',
  x: '',
  y: '',
});

export const buttonStateVars = createThemeContract({
  color: '',
  size: '',
  variant: '',
  isCurrent: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPending: '',
  isPressed: '',
  isSelected: '',
});

export const buttonClassNames: ButtonClassNames = {
  container: style({
    '@layer': {
      [layers.components.l1]: {
        containerName: buttonContainer,
        width: fallbackVar(buttonSpaceVars.width, 'fit-content'),
        display: 'block',
        background: 'none',
        padding: 0,
        border: 0,
        textDecoration: 'none',
        color: 'currentcolor',
      },
    },
  }),
  button: style({
    '@layer': {
      [layers.components.l1]: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: buttonSpaceVars.gap,
        minWidth: fallbackVar(buttonSpaceVars.minWidth, 'auto'),
        width: fallbackVar(buttonSpaceVars.width, 'fit-content'),
        padding: `${fallbackVar(buttonSpaceVars.y, '0')} ${fallbackVar(buttonSpaceVars.x, '0')}`,
        border: `1px solid ${fallbackVar(buttonColorVars.border, 'transparent')}`,
        borderRadius: radiusVars.md,
        background: fallbackVar(
          buttonColorVars.background,
          buttonColorVars.bareBackground,
          'none',
        ),
        fontWeight: 700,
        color: fallbackVar(
          buttonColorVars.color,
          buttonColorVars.nonSolidColor,
        ),
        cursor: 'pointer',
        '@container': containerQueries<ButtonState>(
          buttonStateVars,
          {
            query: { variant: ['icon', 'floating'] },
            minWidth: 'auto',
          },
          {
            query: { variant: 'floating' },
            borderRadius: radiusVars.round,
          },
          {
            query: { variant: ['floating', 'hollow'] },
            borderColor: fallbackVar(
              buttonColorVars.border,
              buttonColorVars.hollowBorder,
            ),
            background: fallbackVar(buttonColorVars.background, 'transparent'),
          },
          {
            query: { variant: 'solid' },
            background: fallbackVar(
              buttonColorVars.background,
              buttonColorVars.solidBackground,
            ),
            color: fallbackVar(
              buttonColorVars.color,
              buttonColorVars.solidColor,
            ),
          },
          {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          },
        ),
      },
    },
  }),
};
