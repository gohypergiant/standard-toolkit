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
import type { DateInputClassNames, DateInputState } from './types';

export const dateInputContainer = createContainer();
export const dateSegmentsContainer = createContainer();

export const dateInputStateVars = createThemeContract({
  size: '',
  isHovered: '',
  isFocusWithin: '',
  isFocusVisible: '',
  isDisabled: '',
  isInvalid: '',
});

export const dateSegmentStateVars = createThemeContract({
  isHovered: '',
  isFocused: '',
  isFocusVisible: '',
  isDisabled: '',
  isInvalid: '',
  isPlaceholder: '',
  isReadOnly: '',
  isEditable: '',
});

export const dateInputSpaceVars = createThemeContract({
  input: {
    x: '',
    y: '',
    gap: '',
    minWidth: '',
    width: '',
    maxWidth: '',
  },
  segments: {
    gap: '',
  },
});

export const dateInputColorVars = createThemeContract({
  border: '',
  color: '',
  description: {
    color: '',
  },
  error: {
    color: '',
  },
});

export const dateInputClassNames: DateInputClassNames = {
  icon: {
    container: style({
      color: fallbackVar(dateInputColorVars.color, 'currentcolor'),
    }),
  },
  input: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: dateInputContainer,
        },
      },
    }),
    input: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: dateInputSpaceVars.input.gap,
          padding: `${fallbackVar(dateInputSpaceVars.input.y, '0')} ${fallbackVar(dateInputSpaceVars.input.x, '0')}`,
          border: `1px solid ${fallbackVar(dateInputColorVars.border, 'transparent')}`,
          borderRadius: radiusVars.sm,
          minWidth: fallbackVar(dateInputSpaceVars.input.minWidth, 'auto'),
          width: fallbackVar(dateInputSpaceVars.input.width, 'fit-content'),
          maxWidth: fallbackVar(dateInputSpaceVars.input.maxWidth, '100%'),
          color: dateInputColorVars.color,
          '@container': containerQueries<DateInputState>(dateInputStateVars, {
            query: { isDisabled: true },
            cursor: 'not-allowed',
          }),
        },
      },
    }),
    segments: style({
      '@layer': {
        [layers.components.l1]: {
          display: 'flex',
          gap: dateInputSpaceVars.segments.gap,
        },
      },
    }),
  },
  segment: {
    container: style({
      '@layer': {
        [layers.components.l1]: {
          containerName: dateSegmentsContainer,
          selectors: {
            '&:focus-visible': {
              outline: 'none',
            },
          },
        },
      },
    }),
    segment: style({
      '@layer': {
        [layers.components.l1]: {
          selectors: {
            '&:focus-visible': {
              outline: 'none',
            },
          },
        },
      },
    }),
  },
};
