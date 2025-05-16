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
import { label } from '../../styles/typography.css';
import { containerQueries } from '../../utils/css';
import type { RadioClassNames, RadioGroupState, RadioState } from './types';

export const radioContainer = createContainer();

export const radioGroupContainer = createContainer();

export const radioColorVars = createThemeContract({
  border: '',
  background: '',
  color: '',
});

export const radioSpaceVars = createThemeContract({
  diameter: '',
  gap: '',
  elementGap: '',
});

export const radioStateVars = createThemeContract({
  alignInput: '',
  isDisabled: '',
  isFocused: '',
  isFocusVisible: '',
  isHovered: '',
  isPressed: '',
  isReadOnly: '',
  isSelected: '',
  isInvalid: '',
  isRequired: '',
});

export const radioGroupStateVars = createThemeContract({
  alignInput: '',
  orientation: '',
  isDisabled: '',
  isReadOnly: '',
  isInvalid: '',
  isRequired: '',
});

export const radioClassNames: RadioClassNames = {
  radio: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: radioContainer,
          width: 'fit-content',
          display: 'block',
        },
      },
    }),
    radio: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          alignItems: 'center',
          color: radioColorVars.color,
          gap: radioSpaceVars.gap,
          '::before': {
            content: '',
            display: 'block',
            border: `1px solid ${radioColorVars.border}`,
            width: radioSpaceVars.diameter,
            height: radioSpaceVars.diameter,
            borderRadius: radiusVars.round,
            backgroundImage: `radial-gradient(
              circle,
              ${radioColorVars.background} 0,
              ${radioColorVars.background} 40%,
              transparent 50%,
              transparent 100%
            )`,
          },
          '@container': containerQueries<RadioState>(
            radioStateVars,
            {
              query: { alignInput: 'start' },
              flexDirection: 'row-reverse',
            },
            {
              query: { alignInput: 'end' },
              flexDirection: 'row',
            },
            {
              query: { isReadOnly: false },
              cursor: 'pointer',
            },
            {
              query: { isDisabled: true },
              cursor: 'not-allowed',
            },
          ),
        },
      },
    }),
  },
  group: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: radioGroupContainer,
          display: 'contents',
        },
      },
    }),
    group: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: fallbackVar(radioSpaceVars.elementGap, radioSpaceVars.gap),
          '@container': containerQueries<RadioGroupState>(
            radioGroupStateVars,
            {
              query: { orientation: 'horizontal' },
              flexDirection: 'row',
            },
            {
              query: { orientation: 'vertical' },
              flexDirection: 'column',
            },
          ),
        },
      },
    }),
  },
  label: style([label]),
};
