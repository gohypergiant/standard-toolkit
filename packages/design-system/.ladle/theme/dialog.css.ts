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

import { style } from '@vanilla-extract/css';
import {
  applyThemeVars,
  assignPartialVars,
  type DialogState,
  dialogColorVars,
  dialogSpaceVars,
  dialogStateVars,
  genericColorVars,
  sizeVars,
  type ThemeContext,
} from '../../src';

export const Dialog: ThemeContext['Dialog'] = {
  container: style(
    applyThemeVars<DialogState>(dialogStateVars, [
      {
        vars: assignPartialVars(dialogColorVars, {
          overlay: `rgb(from ${genericColorVars.neutral.v10} r g b / 0.4)`,
        }),
      },
    ]),
  ),
  dialog: style(
    applyThemeVars<DialogState>(dialogStateVars, [
      {
        query: {
          size: 'sm',
        },
        vars: assignPartialVars(dialogSpaceVars, {
          width: '280px',
          x: sizeVars.v06,
          y: sizeVars.v06,
          gap: {
            default: sizeVars.v03,
            header: {
              after: sizeVars.v03,
            },
            footer: {
              before: sizeVars.v06,
            },
          },
        }),
      },
      {
        query: {
          size: 'lg',
        },
        vars: assignPartialVars(dialogSpaceVars, {
          width: '320px',
          x: sizeVars.v07,
          y: sizeVars.v08,
          gap: {
            default: sizeVars.v06,
            header: {
              after: sizeVars.v06,
            },
            footer: {
              before: sizeVars.v09,
            },
          },
        }),
      },
    ]),
  ),
  content: style(
    applyThemeVars<DialogState>(dialogStateVars, [
      {
        query: { hasHeader: true },
        vars: assignPartialVars(dialogColorVars, {
          content: { color: genericColorVars.neutral.v03 },
        }),
      },
    ]),
  ),
};
