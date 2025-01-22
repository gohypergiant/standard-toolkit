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
  type TextAreaState,
  type ThemeContext,
  applyThemeVars,
  assignPartialVars,
  genericColorVars,
  semanticColorVars,
  sizeVars,
  textAreaColorVars,
  textAreaSpaceVars,
  textAreaStateVars,
} from '@accelint/design-system/vanilla';
import { style } from '@vanilla-extract/css';

export const TextArea: ThemeContext['TextArea'] = {
  textarea: style(
    applyThemeVars<TextAreaState>(textAreaStateVars, [
      {
        vars: assignPartialVars(
          { color: textAreaColorVars, space: textAreaSpaceVars },
          {
            color: {
              background: genericColorVars.neutral.v08,
              border: semanticColorVars.border.interactive.default,
            },
            space: {
              maxWidth: '400px',
            },
          },
        ),
      },
      {
        query: { size: 'sm' },
        vars: assignPartialVars(textAreaSpaceVars, {
          x: sizeVars.v03,
          y: sizeVars.v02,
        }),
      },
      {
        query: { size: 'lg' },
        vars: assignPartialVars(textAreaSpaceVars, {
          x: sizeVars.v04,
          y: sizeVars.v03,
        }),
      },
      {
        query: { isPlaceholder: true },
        vars: assignPartialVars(textAreaColorVars, {
          color: genericColorVars.neutral.v03,
        }),
      },
      {
        query: { isEmpty: false },
        vars: assignPartialVars(textAreaColorVars, {
          color: semanticColorVars.foreground.interactive.primary.bold,
        }),
      },
      {
        query: { isHovered: true },
        vars: assignPartialVars(textAreaColorVars, {
          border: semanticColorVars.border.interactive.hover,
        }),
      },
      {
        query: { isFocused: true },
        vars: assignPartialVars(textAreaColorVars, {
          border: semanticColorVars.border.interactive.highlight,
        }),
      },
      {
        query: { isInvalid: true },
        vars: assignPartialVars(textAreaColorVars, {
          border: semanticColorVars.border.serious,
        }),
      },
      {
        query: { isDisabled: true },
        vars: assignPartialVars(textAreaColorVars, {
          background: semanticColorVars.background.interactive.disabled,
          border: 'transparent',
          color: semanticColorVars.foreground.interactive.disabled,
        }),
      },
    ]),
  ),
};
